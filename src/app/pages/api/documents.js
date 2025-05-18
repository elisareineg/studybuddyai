export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { ids } = req.query;
      
      if (!ids) {
        return res.status(400).json({ error: 'Document IDs are required' });
      }
  
      const documentIds = ids.split(',');
      
      // Here you would fetch document data from your database
      // For now, we'll return mock data
      const documents = documentIds.map(id => ({
        id,
        name: `Document ${id.substring(0, 5)}`,
        type: 'text',
        uploadedAt: new Date().toISOString()
      }));
  
      return res.status(200).json({ documents });
    } catch (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }
  
  // pages/api/generate-quiz.js
  import { Configuration, OpenAIApi } from 'openai';
  import { v4 as uuidv4 } from 'uuid';
  
  // Mock function to get document content - in a real app, you'd fetch from your database
  async function getDocumentContent(documentId) {
    // For demonstration purposes, we'll return mock content
    return `
      Photosynthesis is the process by which plants convert light energy into chemical energy.
      The process occurs in the chloroplasts of plant cells, particularly in the leaves.
      The chemical equation for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.
      The process has two main stages: the light-dependent reactions and the Calvin cycle.
      In the light-dependent reactions, energy from sunlight is absorbed by chlorophyll and converted into chemical energy.
      In the Calvin cycle, carbon dioxide is incorporated into organic molecules.
      Factors affecting photosynthesis include light intensity, carbon dioxide concentration, and temperature.
      Photosynthesis is essential for life on Earth as it produces oxygen and serves as the primary source of energy for almost all organisms.
    `;
  }
  
  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { documentIds, options } = req.body;
      
      if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
        return res.status(400).json({ error: 'Valid document IDs are required' });
      }
  
      // Fetch content from all documents
      const documentContents = await Promise.all(
        documentIds.map(id => getDocumentContent(id))
      );
      
      const combinedContent = documentContents.join('\n\n');
      
      // Configure OpenAI
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      // Generate quiz questions using OpenAI
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(combinedContent, options),
        max_tokens: 1500,
        temperature: 0.7,
      });
      
      // Parse the generated quiz questions
      const quizData = parseQuizResponse(response.data.choices[0].text);
      
      // Store the quiz in your database
      const quizId = uuidv4();
      
      // In a real app, you would store the quiz in your database
      // For this demo, we're just returning the quiz ID
      
      return res.status(200).json({ quizId });
    } catch (error) {
      console.error('Error generating quiz:', error);
      return res.status(500).json({ error: 'Failed to generate quiz' });
    }
  }
  
  function generatePrompt(content, options) {
    const { numQuestions, difficulty, questionTypes } = options;
    
    return `
      Generate a quiz based on the following content. Create ${numQuestions} questions with a ${difficulty} difficulty level.
      Include the following question types: ${questionTypes.join(', ')}.
      
      For multiple-choice questions, include 4 options with one correct answer.
      For true/false questions, clearly state if the statement is true or false.
      For short-answer questions, include the expected key points in the answer.
      For fill-in-blank questions, provide the complete sentence with blank and the correct word.
      
      Content:
      ${content}
      
      Format each question as follows:
      
      [Question Type]: multiple-choice, true-false, short-answer, or fill-in-blank
      [Question]: The actual question text
      [Options]: For multiple-choice only, list the options as A, B, C, D
      [Answer]: The correct answer or expected response
      [Explanation]: Brief explanation of the answer
      
      Return the generated questions in the specified format.
    `;
  }
  
  function parseQuizResponse(responseText) {
    // Simple parsing function - in a real app, you'd want more robust parsing
    const questions = [];
    const questionBlocks = responseText.split(/\n\n(?=\[Question Type\])/);
    
    for (const block of questionBlocks) {
      if (!block.trim()) continue;
      
      const question = {};
      
      // Extract question type
      const typeMatch = block.match(/\[Question Type\]:\s*(.*)/);
      if (typeMatch) question.type = typeMatch[1].trim();
      
      // Extract question text
      const questionMatch = block.match(/\[Question\]:\s*(.*)/);
      if (questionMatch) question.question = questionMatch[1].trim();
      
      // Extract options for multiple-choice
      if (question.type === 'multiple-choice') {
        const optionsMatch = block.match(/\[Options\]:\s*([\s\S]*?)(?=\[Answer\])/);
        if (optionsMatch) {
          question.options = optionsMatch[1].trim().split(/\n/).map(option => 
            option.replace(/^[A-D]\.?\s*/, '').trim()
          );
        }
      }
      
      // Extract answer
      const answerMatch = block.match(/\[Answer\]:\s*(.*)/);
      if (answerMatch) question.answer = answerMatch[1].trim();
      
      // Extract explanation
      const explanationMatch = block.match(/\[Explanation\]:\s*(.*)/);
      if (explanationMatch) question.explanation = explanationMatch[1].trim();
      
      questions.push(question);
    }
    
    return questions;
  }