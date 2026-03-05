import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar, Alert,
} from 'react-native';
import { colors, radius } from '../theme';
import { saveListing } from '../services/supabase';

// ─── Constants ──────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  { id: 'appartamento', icon: '🏢', label: 'Appartamento' },
  { id: 'villa',        icon: '🏡', label: 'Villa / Casa' },
  { id: 'monolocale',   icon: '🛋️', label: 'Monolocale' },
  { id: 'stanza',       icon: '🚪', label: 'Stanza privata' },
];

const AMENITIES = [
  { id: 'wifi',        icon: '📶', label: 'WiFi' },
  { id: 'ac',          icon: '❄️',  label: 'Aria condizionata' },
  { id: 'lavatrice',   icon: '🫧',  label: 'Lavatrice' },
  { id: 'parcheggio',  icon: '🅿️',  label: 'Parcheggio' },
  { id: 'balcone',     icon: '🌿',  label: 'Balcone / Terrazzo' },
  { id: 'ascensore',   icon: '🛗',  label: 'Ascensore' },
  { id: 'portineria',  icon: '🔑',  label: 'Portineria' },
  { id: 'palestra',    icon: '💪',  label: 'Palestra' },
  { id: 'piscina',     icon: '🏊',  label: 'Piscina' },
  { id: 'animali',     icon: '🐾',  label: 'Animali ammessi' },
];

const TOTAL_STEPS = 4;

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepBar({ current }) {
  return (
    <View style={s.stepBar}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[s.stepDot, i < current && s.stepDotDone, i === current - 1 && s.stepDotActive]}
        />
      ))}
    </View>
  );
}

// ─── Step 1: Tipo + Indirizzo ────────────────────────────────────────────────

function Step1({ data, onChange }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Che tipo di immobile affitti?</Text>

      <View style={s.typeGrid}>
        {PROPERTY_TYPES.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[s.typeCard, data.tipo === t.id && s.typeCardActive]}
            onPress={() => onChange('tipo', t.id)}
          >
            <Text style={s.typeIcon}>{t.icon}</Text>
            <Text style={[s.typeLabel, data.tipo === t.id && s.typeLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.sectionLabel}>Indirizzo</Text>
      <TextInput
        style={s.input}
        placeholder="Via e numero civico"
        placeholderTextColor={colors.mid}
        value={data.via}
        onChangeText={v => onChange('via', v)}
      />
      <View style={s.row}>
        <TextInput
          style={[s.input, { flex: 1, marginRight: 10 }]}
          placeholder="Città"
          placeholderTextColor={colors.mid}
          value={data.citta}
          onChangeText={v => onChange('citta', v)}
        />
        <TextInput
          style={[s.input, { width: 90 }]}
          placeholder="CAP"
          placeholderTextColor={colors.mid}
          keyboardType="numeric"
          maxLength={5}
          value={data.cap}
          onChangeText={v => onChange('cap', v)}
        />
      </View>
      <TextInput
        style={s.input}
        placeholder="Zona / Quartiere (opzionale)"
        placeholderTextColor={colors.mid}
        value={data.zona}
        onChangeText={v => onChange('zona', v)}
      />
    </ScrollView>
  );
}

// ─── Step 2: Caratteristiche + Servizi ──────────────────────────────────────

