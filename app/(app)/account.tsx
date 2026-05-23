import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useEffect, useState } from 'react'

export default function AccountScreen() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email || '')
    })
  }, [])

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => supabase.auth.signOut() }
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{email[0]?.toUpperCase()}</Text></View>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Plan</Text>
            <Text style={styles.rowValue}>Pro</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Next scan</Text>
            <Text style={styles.rowValue}>30 days</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Brokers covered</Text>
            <Text style={styles.rowValue}>20+</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Manage subscription</Text>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Privacy policy</Text>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Support</Text>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0f1117', justifyContent: 'center', alignItems: 'center', marginBottom: 12, marginTop: 20 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  email: { fontSize: 16, color: '#444', marginBottom: 32 },
  section: { width: '100%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 15, color: '#0f1117' },
  rowValue: { fontSize: 15, color: '#888' },
  rowArrow: { fontSize: 15, color: '#aaa' },
  signOutBtn: { marginTop: 8, width: '100%', padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  signOutText: { fontSize: 15, color: '#a32d2d', fontWeight: '500' },
})
