export async function generateFlashcardsWithLLM(text) {
  const prompt = `\nGiven the following study notes, generate 5 quizlet-style flashcards as JSON array with \"question\" and \"answer\" fields.\n\nNotes:\n${text}\n\nOutput only the JSON array.\n`;
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  try {
    return JSON.parse(data.response);
  } catch {
    const match = data.response.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse LLM output');
  }
}

export async function generateSuggestionsWithLLM(quizResults) {
  const prompt = `\nGiven the following quiz results, provide 3 specific suggestions for improvement as a JSON array of strings.\n\nQuiz Results:\n${JSON.stringify(quizResults)}\n\nOutput only the JSON array.\n`;
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  try {
    return JSON.parse(data.response);
  } catch {
    const match = data.response.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse LLM output');
  }
} 