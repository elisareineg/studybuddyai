import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extractTextFromFile } from '../../utils/textExtraction';
import { generateFlashcardsWithLLM } from '../../utils/llm';
import dynamo from '../../utils/dynamo';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form with uploaded files
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      multiples: true,
    });

    // No need to create /tmp directory on Vercel
    // const uploadDir = path.join(process.cwd(), 'tmp');
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir, { recursive: true });
    // }

    // Parse the form and get files
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Handle multiple files
    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
    
    // For simplicity, only process the first file
    const file = uploadedFiles[0];
    const documentId = uuidv4();
    const filePath = file.filepath;
    const fileType = file.mimetype;
    const fileName = file.originalFilename;

    // --- Extract text from the uploaded file ---
    let extractedText;
    try {
      extractedText = await extractTextFromFile(filePath, fileType);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // --- Generate flashcards using an open-source LLM ---
    const flashcards = await generateFlashcardsWithLLM(extractedText);

    // --- Save flashcards to DynamoDB ---
    await dynamo.put({
      TableName: 'Flashcards',
      Item: {
        documentId,
        fileName,
        flashcards,
        createdAt: new Date().toISOString(),
      }
    }).promise();

    return res.status(200).json({ success: true, documentId, flashcards });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to process upload' });
  }
}