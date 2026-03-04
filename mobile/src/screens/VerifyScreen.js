import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { colors, radius } from '../theme';

const TRUST_LEVELS = [
  {
    id: 'basic',
    badge: '✅',
    name: 'Verifica Base',
    desc: 'Email + telefono. Adatto per soggiorni brevi.',
  },
  {
    id: 'standard',
    badge: '🛡️',
    name: 'Verifica Standard',
    desc: 'Documento d\'identità + selfie. Richiesto dalla maggior parte dei proprietari.',
  },
  {
    id: 'premium',
    badge: '⭐',
    name: 'Verifica Premium',
    desc: 'Tutto + busta paga / estratto conto. Massima fiducia.',
  },
];

export default function VerifyScreen({ navigation, route }) {
  const { mode } = route.params || {};
  const [selected, setSelected] = useState('standard');
  const [docUploaded, setDocUploaded] = useState(false);
  const [selfie1, setSelfie1] = useState(false);
  const [selfie2, setSelfie2] = useState(false);

  const handleContinue = () => {
    if (mode === 'host') {
      navigation.navigate('HostDashboard');
    } else {
      navigation.navigate('GuestChat');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verifica identità</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Trust levels */}
          <Text style={styles.sectionLabel}>LIVELLO DI FIDUCIA</Text>
          {TRUST_LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              style={[styles.card, selected === lvl.id && styles.cardActive]}
              onPress={() => setSelected(lvl.id)}
            >
              <View style={styles.badge}>
                <Text style={{ fontSize: 22 }}>{lvl.badge}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{lvl.name}</Text>
                <Text style={styles.cardDesc}>{lvl.desc}</Text>
              </View>
              {selected === lvl.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Document upload */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>DOCUMENTO D'IDENTITÀ</Text>
          <TouchableOpacity
            style={[styles.uploadBox, docUploaded && styles.uploadBoxDone]}
            onPress={() => {
              Alert.alert('Carica documento', 'Funzionalità disponibile nell\'app completa');
              setDocUploaded(true);
            }}
          >
            <Text style={{ fontSize: 36 }}>{docUploaded ? '✅' : '📄'}</Text>
            <Text style={styles.uploadTitle}>
              {docUploaded ? 'Documento caricato' : 'Carica documento'}
            </Text>
            <Text style={styles.uploadSub}>
              {docUploaded ? 'Tocca per cambiare' : 'Carta d\'identità o passaporto · PDF o immagine'}
            </Text>
          </TouchableOpacity>

          {/* Selfie */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>SELFIE DI VERIFICA</Text>
          <View style={styles.selfieRow}>
            <TouchableOpacity
              style={[styles.selfieSlot, selfie1 && styles.selfieSlotDone]}
              onPress={() => setSelfie1(true)}
            >
              <Text style={{ fontSize: 28 }}>{selfie1 ? '✅' : '🤳'}</Text>
              <Text style={styles.selfieLabel}>Selfie normale</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selfieSlot, selfie2 && styles.selfieSlotDone]}
              onPress={() => setSelfie2(true)}
            >
              <Text style={{ fontSize: 28 }}>{selfie2 ? '✅' : '📷'}</Text>
              <Text style={styles.selfieLabel}>Con documento</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.btn} onPress={handleContinue}>
            <Text style={styles.btnText}>Continua →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleContinue}
          >
            <Text style={styles.skipText}>Salta per ora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  appBar: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: colors.text },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  scroll: { flex: 1 },
  body: { padding: 20, gap: 10 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    color: colors.mid, marginBottom: 10, textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  cardActive: { borderColor: colors.teal, backgroundColor: colors.sky2 },
  badge: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: colors.mid, lineHeight: 18 },
  checkmark: { fontSize: 18, color: colors.teal },
  uploadBox: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 8,
  },
  uploadBoxDone: { borderColor: colors.green, borderStyle: 'solid', backgroundColor: colors.green2 },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  uploadSub: { fontSize: 12, color: colors.mid, textAlign: 'center' },
  selfieRow: { flexDirection: 'row', gap: 12 },
  selfieSlot: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  selfieSlotDone: { backgroundColor: colors.green2, borderColor: colors.green, borderStyle: 'solid' },
  selfieLabel: { fontSize: 12, color: colors.mid },
  btn: {
    marginTop: 24,
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  skipBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 14 },
  skipText: { fontSize: 15, color: colors.mid, fontWeight: '600' },
});
