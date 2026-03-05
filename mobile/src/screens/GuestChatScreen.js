import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { colors, radius } from '../theme';
import { sendMessageToClaude } from '../services/claudeApi';

const SUGGESTIONS = [
  '🏛️ Firenze weekend, 2 persone, budget 400€',
  '🏙️ Milano vicino al Duomo, 4 notti, siamo in 3',
  '🌊 Sicilia agosto, budget 1000€, 2 adulti 1 bambino',
];

const FAKE_LISTINGS = [
  { emoji: '🏛️', title: 'Appartamento Santa Croce', location: 'Centro storico', size: '65m² · 2 camere', price: 95, tags: ['WiFi', 'Vista Duomo', 'Cucina'] },
  { emoji: '🌿', title: 'Loft Oltrarno Design', location: 'Oltrarno', size: '45m² · Studio', price: 120, tags: ['Terrazza', 'Aria cond.'] },
  { emoji: '🏰', title: 'Casa Ponte Vecchio', location: 'Lungarno', size: '90m² · 3 camere', price: 180, tags: ['Vista fiume', 'Parcheggio'] },
  { emoji: '🌊', title: 'Villa sul Mare', location: 'Taormina', size: '120m² · 3 camere', price: 220, tags: ['Piscina', 'Vista mare', 'Giardino'] },
  { emoji: '🏙️', title: 'Loft Navigli', location: 'Navigli, Milano', size: '55m² · 1 camera', price: 110, tags: ['Design', 'Metropolitana'] },
];

const INITIAL_MSG = {
  id: 1,
  role: 'ai',
  text: 'Ciao! 👋 Dove vorresti andare e quando? Dimmi tutto — anche in modo informale!',
};

function parseSearchAction(text) {
  try {
    const match = text.match(/\{[^}]+\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed.action === 'search') return parsed;
    }
  } catch (_) {}
  return null;
}

