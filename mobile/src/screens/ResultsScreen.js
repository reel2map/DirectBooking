import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList,
} from 'react-native';
import { colors, radius } from '../theme';

const LISTINGS = [
  {
    id: '1',
    emoji: '🏛️',
    title: 'Appartamento Trastevere',
    sub: 'Roma · 2 camere · 65m²',
    price: '1.100',
    verified: true,
    trust: '⭐ 4.9',
    tags: ['Wi-Fi', 'Aria cond.', 'Animali ok'],
    gradient: ['#B8D4DC', '#7FB5C5'],
  },
  {
    id: '2',
    emoji: '🏙️',
    title: 'Monolocale Navigli',
    sub: 'Milano · 1 camera · 42m²',
    price: '950',
    verified: true,
    trust: '⭐ 4.8',
    tags: ['Wi-Fi', 'Palestra'],
    gradient: ['#D4C8B8', '#C5B57F'],
  },
  {
    id: '3',
    emoji: '🌊',
    title: 'Villa Vista Mare',
    sub: 'Napoli · 3 camere · 120m²',
    price: '1.800',
    verified: false,
    trust: '⭐ 4.7',
    tags: ['Piscina', 'Parcheggio', 'Terrazza'],
    gradient: ['#B8DCD4', '#7FC5BB'],
  },
  {
    id: '4',
    emoji: '🏘️',
    title: 'Attico Centro Storico',
    sub: 'Firenze · 2 camere · 78m²',
    price: '1.350',
    verified: true,
    trust: '⭐ 5.0',
    tags: ['Wi-Fi', 'Terrazza', 'Vista città'],
    gradient: ['#DCC8B8', '#C5957F'],
  },
];

export default function ResultsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetail', { listing: item })}
    >
      {/* Image placeholder */}
      <View style={[styles.cardImg, { backgroundColor: item.gradient[0] }]}>
        <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verificato</Text>
          </View>
        )}
        <View style={styles.trustBadge}>
          <Text style={styles.trustText}>{item.trust}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.sub}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {item.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFoot}>
          <View>
            <Text style={styles.price}>€{item.price}</Text>
            <Text style={styles.priceSub}>/mese · nessuna commissione</Text>
          </View>
          <Text style={styles.cta}>Vedi offerta →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>8 risultati trovati</Text>
          <Text style={styles.subtitle}>Roma · aggiornato ora</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Sort pills */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.sortBar} contentContainerStyle={styles.sortContent}
      >
        {['Rilevanza', 'Prezzo ↑', 'Valutazione', 'Nuovo'].map((s, i) => (
          <TouchableOpacity key={s} style={[styles.sortPill, i === 0 && styles.sortPillActive]}>
            <Text style={[styles.sortPillText, i === 0 && styles.sortPillTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={LISTINGS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: colors.text },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 11, color: colors.mid, textAlign: 'center', marginTop: 1 },
  filterBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  filterBtnText: { fontSize: 18 },
  sortBar: {
    backgroundColor: colors.white, flexShrink: 0, maxHeight: 50,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sortContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 7, flexDirection: 'row' },
  sortPill: {
    backgroundColor: colors.bg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6,
  },
  sortPillActive: { backgroundColor: colors.sky2, borderColor: colors.teal },
  sortPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  sortPillTextActive: { color: colors.teal },
  list: { padding: 14, gap: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 2,
  },
  cardImg: {
    height: 110, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: colors.green,
    borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: colors.white },
  trustBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3,
  },
  trustText: { fontSize: 10, fontWeight: '700', color: colors.white },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  cardSub: { fontSize: 12, color: colors.mid, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: {
    backgroundColor: colors.sky2,
    borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: colors.teal },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: '800', color: colors.teal },
  priceSub: { fontSize: 10, color: colors.mid },
  cta: { fontSize: 13, fontWeight: '700', color: colors.orange },
});
