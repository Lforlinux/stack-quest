// Lightweight local API to proxy requests to a local Ollama instance
// Endpoints:
//  - POST /api/llm/question { category, hint }
//  - POST /api/llm/answer   { question, category }

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// Allow local static site to call this API
const allowedOrigins = [
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

const OLLAMA_API_BASE_URL = process.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

async function ollamaGenerate(prompt) {
  const res = await fetch(`${OLLAMA_API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return (json.response || '').trim();
}

app.post('/api/llm/question', async (req, res) => {
  try {
    const { category, hint } = req.body || {};
    const prompt = [
      'You are an expert technical interviewer.',
      category ? `Category: ${category}.` : '',
      hint ? `Focus: ${hint}.` : '',
      'Task: Generate ONE high-quality technical interview question only.',
      '- No preamble, no answer, just the question.',
      '- Avoid repeating earlier questions if possible.'
    ].filter(Boolean).join('\n');

    const question = await ollamaGenerate(prompt);
    res.json({ question });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

app.post('/api/llm/answer', async (req, res) => {
  try {
    const { question, category } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question is required' });
    const prompt = [
      `Provide a clear, correct, concise answer in markdown to the following${category ? ' ' + category : ''} question:`,
      `Question: ${question}`,
      '- Use bullet points and short code blocks where helpful.',
      '- No extra commentary before or after the answer.'
    ].join('\n');

    const answer = await ollamaGenerate(prompt);
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Local LLM API listening on http://localhost:${PORT}`);
  console.log(`Proxying to Ollama at ${OLLAMA_API_BASE_URL} using model ${MODEL}`);
});


