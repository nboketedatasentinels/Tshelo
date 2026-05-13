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
import { supabase } from '../../lib/supabase';
import type { ForgotAccessScreenProps } from '../../types/navigation';

export function ForgotAccessScreen({ navigation }: ForgotAccessScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Enter your recovery email');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setSent(true);
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

          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🔑</Text>
          </View>

          <Text style={styles.heading}>Recover access</Text>

          {sent ? (
            <SentState email={email} onBack={() => navigation.navigate('Login')} />
          ) : (
            <SendForm
              email={email}
              onChangeEmail={setEmail}
              loading={loading}
              onSubmit={handleSend}
              onBack={() => navigation.navigate('Login')}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type SendFormProps = {
  email: string;
  onChangeEmail: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

function SendForm({ email, onChangeEmail, loading, onSubmit, onBack }: SendFormProps) {
  return (
    <View>
      <Text style={styles.subheading}>
        If you no longer have access to your registered phone number, enter the
        recovery email linked to your account and we'll send you a recovery link.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tshelo uses phone + OTP to sign in. If you still have access to your
          phone, just go back and sign in normally.
        </Text>
      </View>

      <Text style={styles.label}>Recovery email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={onChangeEmail}
        placeholder="you@example.com"
        placeholderTextColor={Colors.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Send recovery link</Text>
        )}
      </Pressable>

      <Pressable style={styles.backLink} onPress={onBack}>
        <Text style={styles.backLinkText}>
          Back to <Text style={styles.backLinkBold}>sign in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

type SentStateProps = { email: string; onBack: () => void };

function SentState({ email, onBack }: SentStateProps) {
  return (
    <View style={styles.sentWrap}>
      <Text style={styles.sentIcon}>✉️</Text>
      <Text style={styles.sentTitle}>Check your inbox</Text>
      <Text style={styles.sentBody}>
        We've sent a recovery link to{' '}
        <Text style={styles.sentEmail}>{email}</Text>.{'\n\n'}
        Follow the link in the email to regain access to your account.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.btn, { marginTop: 32 }, pressed && styles.btnPressed]}
        onPress={onBack}
      >
        <Text style={styles.btnText}>Back to sign in</Text>
      </Pressable>
    </View>
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
    marginBottom: 12,
  },
  subheading: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: Colors.blueLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
  },
  infoText: { fontSize: 13, color: Colors.primary, lineHeight: 19 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
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
    marginBottom: 24,
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
  backLink: { marginTop: 20, alignItems: 'center' },
  backLinkText: { fontSize: 15, color: Colors.textSecondary },
  backLinkBold: { color: Colors.blue, fontWeight: '700' },
  sentWrap: { alignItems: 'center', paddingTop: 20 },
  sentIcon: { fontSize: 56, marginBottom: 20 },
  sentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sentBody: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sentEmail: { color: Colors.textPrimary, fontWeight: '600' },
});
