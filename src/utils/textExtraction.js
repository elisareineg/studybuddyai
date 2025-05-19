import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(filePath, fileType) {
  try {
    if (fileType === 'application/pdf') {
      const data = await fs.readFile(filePath);
      const pdf = await pdfParse(data);
      return pdf.text;
    }
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: data });
      return result.value;
    }
    if (fileType === 'text/plain') {
      return await fs.readFile(filePath, 'utf-8');
    }
    throw new Error('Unsupported file type: ' + fileType);
  } catch (err) {
    console.error('Text extraction error:', err);
    throw new Error('Failed to extract text from file. Please upload a valid PDF, DOCX, or TXT file.');
  }
} 