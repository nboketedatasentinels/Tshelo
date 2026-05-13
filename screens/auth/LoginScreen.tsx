import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { DEFAULT_COUNTRY, type Country } from '../../constants/countries';
import { PhoneInput } from '../../components/PhoneInput';
import { supabase } from '../../lib/supabase';
import type { LoginScreenProps } from '../../types/navigation';

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [loading, setLoading] = useState(false);

  const fullPhone = `${country.dialCode}${phone.replace(/^0+/, '')}`;

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Enter your phone number');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    navigation.navigate('VerifyOTP', { phone: fullPhone, mode: 'login' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />

          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in with your phone number</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Phone number</Text>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              selectedCountry={country}
              onChangeCountry={setCountry}
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>
              New to Tshelo?{' '}
              <Text style={styles.linkBold}>Create account</Text>
            </Text>
          </Pressable>

          <Pressable
            style={styles.recoveryBtn}
            onPress={() => navigation.navigate('ForgotAccess')}
          >
            <Text style={styles.recoveryText}>Trouble signing in?</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Logo() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoBox}>
        <Text style={styles.logoT}>T</Text>
      </View>
      <Text style={styles.logoText}>TSHELO</Text>
      <Text style={styles.logoTagline}>Community Contributions, Simplified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoT: { color: Colors.cyan, fontSize: 28, fontWeight: '800' },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 3,
  },
  logoTagline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  form: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.textSecondary },
  link: {
    textAlign: 'center',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  linkBold: { color: Colors.blue, fontWeight: '700' },
  recoveryBtn: { marginTop: 20, alignItems: 'center' },
  recoveryText: { fontSize: 14, color: Colors.textSecondary },
});