function ResultCards({ city, checkin, checkout, guests, budget }) {
  const nights = (() => {
    try {
      const diff = new Date(checkout) - new Date(checkin);
      const n = Math.round(diff / 86400000);
      return n > 0 ? n : 2;
    } catch (_) { return 2; }
  })();

  let listings = FAKE_LISTINGS.filter(l => budget === 0 || l.price * nights <= budget);
  if (listings.length === 0) listings = FAKE_LISTINGS.slice(0, 3);
  listings = listings.slice(0, 3);

  return (
    <View style={rcStyles.container}>
      {listings.map((l, i) => (
        <TouchableOpacity key={i} style={rcStyles.card} activeOpacity={0.85}>
          <View style={rcStyles.imgBox}>
            <Text style={rcStyles.emoji}>{l.emoji}</Text>
            <View style={rcStyles.badge}>
              <Text style={rcStyles.badgeText}>✓ Confermato</Text>
            </View>
          </View>
          <View style={rcStyles.body}>
            <Text style={rcStyles.title}>{l.title}</Text>
            <Text style={rcStyles.sub}>📍 {l.location} · {l.size}</Text>
            <View style={rcStyles.tags}>
              {l.tags.map((t, j) => (
                <View key={j} style={rcStyles.tag}>
                  <Text style={rcStyles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={rcStyles.foot}>
              <Text style={rcStyles.price}>€{l.price * nights} <Text style={rcStyles.priceSmall}>/ {nights} nott{nights === 1 ? 'e' : 'i'}</Text></Text>
              <Text style={rcStyles.cta}>Scegli →</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function GuestChatScreen({ navigation }) {
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setShowSuggestions(false);
    const userMsg = { id: Date.now(), role: 'user', text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToClaude(updatedMessages);
      const searchAction = parseSearchAction(reply);

      if (searchAction) {
        // Show "searching" message
        const searchingMsg = {
          id: Date.now() + 1,
          role: 'ai',
          text: `Ho trovato quello che cercavi! Sto contattando i proprietari a ${searchAction.city}... ⚡`,
        };
        setMessages((prev) => [...prev, searchingMsg]);
        setLoading(false);

        // After delay show results
        setTimeout(() => {
          const confirmMsg = {
            id: Date.now() + 2,
            role: 'ai',
            text: '3 proprietari confermati in meno di 5 minuti! 🎉 Tutti verificati e disponibili:',
          };
          const resultsMsg = {
            id: Date.now() + 3,
            role: 'results',
            searchParams: searchAction,
          };
          setMessages((prev) => [...prev, confirmMsg, resultsMsg]);
        }, 1200);
      } else {
        const cleanText = reply.replace(/\{[^}]+\}/g, '').trim();
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', text: cleanText || reply },
        ]);
        setLoading(false);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: `❌ ${err.message || 'Errore. Riprova.'}` },
      ]);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.aiAvatar}>
            <Text>🏠</Text>
          </View>
          <View>
            <Text style={styles.aiName}>DirectBooking AI</Text>
            <Text style={styles.aiStatus}>● Online · risponde in 30s</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.resultsBtn}
          onPress={() => navigation.navigate('Results')}
        >
          <Text style={styles.resultsBtnText}>Risultati</Text>
        </TouchableOpacity>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {['Roma', 'Milano', 'Napoli', 'Torino', 'Palermo'].map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.pill}
            onPress={() => sendMessage(`Cerco alloggio a ${city}`)}
          >
            <Text style={styles.pillText}>📍 {city}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            if (msg.role === 'results') {
              return <ResultCards key={msg.id} {...msg.searchParams} />;
            }
            return (
              <View key={msg.id} style={[styles.msgRow, msg.role === 'user' ? styles.msgUser : styles.msgAi]}>
                {msg.role === 'ai' && (
                  <View style={styles.aiAv}>
                    <Text style={{ fontSize: 13 }}>🏠</Text>
                  </View>
                )}
                <View style={[styles.bubble, msg.role === 'ai' ? styles.bubbleAi : styles.bubbleUser]}>
                  <Text style={[styles.bubbleText, msg.role === 'user' && { color: colors.white }]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading && (
            <View style={[styles.msgRow, styles.msgAi]}>
              <View style={styles.aiAv}><Text style={{ fontSize: 13 }}>🏠</Text></View>
              <View style={[styles.bubbleAi, { minWidth: 60, minHeight: 44, justifyContent: 'center' }]}>
                <ActivityIndicator size="small" color={colors.mid} />
              </View>
            </View>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length === 1 && !loading && (
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionPill}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Dove vuoi andare? Scrivi liberamente..."
            placeholderTextColor={colors.mid}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.5 }]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const rcStyles = StyleSheet.create({
  container: { gap: 10, marginTop: 4 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  imgBox: {
    height: 80,
    backgroundColor: '#B8D4DC',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 32 },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: colors.green,
    borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: colors.white },
  body: { padding: 12 },
  title: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  sub: { fontSize: 12, color: colors.mid, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 8 },
  tag: { backgroundColor: '#e8f2f6', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, fontWeight: '700', color: colors.teal },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '800', color: colors.teal },
  priceSmall: { fontSize: 11, fontWeight: '400', color: colors.mid },
  cta: { fontSize: 12, fontWeight: '700', color: colors.orange },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: colors.text },
  aiAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  aiName: { fontSize: 15, fontWeight: '700', color: colors.text },
  aiStatus: { fontSize: 11, fontWeight: '600', color: colors.green, marginTop: 1 },
  resultsBtn: {
    backgroundColor: colors.bg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  resultsBtnText: { fontSize: 12, fontWeight: '600', color: colors.mid },
  filterBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    flexShrink: 0, maxHeight: 52,
  },
  filterContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 7, flexDirection: 'row' },
  pill: {
    backgroundColor: colors.bg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  chatArea: { flex: 1 },
  chatContent: { padding: 14, gap: 12, flexGrow: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgAi: { flexDirection: 'row' },
  msgUser: { flexDirection: 'row-reverse' },
  aiAv: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: { maxWidth: '74%', padding: 12, borderRadius: 20 },
  bubbleAi: {
    backgroundColor: colors.white, borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  bubbleUser: { backgroundColor: colors.teal, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21, color: colors.text },
  suggestions: { gap: 8, marginTop: 8 },
  suggestionPill: {
    backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  suggestionText: { fontSize: 13, fontWeight: '600', color: colors.text },
  inputRow: {
    backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: colors.text,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42, height: 42,
    backgroundColor: colors.orange,
    borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { fontSize: 18, color: colors.white, fontWeight: '700' },
});
