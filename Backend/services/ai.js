const OpenAI = require('openai');

function getClient() {
  const key = process.env.OPENAI_API_KEY || '';
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: key });
}

function formatScores(scores = {}) {
  return {
    performance: scores.performance ?? 'N/A',
    accessibility: scores.accessibility ?? 'N/A',
    bestPractices: scores.bestPractices ?? 'N/A',
    seo: scores.seo ?? 'N/A',
  };
}

async function generateSummary({ url, scores = {}, crawlData = {} }) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const temperature = Number(process.env.OPENAI_TEMPERATURE ?? 0.2) || 0.2;

  const safeScores = formatScores(scores);
  const h1List = (crawlData.h1Headings || [])
    .slice(0, 5)
    .map((h, i) => `${i + 1}. ${h}`)
    .join('\n') || 'None found';
  const metaDesc = crawlData.metaDescription || 'N/A';
  const title = crawlData.title || 'N/A';

  const prompt = [
    'You are a web audit assistant.',
    `URL: ${url}`,
    `Title: ${title}`,
    `Meta Description: ${metaDesc}`,
    `Top H1 Headings:\n${h1List}`,
    `Scores -> Performance: ${safeScores.performance}, Accessibility: ${safeScores.accessibility}, Best Practices: ${safeScores.bestPractices}, SEO: ${safeScores.seo}`,
    'Produce a concise summary followed by 4-6 actionable recommendations, highest impact first. Use bullets.',
  ].join('\n');

  const response = await client.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: 'system', content: 'Keep output compact and actionable.' },
      { role: 'user', content: prompt }
    ]
  });

  const content = response.choices?.[0]?.message?.content?.trim() || '';
  const bullets = content
    .split('\n')
    .map((line) => line.replace(/^[\-\*\d\.\s]+/, '').trim())
    .filter(Boolean);

  return {
    summary: content,
    keyFindings: bullets.slice(0, 3),
    recommendations: bullets.slice(3),
    model,
    createdAt: new Date()
  };
}

// summarize delegates to generateSummary for backward compatibility
async function summarize({ url, lighthouse, crawlData }) {
  const scores = lighthouse?.scores || {};
  return generateSummary({ url, scores, crawlData });
}

module.exports = { generateSummary, summarize };
