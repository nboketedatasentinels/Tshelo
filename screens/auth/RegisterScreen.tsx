import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import type { RegisterScreenProps } from '../../types/navigation';

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhone = `${country.dialCode}${phone.replace(/^0+/, '')}`;

  const validate = () => {
    if (!name.trim()) { Alert.alert('Enter your full name'); return false; }
    if (!phone.trim()) { Alert.alert('Enter your phone number'); return false; }
    if (!termsAccepted) { Alert.alert('Please accept the Terms & Privacy Policy'); return false; }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    navigation.navigate('VerifyOTP', {
      phone: fullPhone,
      mode: 'register',
      name: name.trim(),
    });
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
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subheading}>Join your community on Tshelo</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Nono Bokete"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone number</Text>
              <PhoneInput
                value={phone}
                onChangeText={setPhone}
                selectedCountry={country}
                onChangeCountry={setCountry}
              />
            </View>
          </View>

          <Pressable
            style={styles.checkRow}
            onPress={() => setTermsAccepted((v) => !v)}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxOn]}>
              {termsAccepted && <Text style={styles.tick}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>
              I accept the{' '}
              <Text style={styles.checkLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.checkLink}>Privacy Policy</Text>
            </Text>
          </Pressable>

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

          <Pressable
            style={styles.signinBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signinText}>
              Already have an account?{' '}
              <Text style={styles.signinLink}>Sign in</Text>
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
  back: { marginBottom: 28 },
  backText: { fontSize: 15, color: Colors.blue, fontWeight: '600' },
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
  form: { gap: 20, marginBottom: 24 },
  field: { gap: 8 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 28,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
  tick: { color: '#fff', fontSize: 13, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  checkLink: { color: Colors.blue, fontWeight: '600' },
  btn: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signinBtn: { marginTop: 24, alignItems: 'center' },
  signinText: { fontSize: 15, color: Colors.textSecondary },
  signinLink: { color: Colors.blue, fontWeight: '700' },
});