function Step2({ data, onChange }) {
  const toggleAmenity = (id) => {
    const current = data.servizi || [];
    const next = current.includes(id)
      ? current.filter(a => a !== id)
      : [...current, id];
    onChange('servizi', next);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Caratteristiche</Text>

      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={s.fieldLabel}>🛏 Camere da letto</Text>
          <Counter
            value={data.camere}
            min={0} max={10}
            onChange={v => onChange('camere', v)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.fieldLabel}>🚿 Bagni</Text>
          <Counter
            value={data.bagni}
            min={1} max={6}
            onChange={v => onChange('bagni', v)}
          />
        </View>
      </View>

      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={s.fieldLabel}>📐 Superficie (m²)</Text>
          <TextInput
            style={s.input}
            placeholder="es. 65"
            placeholderTextColor={colors.mid}
            keyboardType="numeric"
            value={data.mq}
            onChangeText={v => onChange('mq', v)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.fieldLabel}>🏗 Piano</Text>
          <TextInput
            style={s.input}
            placeholder="es. 2"
            placeholderTextColor={colors.mid}
            keyboardType="numeric"
            value={data.piano}
            onChangeText={v => onChange('piano', v)}
          />
        </View>
      </View>

      <Text style={s.sectionLabel}>Servizi inclusi</Text>
      <View style={s.amenityGrid}>
        {AMENITIES.map(a => {
          const active = (data.servizi || []).includes(a.id);
          return (
            <TouchableOpacity
              key={a.id}
              style={[s.amenityChip, active && s.amenityChipActive]}
              onPress={() => toggleAmenity(a.id)}
            >
              <Text style={s.amenityIcon}>{a.icon}</Text>
              <Text style={[s.amenityLabel, active && s.amenityLabelActive]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── Step 3: Descrizione + Regole ───────────────────────────────────────────

function Step3({ data, onChange }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Descrizione</Text>

      <Text style={s.fieldLabel}>Titolo annuncio</Text>
      <TextInput
        style={s.input}
        placeholder="es. Luminoso bilocale in centro a Milano"
        placeholderTextColor={colors.mid}
        value={data.titolo}
        onChangeText={v => onChange('titolo', v)}
        maxLength={80}
      />
      <Text style={s.charCount}>{(data.titolo || '').length}/80</Text>

      <Text style={s.fieldLabel}>Descrizione</Text>
      <TextInput
        style={[s.input, s.textArea]}
        placeholder="Descrivi l'appartamento, la zona, cosa rende speciale il tuo immobile..."
        placeholderTextColor={colors.mid}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        value={data.descrizione}
        onChangeText={v => onChange('descrizione', v)}
        maxLength={800}
      />
      <Text style={s.charCount}>{(data.descrizione || '').length}/800</Text>

      <Text style={s.sectionLabel}>Regole casa</Text>
      {[
        { id: 'no_animali',  label: '🐾 No animali domestici' },
        { id: 'no_fumo',     label: '🚬 No fumo in appartamento' },
        { id: 'no_feste',    label: '🎉 No feste / eventi' },
        { id: 'solo_coppia', label: '👫 Solo coppie o famiglie' },
      ].map(r => {
        const active = (data.regole || []).includes(r.id);
        return (
          <TouchableOpacity
            key={r.id}
            style={[s.ruleRow, active && s.ruleRowActive]}
            onPress={() => {
              const cur = data.regole || [];
              onChange('regole', active ? cur.filter(x => x !== r.id) : [...cur, r.id]);
            }}
          >
            <Text style={s.ruleLabel}>{r.label}</Text>
            <View style={[s.toggle, active && s.toggleOn]} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Step 4: Prezzi ─────────────────────────────────────────────────────────

function Step4({ data, onChange }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Prezzi</Text>

      <Text style={s.fieldLabel}>Prezzo per notte (€)</Text>
      <TextInput
        style={s.input}
        placeholder="es. 80"
        placeholderTextColor={colors.mid}
        keyboardType="numeric"
        value={data.prezzoNotte}
        onChangeText={v => onChange('prezzoNotte', v)}
      />

      <Text style={s.fieldLabel}>Prezzo mensile (€) — per affitti medi/lunghi</Text>
      <TextInput
        style={s.input}
        placeholder="es. 1200"
        placeholderTextColor={colors.mid}
        keyboardType="numeric"
        value={data.prezzoMese}
        onChangeText={v => onChange('prezzoMese', v)}
      />

      <Text style={s.fieldLabel}>Deposito cauzionale (€)</Text>
      <TextInput
        style={s.input}
        placeholder="es. 500"
        placeholderTextColor={colors.mid}
        keyboardType="numeric"
        value={data.deposito}
        onChangeText={v => onChange('deposito', v)}
      />

      <Text style={s.fieldLabel}>Spese pulizie (€)</Text>
      <TextInput
        style={s.input}
        placeholder="es. 50 — lascia vuoto se incluse"
        placeholderTextColor={colors.mid}
        keyboardType="numeric"
        value={data.pulizie}
        onChangeText={v => onChange('pulizie', v)}
      />

      <Text style={s.fieldLabel}>Soggiorno minimo (notti)</Text>
      <Counter
        value={data.sogiornoMin}
        min={1} max={90}
        onChange={v => onChange('sogiornoMin', v)}
      />

      <View style={s.summaryBox}>
        <Text style={s.summaryTitle}>Riepilogo prezzi</Text>
        <Row label="Notte" val={data.prezzoNotte ? `€ ${data.prezzoNotte}` : '—'} />
        <Row label="Mese"  val={data.prezzoMese  ? `€ ${data.prezzoMese}`  : '—'} />
        <Row label="Deposito" val={data.deposito ? `€ ${data.deposito}` : '—'} />
        <Row label="Pulizie"  val={data.pulizie  ? `€ ${data.pulizie}`  : 'incluse'} />
        <Row label="Minimo"   val={`${data.sogiornoMin || 1} notte/i`} />
      </View>
    </ScrollView>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function Counter({ value, min, max, onChange }) {
  const v = parseInt(value) || min;
  return (
    <View style={s.counter}>
      <TouchableOpacity
        style={s.counterBtn}
        onPress={() => onChange(String(Math.max(min, v - 1)))}
      >
        <Text style={s.counterBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={s.counterVal}>{v}</Text>
      <TouchableOpacity
        style={s.counterBtn}
        onPress={() => onChange(String(Math.min(max, v + 1)))}
      >
        <Text style={s.counterBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, val }) {
  return (
    <View style={s.rowSummary}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowVal}>{val}</Text>
    </View>
  );
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(step, data) {
  if (step === 1) {
    if (!data.tipo)  return 'Seleziona il tipo di immobile';
    if (!data.via)   return 'Inserisci via e numero civico';
    if (!data.citta) return 'Inserisci la città';
    if (!data.cap || data.cap.length !== 5) return 'Inserisci un CAP valido (5 cifre)';
  }
  if (step === 2) {
    if (!data.mq) return 'Inserisci la superficie in m²';
  }
  if (step === 3) {
    if (!data.titolo || data.titolo.length < 10) return 'Il titolo deve essere di almeno 10 caratteri';
    if (!data.descrizione || data.descrizione.length < 30) return 'La descrizione deve essere di almeno 30 caratteri';
  }
  if (step === 4) {
    if (!data.prezzoNotte && !data.prezzoMese) return 'Inserisci almeno il prezzo per notte o mensile';
  }
  return null;
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

const INITIAL = {
  // step 1
  tipo: '', via: '', citta: '', cap: '', zona: '',
  // step 2
  camere: '1', bagni: '1', mq: '', piano: '', servizi: [],
  // step 3
  titolo: '', descrizione: '', regole: [],
  // step 4
  prezzoNotte: '', prezzoMese: '', deposito: '', pulizie: '', sogiornoMin: '1',
};

export default function CreateListingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const onChange = (key, val) => setData(d => ({ ...d, [key]: val }));

  const next = async () => {
    const err = validate(step, data);
    if (err) { Alert.alert('Completa il form', err); return; }

    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      return;
    }

    // Step 4 → publish
    setLoading(true);
    try {
      await saveListing(data);
      Alert.alert('🎉 Annuncio pubblicato!', 'Il tuo immobile è ora visibile agli inquilini.', [
        { text: 'Vai alla dashboard', onPress: () => navigation.replace('HostDashboard') },
      ]);
    } catch (e) {
      Alert.alert('Errore', e.message || 'Impossibile salvare. Controlla le credenziali Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const stepProps = { data, onChange };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        {step > 1 ? (
          <TouchableOpacity onPress={() => setStep(s => s - 1)} style={s.backBtn}>
            <Text style={s.backText}>← Indietro</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backText}>← Esci</Text>
          </TouchableOpacity>
        )}
        <Text style={s.headerTitle}>Crea annuncio</Text>
        <Text style={s.stepCount}>{step}/{TOTAL_STEPS}</Text>
      </View>

      <StepBar current={step} />

      <View style={s.content}>
        {step === 1 && <Step1 {...stepProps} />}
        {step === 2 && <Step2 {...stepProps} />}
        {step === 3 && <Step3 {...stepProps} />}
        {step === 4 && <Step4 {...stepProps} />}
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={next}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Pubblicazione...' : step < TOTAL_STEPS ? 'Avanti →' : '🚀 Pubblica annuncio'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  backBtn: { paddingVertical: 4, paddingRight: 12 },
  backText: { color: colors.teal, fontSize: 15, fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  stepCount: { fontSize: 13, color: colors.mid, fontWeight: '500' },

  // Step bar
  stepBar: {
    flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 20,
  },
  stepDot: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border,
  },
  stepDotDone: { backgroundColor: colors.teal },
  stepDotActive: { backgroundColor: colors.orange },

  content: { flex: 1, paddingHorizontal: 20 },

  stepTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.mid, marginTop: 24, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 16, marginBottom: 6 },

  // Type cards
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  typeCard: {
    width: '47%', backgroundColor: colors.white, borderRadius: radius.md,
    padding: 16, alignItems: 'center', borderWidth: 2, borderColor: colors.border,
  },
  typeCardActive: { borderColor: colors.teal, backgroundColor: '#f0f8fa' },
  typeIcon: { fontSize: 28, marginBottom: 6 },
  typeLabel: { fontSize: 13, fontWeight: '600', color: colors.mid },
  typeLabelActive: { color: colors.teal },

  // Inputs
  input: {
    backgroundColor: colors.white, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: colors.text,
  },
  textArea: { height: 110, paddingTop: 12 },
  charCount: { fontSize: 11, color: colors.mid, textAlign: 'right', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 12 },

  // Counter
  counter: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.border,
    paddingVertical: 4,
  },
  counterBtn: { paddingHorizontal: 18, paddingVertical: 8 },
  counterBtnText: { fontSize: 20, color: colors.teal, fontWeight: '600' },
  counterVal: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },

  // Amenities
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.white, borderRadius: radius.full,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: colors.border,
  },
  amenityChipActive: { borderColor: colors.teal, backgroundColor: '#f0f8fa' },
  amenityIcon: { fontSize: 14 },
  amenityLabel: { fontSize: 13, color: colors.mid, fontWeight: '500' },
  amenityLabelActive: { color: colors.teal, fontWeight: '600' },

  // Rules
  ruleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: radius.sm,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1.5, borderColor: colors.border, marginBottom: 8,
  },
  ruleRowActive: { borderColor: colors.teal },
  ruleLabel: { fontSize: 14, color: colors.text },
  toggle: {
    width: 36, height: 20, borderRadius: 10, backgroundColor: colors.border,
  },
  toggleOn: { backgroundColor: colors.teal },

  // Summary
  summaryBox: {
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: 16, marginTop: 24, borderWidth: 1.5, borderColor: colors.border,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: 12 },
  rowSummary: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 14, color: colors.mid },
  rowVal: { fontSize: 14, fontWeight: '600', color: colors.text },

  // Footer
  footer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.bg },
  btn: {
    backgroundColor: colors.teal, borderRadius: radius.md,
    paddingVertical: 17, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
