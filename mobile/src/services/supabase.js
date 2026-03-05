import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────
// Crea il progetto su https://supabase.com e copia URL + anon key
// poi aggiungile nel file .env come:
//   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

const SUPABASE_URL      = process.env.EXPO_PUBLIC_SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Listings ────────────────────────────────────────────────────────────────

/**
 * Salva un nuovo listing su Supabase.
 * La tabella `listings` deve essere creata con lo schema SQL qui sotto.
 *
 * SQL da eseguire in Supabase → SQL Editor:
 *
 * create table listings (
 *   id           uuid primary key default gen_random_uuid(),
 *   created_at   timestamptz default now(),
 *   tipo         text not null,
 *   via          text not null,
 *   citta        text not null,
 *   cap          text not null,
 *   zona         text,
 *   camere       int  default 1,
 *   bagni        int  default 1,
 *   mq           int,
 *   piano        int,
 *   servizi      text[] default '{}',
 *   titolo       text not null,
 *   descrizione  text,
 *   regole       text[] default '{}',
 *   prezzo_notte numeric,
 *   prezzo_mese  numeric,
 *   deposito     numeric,
 *   pulizie      numeric,
 *   sogiorno_min int  default 1
 * );
 *
 * -- Abilita Row Level Security (RLS) e permetti insert pubblici per ora:
 * alter table listings enable row level security;
 * create policy "anyone can insert" on listings for insert with check (true);
 * create policy "anyone can select" on listings for select using (true);
 */
export async function saveListing(data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Credenziali Supabase mancanti.\n' +
      'Aggiungi EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY nel file .env'
    );
  }

  const { error } = await supabase.from('listings').insert({
    tipo:         data.tipo,
    via:          data.via,
    citta:        data.citta,
    cap:          data.cap,
    zona:         data.zona || null,
    camere:       parseInt(data.camere) || 1,
    bagni:        parseInt(data.bagni)  || 1,
    mq:           parseInt(data.mq)    || null,
    piano:        parseInt(data.piano)  || null,
    servizi:      data.servizi || [],
    titolo:       data.titolo,
    descrizione:  data.descrizione || null,
    regole:       data.regole || [],
    prezzo_notte: parseFloat(data.prezzoNotte) || null,
    prezzo_mese:  parseFloat(data.prezzoMese)  || null,
    deposito:     parseFloat(data.deposito)    || null,
    pulizie:      parseFloat(data.pulizie)     || null,
    sogiorno_min: parseInt(data.sogiornoMin)   || 1,
  });

  if (error) throw new Error(error.message);
}

/**
 * Recupera tutti i listings (per la ricerca guest).
 */
export async function fetchListings(filters = {}) {
  let query = supabase.from('listings').select('*');

  if (filters.citta)  query = query.ilike('citta', `%${filters.citta}%`);
  if (filters.budget) query = query.lte('prezzo_notte', filters.budget);
  if (filters.guests) query = query.gte('camere', Math.ceil(filters.guests / 2));

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
