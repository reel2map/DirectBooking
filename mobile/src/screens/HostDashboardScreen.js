import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { colors, radius } from '../theme';

const STATS = [
  { label: 'Richieste', value: '12', sub: 'questa settimana', icon: '📨' },
  { label: 'Incasso', value: '€1.100', sub: 'questo mese', icon: '💶' },
  { label: 'Valutazione', value: '4.9', sub: '23 recensioni', icon: '⭐' },
  { label: 'Tasso risp.', value: '98%', sub: 'media 12 min', icon: '⚡' },
];

const REQUESTS = [
  { id: '1', name: 'Luca M.', emoji: '👨', date: '15 Apr – 15 Giu', price: '€1.100 × 2', status: 'new', trust: '🛡️ Standard', msg: 'Cerco appartamento tranquillo per lavoro.' },
  { id: '2', name: 'Sofia B.', emoji: '👩', date: '1 Mag – 30 Mag', price: '€1.100', status: 'pending', trust: '⭐ Premium', msg: 'Coppia senza animali, referenze disponibili.' },
  { id: '3', name: 'Giulia R.', emoji: '👩‍💼', date: '10 Apr – 10 Lug', price: '€1.100 × 3', status: 'confirmed', trust: '🛡️ Standard', msg: 'Lavoro in zona, cerco soluzione fissa.' },
];

