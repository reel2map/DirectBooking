import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { colors, radius } from '../theme';

export default function PaymentScreen({ navigation, route }) {
  const { listing } = route.params || {};
  const [step, setStep] = useState('summary'); // 'summary' | 'processing' | 'success'

  const handlePay = () => {
    setStep('processing');
    // Simulate Stripe payment processing
    setTimeout(() => setStep('success'), 2500);
  };

  if (step === 'processing') {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={styles.processingText}>Elaborazione pagamento Stripe...</Text>
        <Text style={styles.processingSubText}>Non chiudere l'app</Text>
      </SafeAreaView>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
        <Text style={{ fontSize: 72, marginBottom: 20 }}>🎉</Text>
        <Text style={styles.successTitle}>Prenotazione confermata!</Text>
        <Text style={styles.successSub}>
          Il deposito è protetto in escrow Stripe. Verrà rilasciato al proprietario dopo il tuo check-in. Il rimborso avviene entro 24h dal checkout.
        </Text>
        <View style={styles.successBox}>
          <Text style={styles.successRow}>📋 Prenotazione: #{Math.floor(Math.random() * 90000) + 10000}</Text>
          <Text style={styles.successRow}>💶 Primo mese: €{listing?.price}</Text>
          <Text style={styles.successRow}>🔒 Deposito escrow: €{parseInt(listing?.price) * 2}</Text>
          <Text style={styles.successRow}>📅 Accredito proprietario: entro 5 giorni</Text>
        </View>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate('GuestChat')}
        >
          <Text style={styles.doneBtnText}>Torna alla home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const price = parseInt(listing?.price || '0');
  const deposit = price * 2;
  const total = price + deposit;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pagamento sicuro</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Stripe badge */}
        <View style={styles.stripeBadge}>
          <Text style={{ fontSize: 20 }}>🔒</Text>
          <Text style={styles.stripeText}>Pagamento protetto da Stripe</Text>
        </View>

        {/* Summary */}
        <Text style={styles.sectionLabel}>RIEPILOGO</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>🏠 {listing?.title || 'Appartamento'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Primo mese</Text>
            <Text style={styles.summaryValue}>€{price}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deposito cauzionale (escrow)</Text>
            <Text style={styles.summaryValue}>€{deposit}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Totale oggi</Text>
            <Text style={styles.totalValue}>€{total}</Text>
          </View>
        </View>

        {/* Escrow explanation */}
        <View style={styles.escrowCard}>
          <Text style={styles.escrowTitle}>🔒 Come funziona l'escrow</Text>
          <View style={styles.escrowStep}>
            <View style={styles.escrowBullet} />
            <Text style={styles.escrowText}>Paghi oggi: primo mese + deposito</Text>
          </View>
          <View style={styles.escrowStep}>
            <View style={styles.escrowBullet} />
            <Text style={styles.escrowText}>Al check-in: Stripe rilascia il pagamento al proprietario entro 5 giorni</Text>
          </View>
          <View style={styles.escrowStep}>
            <View style={styles.escrowBullet} />
            <Text style={styles.escrowText}>Al checkout: deposito rimborsato entro 24 ore</Text>
          </View>
        </View>

        {/* Payment method */}
        <Text style={styles.sectionLabel}>METODO DI PAGAMENTO</Text>
        {[
          { id: 'card', label: '💳 Carta di credito / debito', sub: 'Visa, Mastercard, Amex' },
          { id: 'apple', label: '🍎 Apple Pay', sub: 'Touch ID o Face ID' },
          { id: 'google', label: '🤖 Google Pay', sub: 'Pagamento rapido' },
        ].map((m) => (
          <TouchableOpacity key={m.id} style={styles.methodCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <Text style={{ fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pay button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
          <Text style={styles.payBtnText}>Paga €{total} in modo sicuro</Text>
        </TouchableOpacity>
        <Text style={styles.payNote}>Cancellazione gratuita entro 48 ore</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  appBar: {
    backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: colors.text },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  content: { padding: 20, gap: 14 },
  stripeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.sky2, borderRadius: radius.md, padding: 12,
  },
  stripeText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    color: colors.mid, textTransform: 'uppercase', marginTop: 4,
  },
  summaryCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 18,
    borderWidth: 1.5, borderColor: colors.border, gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryItem: { fontSize: 14, fontWeight: '700', color: colors.text },
  summaryLabel: { fontSize: 14, color: colors.mid },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.teal },
  escrowCard: {
    backgroundColor: colors.sky2, borderRadius: radius.lg, padding: 16, gap: 10,
  },
  escrowTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: 4 },
  escrowStep: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  escrowBullet: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal, marginTop: 5,
  },
  escrowText: { fontSize: 12, color: colors.mid, flex: 1, lineHeight: 18 },
  methodCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 16,
    borderWidth: 1.5, borderColor: colors.border, flexDirection: 'row', alignItems: 'center',
    marginBottom: 8,
  },
  methodLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  methodSub: { fontSize: 12, color: colors.mid, marginTop: 2 },
  bottomBar: {
    backgroundColor: colors.white, padding: 20, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.border, gap: 10,
  },
  payBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12,
    elevation: 6,
  },
  payBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
  payNote: { fontSize: 12, color: colors.mid, textAlign: 'center' },
  processingText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 20 },
  processingSubText: { fontSize: 13, color: colors.mid, marginTop: 6 },
  successTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 12, textAlign: 'center' },
  successSub: { fontSize: 14, color: colors.mid, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  successBox: {
    backgroundColor: colors.sky2, borderRadius: radius.lg, padding: 20, width: '100%', gap: 10, marginBottom: 24,
  },
  successRow: { fontSize: 13, color: colors.teal, fontWeight: '600' },
  doneBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingVertical: 16, paddingHorizontal: 40,
  },
  doneBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
