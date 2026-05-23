import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'

const PLANS = [
  {
    id: 'basic', name: 'Basic', monthly: 6.99, yearly: 59.99,
    features: ['20 data broker removals', 'Monthly re-scans', 'Email reports', 'Dashboard access'],
    link: 'https://buy.stripe.com/5kQ7sK2KC4NeaNa76F4Vy00', highlight: false,
  },
  {
    id: 'pro', name: 'Pro', monthly: 12.99, yearly: 99.99,
    features: ['50+ broker removals', 'Bi-weekly re-scans', 'Email reports', 'Dashboard access', 'Priority processing'],
    link: 'https://buy.stripe.com/dRm28q0CudjKdZmdv34Vy01', highlight: true,
  },
  {
    id: 'elite', name: 'Elite', monthly: 19.99, yearly: 149.99,
    features: ['Unlimited brokers', 'Weekly re-scans', 'Email reports', 'Dashboard access', 'Priority processing', 'Dedicated support'],
    link: 'https://buy.stripe.com/9B63cu990bbC1cAdv34Vy02', highlight: false,
  },
]

export default function PricingScreen() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>Remove your data from 50+ brokers automatically</Text>

        <View style={styles.toggle}>
          <TouchableOpacity style={[styles.toggleBtn, interval === 'monthly' && styles.toggleActive]} onPress={() => setInterval('monthly')}>
            <Text style={[styles.toggleText, interval === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, interval === 'yearly' && styles.toggleActive]} onPress={() => setInterval('yearly')}>
            <Text style={[styles.toggleText, interval === 'yearly' && styles.toggleTextActive]}>Yearly</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Save 35%</Text></View>
          </TouchableOpacity>
        </View>

        {PLANS.map(plan => (
          <View key={plan.id} style={[styles.plan, plan.highlight && styles.planFeatured]}>
            {plan.highlight && <View style={styles.popularBadge}><Text style={styles.popularText}>Most popular</Text></View>}
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${interval === 'monthly' ? plan.monthly : (plan.yearly / 12).toFixed(2)}</Text>
              <Text style={styles.period}>/mo</Text>
            </View>
            {interval === 'yearly' && <Text style={styles.billed}>Billed ${plan.yearly}/yr</Text>}
            <TouchableOpacity style={[styles.cta, plan.highlight && styles.ctaFeatured]} onPress={() => Linking.openURL(plan.link)}>
              <Text style={[styles.ctaText, plan.highlight && styles.ctaTextFeatured]}>Get started →</Text>
            </TouchableOpacity>
            {plan.features.map(f => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f1117', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  toggle: { flexDirection: 'row', backgroundColor: '#e8e8e8', borderRadius: 10, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  toggleActive: { backgroundColor: '#fff' },
  toggleText: { fontSize: 14, color: '#888' },
  toggleTextActive: { color: '#0f1117', fontWeight: '600' },
  badge: { backgroundColor: '#e1f5ee', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: '#0f6e56', fontWeight: '600' },
  plan: { backgroundColor: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  planFeatured: { borderWidth: 2, borderColor: '#0f1117' },
  popularBadge: { backgroundColor: '#0f1117', alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  planName: { fontSize: 20, fontWeight: '700', color: '#0f1117', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 4 },
  price: { fontSize: 36, fontWeight: '700', color: '#0f1117' },
  period: { fontSize: 14, color: '#888' },
  billed: { fontSize: 12, color: '#888', marginBottom: 4 },
  cta: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 14, alignItems: 'center', marginVertical: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  ctaFeatured: { backgroundColor: '#0f1117', borderColor: '#0f1117' },
  ctaText: { fontSize: 15, fontWeight: '600', color: '#0f1117' },
  ctaTextFeatured: { color: '#fff' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureCheck: { color: '#0f6e56', fontWeight: '700', fontSize: 14 },
  featureText: { fontSize: 14, color: '#444' },
})
