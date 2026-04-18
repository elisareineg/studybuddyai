export async function generateFlashcardsWithLLM(text) {
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const normalizedText = typeof text === "string" ? text.trim() : "";

  const buildFallbackFlashcards = (sourceText) => {
    const chunks = sourceText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 40)
      .slice(0, 5);

    if (chunks.length === 0) {
      return [
        {
          question: "What is one key concept from these notes?",
          answer: sourceText.slice(0, 200) || "No readable content found in the uploaded file.",
        },
      ];
    }

    return chunks.map((chunk, idx) => ({
      question: `Key idea ${idx + 1}: What does this note describe?`,
      answer: chunk,
    }));
  };

  if (!normalizedText) {
    throw new Error("No readable text found in the uploaded file.");
  }

  if (!apiKey) {
    return buildFallbackFlashcards(normalizedText);
  }

  const prompt = `You are a helpful study assistant. Given the following study notes, generate 5 quizlet-style flashcards as a JSON array with "question" and "answer" fields. The notes may be in any language - please maintain the same language in your questions and answers.

Important guidelines:
1. Keep the same language as the input text
2. Generate clear, concise questions and answers
3. Focus on key concepts and important details
4. Ensure questions are specific and test understanding
5. Format the output as a valid JSON array

Notes:
${text}

Output only the JSON array in this format:
[
  {
    "question": "Question in the same language as the notes",
    "answer": "Answer in the same language as the notes"
  }
]`;

  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error("Anthropic request failed, using fallback flashcards:", err);
    return buildFallbackFlashcards(normalizedText);
  }

  if (!response.ok) {
    const error = await response.text();
    console.error(`Anthropic API error (${response.status}), using fallback flashcards: ${error}`);
    return buildFallbackFlashcards(normalizedText);
  }

  const data = await response.json();
  // Claude's response is in data.content[0].text
  // Try to parse the JSON array from the response
  const responseText = data?.content?.[0]?.text;
  if (!responseText) {
    return buildFallbackFlashcards(normalizedText);
  }
  const match = responseText.match(/\[.*\]/s);
  if (!match) return buildFallbackFlashcards(normalizedText);
  try {
    return JSON.parse(match[0]);
  } catch {
    return buildFallbackFlashcards(normalizedText);
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