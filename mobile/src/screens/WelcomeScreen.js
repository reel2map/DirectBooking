import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import { colors, radius } from '../theme';

export default function WelcomeScreen({ navigation }) {
  const [mode, setMode] = useState('guest'); // 'guest' | 'host'

  const descMap = {
    guest: 'Scrivi in chat che tipo di alloggio cerchi. La nostra IA contatta i proprietari e ti porta le migliori offerte direttamente.',
    host: 'Pubblica il tuo appartamento. Ricevi richieste qualificate. Incassi sicuri tramite escrow Stripe.',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Logo */}
        <Text style={styles.logo}>
          Direct<Text style={styles.logoAccent}>Booking</Text>
        </Text>
        <Text style={styles.tagline}>Rent without commission</Text>

        {/* Toggle */}
        <View style={styles.toggleWrap}>
          <TouchableOpacity
            style={[styles.tog, mode === 'guest' && styles.togActive]}
            onPress={() => setMode('guest')}
          >
            <Text style={[styles.togText, mode === 'guest' && styles.togTextActive]}>
              🔍 Cerco
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tog, mode === 'host' && styles.togActive]}
            onPress={() => setMode('host')}
          >
            <Text style={[styles.togText, mode === 'host' && styles.togTextActive]}>
              🏠 Affitto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.desc}>{descMap[mode]}</Text>

        {/* CTA */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            mode === 'host'
              ? navigation.navigate('CreateListing')
              : navigation.navigate('Verify', { mode })
          }
        >
          <Text style={styles.btnText}>
            {mode === 'guest' ? 'Inizia a cercare →' : 'Pubblica il tuo annuncio →'}
          </Text>
        </TouchableOpacity>

        {/* Sub note */}
        <Text style={styles.note}>
          {mode === 'host'
            ? '49 € / mese · Nessuna commissione'
            : 'Gratuito per chi cerca'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.teal },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
    letterSpacing: -1,
  },
  logoAccent: { color: colors.orange },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '300',
    marginBottom: 56,
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.full,
    padding: 5,
    marginBottom: 32,
    width: '100%',
    maxWidth: 280,
  },
  tog: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  togActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  togText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  togTextActive: { color: colors.teal },
  desc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 22,
    marginBottom: 36,
    textAlign: 'center',
    maxWidth: 260,
  },
  btn: {
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingVertical: 17,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  note: {
    marginTop: 14,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
});
