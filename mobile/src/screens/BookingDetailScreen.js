import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { colors, radius } from '../theme';

export default function BookingDetailScreen({ navigation, route }) {
  const { listing } = route.params || {};
  const [selectedDates, setSelectedDates] = useState(null);

  const handleBook = () => {
    Alert.alert(
      'Conferma prenotazione',
      `Prenotare "${listing?.title}" per €${listing?.price}/mese?\n\nDeposito cauzionale trattenuto in escrow Stripe. Rimborso entro 1 giorno dal checkout.`,
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Prenota ora', onPress: () => navigation.navigate('Payment', { listing }) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Dettaglio</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ fontSize: 18 }}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View style={[styles.photo, { backgroundColor: '#B8D4DC' }]}>
          <Text style={{ fontSize: 64 }}>{listing?.emoji || '🏠'}</Text>
          {listing?.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Proprietario Verificato</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Title */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listingTitle}>{listing?.title || 'Appartamento'}</Text>
              <Text style={styles.listingSub}>{listing?.sub || 'Posizione'}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>{listing?.trust || '⭐ 5.0'}</Text>
            </View>
          </View>

          {/* Price box */}
          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceMain}>€{listing?.price}<Text style={styles.pricePer}>/mese</Text></Text>
              <Text style={styles.priceNote}>Nessuna commissione · Pagamento sicuro Stripe</Text>
            </View>
          </View>

          {/* Features */}
          <Text style={styles.sectionLabel}>CARATTERISTICHE</Text>
          <View style={styles.featuresGrid}>
            {[
              { icon: '🛏️', label: '2 camere' },
              { icon: '🚿', label: '1 bagno' },
              { icon: '📐', label: '65 m²' },
              { icon: '🐾', label: 'Animali ok' },
              { icon: '📶', label: 'Wi-Fi' },
              { icon: '❄️', label: 'Aria cond.' },
            ].map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Calendar placeholder */}
          <Text style={styles.sectionLabel}>DISPONIBILITÀ</Text>
          <View style={styles.calendarBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>📅</Text>
            <Text style={styles.calendarTitle}>Calendario disponibilità</Text>
            <Text style={styles.calendarSub}>
              Disponibile da subito · Minimo 1 mese
            </Text>
            <TouchableOpacity
              style={styles.calendarBtn}
              onPress={() => setSelectedDates('15 Apr – 15 Mag 2025')}
            >
              <Text style={styles.calendarBtnText}>
                {selectedDates || 'Seleziona le date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Escrow info */}
          <View style={styles.escrowBox}>
            <Text style={styles.escrowIcon}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowTitle}>Deposito protetto Escrow</Text>
              <Text style={styles.escrowDesc}>
                Il deposito è trattenuto da Stripe. Viene rilasciato al proprietario solo dopo il tuo check-in. Rimborso entro 24h dal checkout.
              </Text>
            </View>
          </View>

          {/* Owner */}
          <Text style={styles.sectionLabel}>PROPRIETARIO</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerAv}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>Marco R.</Text>
              <Text style={styles.ownerMeta}>Membro dal 2024 · ⭐ 4.9 · 23 recensioni</Text>
            </View>
            <TouchableOpacity style={styles.msgBtn}>
              <Text style={styles.msgBtnText}>Messaggio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>€{listing?.price}/mese</Text>
          <Text style={styles.bottomNote}>Nessuna commissione</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>Prenota ora</Text>
        </TouchableOpacity>
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
  shareBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  photo: {
    height: 220, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute', bottom: 12, left: 16,
    backgroundColor: colors.green, borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  verifiedText: { fontSize: 12, fontWeight: '700', color: colors.white },
  body: { padding: 20, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  listingTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  listingSub: { fontSize: 13, color: colors.mid },
  ratingBox: {
    backgroundColor: colors.sky2, borderRadius: radius.md,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  priceBox: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 16,
    borderWidth: 1.5, borderColor: colors.border,
  },
  priceMain: { fontSize: 26, fontWeight: '800', color: colors.teal },
  pricePer: { fontSize: 14, fontWeight: '400', color: colors.mid },
  priceNote: { fontSize: 12, color: colors.mid, marginTop: 3 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    color: colors.mid, textTransform: 'uppercase',
  },
  featuresGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  featureItem: {
    width: '30%', backgroundColor: colors.white,
    borderRadius: radius.md, padding: 12,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  featureLabel: { fontSize: 11, color: colors.mid, fontWeight: '600' },
  calendarBox: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 20,
    alignItems: 'center', borderWidth: 1.5, borderColor: colors.border,
  },
  calendarTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  calendarSub: { fontSize: 12, color: colors.mid, marginTop: 4, marginBottom: 14 },
  calendarBtn: {
    backgroundColor: colors.sky2, borderRadius: radius.full,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  calendarBtnText: { fontSize: 14, fontWeight: '700', color: colors.teal },
  escrowBox: {
    backgroundColor: colors.sky2, borderRadius: radius.lg, padding: 16,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
  },
  escrowIcon: { fontSize: 24, marginTop: 2 },
  escrowTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: 4 },
  escrowDesc: { fontSize: 12, color: colors.mid, lineHeight: 18 },
  ownerCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  ownerAv: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.sky2, alignItems: 'center', justifyContent: 'center',
  },
  ownerName: { fontSize: 15, fontWeight: '700', color: colors.text },
  ownerMeta: { fontSize: 12, color: colors.mid, marginTop: 2 },
  msgBtn: {
    backgroundColor: colors.teal, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  msgBtnText: { fontSize: 12, fontWeight: '700', color: colors.white },
  bottomBar: {
    backgroundColor: colors.white, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: colors.teal },
  bottomNote: { fontSize: 11, color: colors.mid },
  bookBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingHorizontal: 28, paddingVertical: 15,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12,
    elevation: 6,
  },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
