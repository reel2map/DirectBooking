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

const SYSTEM_PROMPT = `Sei l'assistente AI di DirectBooking — una piattaforma italiana di affitto diretto senza commissioni tra proprietari e inquilini.

Il tuo ruolo:
- Aiutare gli utenti (inquilini) a trovare l'appartamento giusto
- Raccogliere informazioni chiave: città, quartiere, budget, periodo, numero persone, animali domestici, requisiti speciali
- Contattare (simulare) i proprietari e restituire offerte reali
- Spiegare come funziona il pagamento sicuro con Stripe e l'escrow del deposito

Caratteristiche della piattaforma:
- I proprietari pagano 49€/mese, zero commissioni
- Deposito cauzionale protetto in escrow Stripe, rimborsato entro 24h dal checkout
- Pagamento al proprietario entro 5 giorni dal check-in
- Verifica identità (Base, Standard, Premium)
- Possibilità di creare un sito personale per 500€

Stile di risposta:
- Breve, amichevole, professionale
- Usa emoji con moderazione 🏠
- Rispondi sempre in italiano
- Fai domande di follow-up per affinare la ricerca
- Quando hai abbastanza info, proponi di mostrare i risultati disponibili`;

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
