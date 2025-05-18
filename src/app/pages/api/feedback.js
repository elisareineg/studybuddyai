import { generateSuggestionsWithLLM } from '../../../utils/llm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quizResults } = req.body;
    if (!quizResults) {
      return res.status(400).json({ error: 'Quiz results are required' });
    }

    // --- Generate improvement suggestions using an open-source LLM ---
    const suggestions = await generateSuggestionsWithLLM(quizResults);

    return res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({ error: 'Failed to generate feedback' });
  }
} 