export default function HostDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleAccept = (req) => {
    Alert.alert('Offerta accettata! 🎉', `Luca riceverà la tua risposta. Il pagamento è protetto da Stripe escrow.\n\nIncasserai €${req.price} entro 5 giorni dal check-in.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Dashboard Header */}
      <View style={styles.dashHeader}>
        <View style={styles.dhTop}>
          <View>
            <Text style={styles.dhGreet}>Benvenuto 👋</Text>
            <Text style={styles.dhName}>Marco R.</Text>
          </View>
          <View style={styles.dhAv}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.white }}>M</Text>
          </View>
        </View>

        {/* Plan badge */}
        <View style={styles.planBadge}>
          <Text style={styles.planText}>✓ Piano Pro · 49€/mese · 22 giorni rimasti</Text>
          <TouchableOpacity>
            <Text style={styles.planLink}>Gestisci</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'requests', label: '📨 Richieste' },
          { id: 'calendar', label: '📅 Calendario' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {activeTab === 'overview' && (
          <>
            {/* Stats */}
            <View style={styles.statsGrid}>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statIcon}>{s.icon}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statSub}>{s.sub}</Text>
                </View>
              ))}
            </View>

            {/* Income chart placeholder */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>INCASSO MENSILE</Text>
              <View style={styles.chartBox}>
                <View style={styles.chartBars}>
                  {[60, 80, 100, 75, 100, 90].map((h, i) => (
                    <View key={i} style={styles.barWrap}>
                      <View style={[styles.bar, { height: h, backgroundColor: i === 4 ? colors.orange : colors.sky }]} />
                    </View>
                  ))}
                </View>
                <Text style={styles.chartCaption}>Ultimi 6 mesi · Totale €6.600</Text>
              </View>
            </View>

            {/* Website upsell */}
            <View style={styles.upsellBox}>
              <Text style={styles.upsellIcon}>🌐</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.upsellTitle}>Crea il tuo sito personale</Text>
                <Text style={styles.upsellDesc}>
                  Pagina dedicata con calendario, galleria e prenotazione diretta. Una tantum €500.
                </Text>
              </View>
              <TouchableOpacity style={styles.upsellBtn}>
                <Text style={styles.upsellBtnText}>Scopri</Text>
              </TouchableOpacity>
            </View>

            {/* Payout info */}
            <View style={styles.payoutBox}>
              <Text style={styles.payoutTitle}>💶 Prossimo pagamento</Text>
              <Text style={styles.payoutAmount}>€1.100,00</Text>
              <Text style={styles.payoutMeta}>Accredito entro 5 giorni dal check-in · Stripe Connect</Text>
              <View style={styles.payoutBar}>
                <View style={[styles.payoutProgress, { width: '70%' }]} />
              </View>
              <Text style={styles.payoutSub}>Rilascio: 20 Aprile 2025</Text>
            </View>
          </>
        )}

        {activeTab === 'requests' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RICHIESTE IN ARRIVO</Text>
            {REQUESTS.map((req) => (
              <View key={req.id} style={[styles.reqCard, req.status === 'new' && styles.reqCardNew]}>
                <View style={styles.reqHeader}>
                  <View style={styles.reqAv}>
                    <Text style={{ fontSize: 22 }}>{req.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.reqTitleRow}>
                      <Text style={styles.reqName}>{req.name}</Text>
                      <View style={[styles.statusBadge, styles['status_' + req.status]]}>
                        <Text style={styles.statusText}>
                          {req.status === 'new' ? 'Nuova' : req.status === 'pending' ? 'In attesa' : '✓ Confermata'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reqMeta}>{req.trust} · {req.date}</Text>
                  </View>
                </View>
                <Text style={styles.reqMsg}>"{req.msg}"</Text>
                <View style={styles.reqFoot}>
                  <Text style={styles.reqPrice}>{req.price}</Text>
                  {req.status !== 'confirmed' && (
                    <View style={styles.reqActions}>
                      <TouchableOpacity style={styles.declineBtn}>
                        <Text style={styles.declineText}>Rifiuta</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(req)}>
                        <Text style={styles.acceptText}>Accetta</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'calendar' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>APRILE 2025</Text>
            <View style={styles.calendarPlaceholder}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
              <Text style={styles.calTitle}>Calendario disponibilità</Text>
              <Text style={styles.calSub}>Blocca le date, gestisci le prenotazioni confermate</Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
                  <Text style={styles.legendText}>Disponibile</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.orange }]} />
                  <Text style={styles.legendText}>Prenotato</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.mid }]} />
                  <Text style={styles.legendText}>Bloccato</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  dashHeader: {
    backgroundColor: colors.teal, padding: 20, paddingTop: 24,
  },
  dhTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dhGreet: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 3 },
  dhName: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  dhAv: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center',
  },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md,
    padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  planText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', flex: 1 },
  planLink: { fontSize: 12, fontWeight: '700', color: colors.orange },
  tabBar: {
    backgroundColor: colors.white, flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.teal },
  tabText: { fontSize: 12, fontWeight: '600', color: colors.mid },
  tabTextActive: { color: colors.teal },
  scroll: { padding: 16, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    width: '47%', backgroundColor: colors.white,
    borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 12, fontWeight: '700', color: colors.mid, marginTop: 2 },
  statSub: { fontSize: 10, color: colors.mid, marginTop: 2, textAlign: 'center' },
  section: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    color: colors.mid, textTransform: 'uppercase', marginBottom: 10,
  },
  chartBox: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 16, borderWidth: 1, borderColor: colors.border,
  },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100, marginBottom: 8 },
  barWrap: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 4 },
  chartCaption: { fontSize: 11, color: colors.mid, textAlign: 'center' },
  upsellBox: {
    backgroundColor: colors.sky2, borderRadius: radius.lg, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16,
    borderWidth: 1.5, borderColor: colors.sky,
  },
  upsellIcon: { fontSize: 28 },
  upsellTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: 3 },
  upsellDesc: { fontSize: 12, color: colors.mid, lineHeight: 17 },
  upsellBtn: {
    backgroundColor: colors.teal, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  upsellBtnText: { fontSize: 12, fontWeight: '700', color: colors.white },
  payoutBox: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  payoutTitle: { fontSize: 13, fontWeight: '700', color: colors.mid, marginBottom: 6 },
  payoutAmount: { fontSize: 28, fontWeight: '800', color: colors.teal },
  payoutMeta: { fontSize: 11, color: colors.mid, marginTop: 2, marginBottom: 12 },
  payoutBar: {
    height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 6,
  },
  payoutProgress: { height: 6, backgroundColor: colors.green, borderRadius: 3 },
  payoutSub: { fontSize: 11, color: colors.mid },
  reqCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 16, borderWidth: 1.5, borderColor: colors.border, marginBottom: 10,
  },
  reqCardNew: { borderColor: colors.orange, backgroundColor: '#FFF8F2' },
  reqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  reqAv: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.sky2, alignItems: 'center', justifyContent: 'center',
  },
  reqTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  reqName: { fontSize: 15, fontWeight: '700', color: colors.text },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3 },
  status_new: { backgroundColor: '#FFE8D0' },
  status_pending: { backgroundColor: colors.sky2 },
  status_confirmed: { backgroundColor: colors.green2 },
  statusText: { fontSize: 10, fontWeight: '700', color: colors.text },
  reqMeta: { fontSize: 12, color: colors.mid },
  reqMsg: { fontSize: 13, color: colors.mid, fontStyle: 'italic', marginBottom: 12 },
  reqFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reqPrice: { fontSize: 16, fontWeight: '800', color: colors.teal },
  reqActions: { flexDirection: 'row', gap: 8 },
  declineBtn: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  declineText: { fontSize: 13, fontWeight: '600', color: colors.mid },
  acceptBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  acceptText: { fontSize: 13, fontWeight: '700', color: colors.white },
  calendarPlaceholder: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  calTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  calSub: { fontSize: 12, color: colors.mid, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  legendRow: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.mid, fontWeight: '600' },
});
