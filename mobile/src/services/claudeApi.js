import Constants from 'expo-constants';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

function getApiKey() {
  return (
    process.env.EXPO_PUBLIC_CLAUDE_API_KEY ||
    Constants.expoConfig?.extra?.claudeApiKey ||
    Constants.manifest?.extra?.claudeApiKey ||
    Constants.manifest2?.extra?.expoClient?.extra?.claudeApiKey
  );
}

const SYSTEM_PROMPT = `Sei l'assistente IA di DirectBooking, una piattaforma italiana di affitti brevi senza commissioni.
Il tuo compito è aiutare i viaggiatori a trovare appartamenti parlando in modo naturale e amichevole in italiano.

REGOLE:
1. Sei sempre breve e diretto — max 2-3 frasi per risposta
2. Raccogli queste informazioni: città, date check-in/check-out, numero ospiti, budget massimo
3. Se mancano informazioni chiedi UNA sola cosa alla volta
4. Quando hai città + date + ospiti, rispondi ESATTAMENTE così (JSON puro, niente altro):
   {"action":"search","city":"CITTÀ","checkin":"DATA","checkout":"DATA","guests":N,"budget":N}
5. Se budget non specificato usa 0 (illimitato)
6. Sii caldo e italiano — usa espressioni come "Perfetto!", "Ottimo!", "Certo!"

NON spiegare mai il JSON all'utente. Mostralo solo quando hai tutte le info necessarie.`;

export async function sendMessageToClaude(messages) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Claude API key non configurata');
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `Errore API: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}
