export async function generateFlashcardsWithLLM(text) {
  const prompt = `\nGiven the following study notes, generate 5 quizlet-style flashcards as a JSON array with "question" and "answer" fields.\n\nNotes:\n${text}\n\nOutput only the JSON array.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  // Claude's response is in data.content[0].text
  // Try to parse the JSON array from the response
  const match = data.content[0].text.match(/\[.*\]/s);
  if (!match) throw new Error("No JSON array found in Claude's response.");
  return JSON.parse(match[0]);
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