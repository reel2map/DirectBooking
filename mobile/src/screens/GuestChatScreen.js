import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { colors, radius } from '../theme';

const SUGGESTIONS = [
  '🏠 Roma · 2 camere · fino a €1200',
  '📍 Milano Navigli · monolocale',
  '🌊 Costa · luglio · 2 settimane',
  '🏙️ Vicino centro · animali ok',
];

const INITIAL_MSG = {
  id: 1,
  role: 'ai',
  text: 'Ciao! 👋 Sono l\'assistente DirectBooking. Dimmi che tipo di alloggio stai cercando: città, budget, periodo e numero di persone. Contatterò i proprietari e ti porterò le migliori offerte senza commissioni!',
};

export default function GuestChatScreen({ navigation }) {
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with real Claude API call)
    setTimeout(() => {
      const aiReply = generateAIReply(userText);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: aiReply },
      ]);
      setLoading(false);
    }, 1500);
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
          {messages.map((msg) => (
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
          ))}
          {loading && (
            <View style={[styles.msgRow, styles.msgAi]}>
              <View style={styles.aiAv}><Text style={{ fontSize: 13 }}>🏠</Text></View>
              <View style={styles.bubbleAi}>
                <ActivityIndicator size="small" color={colors.mid} />
              </View>
            </View>
          )}

          {/* Suggestions */}
          {messages.length === 1 && !loading && (
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
            placeholder="Scrivi cosa cerchi..."
            placeholderTextColor={colors.mid}
            value={input}
            onChangeText={setInput}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function generateAIReply(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('roma') || lower.includes('rome')) {
    return 'Perfetto! Ho trovato 8 proprietari disponibili a Roma 🏛️\n\nSto inviando la tua richiesta ai proprietari verificati con appartamenti che corrispondono alle tue preferenze. Riceverai le offerte entro 30 minuti!\n\nVuoi specificare un quartiere? (Trastevere, Prati, Testaccio...)';
  }
  if (lower.includes('milano') || lower.includes('milan')) {
    return 'Milano — ottima scelta! 🏙️\n\nHo 12 proprietari disponibili in zona Navigli, Brera e Centro. Sto contattando quelli con valutazione ⭐ 4.8+.\n\nBudget mensile? Ti aiuta a ricevere offerte più precise.';
  }
  if (lower.includes('budget') || lower.includes('euro') || lower.includes('€')) {
    return 'Budget ricevuto ✅\n\nSto filtrando le offerte nel tuo range di prezzo. I proprietari DirectBooking non applicano commissioni, quindi il prezzo che vedi è quello che paghi.\n\nVuoi vedere i risultati disponibili ora?';
  }
  return 'Ho capito la tua richiesta! 🔍\n\nSto contattando i proprietari verificati nella zona che cerchi. Di solito ci vogliono 20-30 minuti per ricevere le prime offerte.\n\nPosso anche mostrarti appartamenti disponibili subito — vuoi vedere i risultati?';
}

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
  chatContent: { padding: 14, gap: 14, flexGrow: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgAi: { flexDirection: 'row' },
  msgUser: { flexDirection: 'row-reverse' },
  aiAv: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '74%', padding: 12, borderRadius: 20,
  },
  bubbleAi: {
    backgroundColor: colors.white, borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    minWidth: 44, minHeight: 44, justifyContent: 'center',
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
