import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native'
import { supabase } from '../../src/lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'datashield://login' }
    })
    setLoading(false)
    if (error) Alert.alert('Error', error.message)
    else setSent(true)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <View style={styles.logo}><Text style={styles.logoText}>DS</Text></View>
        <Text style={styles.title}>DataShield</Text>
        <Text style={styles.subtitle}>Your personal data removal service</Text>

        {sent ? (
          <View style={styles.sentBox}>
            <Text style={styles.sentIcon}>✓</Text>
            <Text style={styles.sentTitle}>Check your email</Text>
            <Text style={styles.sentText}>
              We sent a magic link to {email}. Tap it to sign in.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Sign in →</Text>
              }
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footer}>
          We automatically remove your data from 20+ brokers every 30 days.
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f3', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center' },
  logo: { width: 56, height: 56, backgroundColor: '#0f1117', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f1117', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 28, textAlign: 'center' },
  label: { alignSelf: 'flex-start', fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 8 },
  input: { width: '100%', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, color: '#0f1117', marginBottom: 14 },
  button: { width: '100%', backgroundColor: '#0f1117', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 18 },
  sentBox: { alignItems: 'center', paddingVertical: 16 },
  sentIcon: { fontSize: 32, color: '#0f6e56', marginBottom: 12 },
  sentTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#0f1117' },
  sentText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
})
