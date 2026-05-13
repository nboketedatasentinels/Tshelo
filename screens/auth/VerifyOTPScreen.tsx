import React, { useState, useEffect, useCallback } from 'react';
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
import { OTPInput } from '../../components/OTPInput';
import { supabase } from '../../lib/supabase';
import type { VerifyOTPScreenProps } from '../../types/navigation';

const RESEND_COOLDOWN = 30;

export function VerifyOTPScreen({ navigation, route }: VerifyOTPScreenProps) {
  const { phone, mode, name } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerify = useCallback(async () => {
    if (otp.length < 6) {
      Alert.alert('Enter the 6-digit code');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setLoading(false);
      Alert.alert('Invalid code', 'The code is incorrect or has expired.');
      return;
    }

    const user = data.user;
    if (!user) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return;
    }

    if (mode === 'register') {
      const { error: profileError } = await supabase.from('users').insert({
        id: user.id,
        phone,
        name: name ?? '',
        terms_accepted_at: new Date().toISOString(),
      });

      if (profileError && profileError.code !== '23505') {
        setLoading(false);
        Alert.alert('Error', profileError.message);
        return;
      }
    }

    setLoading(false);
    // Navigation to main app handled by auth state listener in RootNavigator
  }, [otp, phone, mode, name]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp, handleVerify]);

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setOtp('');
    setResendCountdown(RESEND_COOLDOWN);
  };

  const maskedPhone = phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4);

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
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.iconWrap}>
            <Text style={styles.icon}>📱</Text>
          </View>

          <Text style={styles.heading}>Verify your number</Text>
          <Text style={styles.subheading}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneText}>{maskedPhone}</Text>
          </Text>

          <View style={styles.otpWrap}>
            <OTPInput value={otp} onChange={setOtp} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              otp.length < 6 && styles.btnDisabled,
              pressed && otp.length === 6 && styles.btnPressed,
            ]}
            onPress={handleVerify}
            disabled={loading || otp.length < 6}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Verify</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.resendBtn, resendCountdown > 0 && styles.resendDisabled]}
            onPress={handleResend}
            disabled={resendCountdown > 0}
          >
            <Text style={[styles.resendText, resendCountdown > 0 && styles.resendTextMuted]}>
              {resendCountdown > 0
                ? `Resend code in ${resendCountdown}s`
                : 'Resend code'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  back: { marginBottom: 32 },
  backText: { fontSize: 15, color: Colors.blue, fontWeight: '600' },
  iconWrap: { alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 56 },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  phoneText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  otpWrap: { marginBottom: 36 },
  btn: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: Colors.border },
  btnPressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resendBtn: { marginTop: 20, alignItems: 'center' },
  resendDisabled: {},
  resendText: { fontSize: 14, color: Colors.blue, fontWeight: '600' },
  resendTextMuted: { color: Colors.textSecondary },
});
