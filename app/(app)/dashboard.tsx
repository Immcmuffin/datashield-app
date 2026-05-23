import { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'

interface Job {
  broker_name: string
  status: string
  result: { status: string; message: string } | null
  error_message: string | null
}

const STATUS_COLOR: Record<string, string> = {
  completed: '#0f6e56', running: '#185FA5', claimed: '#854F0B', pending: '#888', failed: '#a32d2d'
}
const STATUS_LABEL: Record<string, string> = {
  completed: 'Submitted', running: 'Running', claimed: 'Queued', pending: 'Waiting', failed: 'Failed'
}
const STATUS_ICON: Record<string, string> = {
  completed: '✓', running: '●', claimed: '○', pending: '○', failed: '✗'
}

export default function DashboardScreen() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userName, setUserName] = useState('')

  const fetchJobs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserName(user.email?.split('@')[0] || '')
    const { data } = await supabase.rpc('get_all_jobs_for_user', { p_user_id: user.id })
    if (data) {
      const sorted = [...data].sort((a: Job, b: Job) => {
        const order: Record<string, number> = { completed: 0, running: 1, claimed: 2, pending: 3, failed: 4 }
        return (order[a.status] ?? 5) - (order[b.status] ?? 5)
      })
      setJobs(sorted)
    }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 10000)
    return () => clearInterval(interval)
  }, [fetchJobs])

  const counts = {
    completed: jobs.filter(j => j.status === 'completed').length,
    inProgress: jobs.filter(j => ['running', 'claimed'].includes(j.status)).length,
    pending: jobs.filter(j => j.status === 'pending').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  }
  const pct = jobs.length ? Math.round((counts.completed / jobs.length) * 100) : 0

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#0f1117" style={{ marginTop: 60 }} />
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJobs() }} />}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.greeting}>Hi, {userName} 👋</Text>
        <Text style={styles.subheading}>Your data removal status</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={[styles.statNum, { color: '#0f6e56' }]}>{counts.completed}</Text><Text style={styles.statLabel}>Done</Text></View>
          <View style={styles.stat}><Text style={[styles.statNum, { color: '#185FA5' }]}>{counts.inProgress}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.stat}><Text style={[styles.statNum, { color: '#888' }]}>{counts.pending}</Text><Text style={styles.statLabel}>Pending</Text></View>
          <View style={styles.stat}><Text style={[styles.statNum, { color: '#a32d2d' }]}>{counts.failed}</Text><Text style={styles.statLabel}>Failed</Text></View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall progress</Text>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
          </View>
          <Text style={styles.progressSub}>{counts.completed} of {jobs.length} brokers processed</Text>
        </View>

        <Text style={styles.sectionTitle}>Broker Status</Text>
        <View style={styles.grid}>
          {jobs.map(job => {
            const notFound = job.result?.status === 'not_found'
            const color = STATUS_COLOR[job.status] || '#888'
            return (
              <View key={job.broker_name} style={styles.jobCard}>
                <View style={[styles.jobIcon, { backgroundColor: color + '22' }]}>
                  <Text style={[styles.jobIconText, { color }]}>{STATUS_ICON[job.status]}</Text>
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobName} numberOfLines={1}>{job.broker_name}</Text>
                  <Text style={[styles.jobStatus, { color }]}>
                    {notFound ? 'Not listed' : STATUS_LABEL[job.status]}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {jobs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛡️</Text>
            <Text style={styles.emptyTitle}>No active scan</Text>
            <Text style={styles.emptyText}>Subscribe to a plan to start removing your data.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#0f1117', marginBottom: 4 },
  subheading: { fontSize: 14, color: '#888', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: '#666' },
  progressPct: { fontSize: 13, fontWeight: '600', color: '#0f1117' },
  progressBar: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#1D9E75', borderRadius: 4 },
  progressSub: { fontSize: 12, color: '#aaa' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  jobCard: { width: '47%', backgroundColor: '#fff', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  jobIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  jobIconText: { fontSize: 14, fontWeight: '700' },
  jobInfo: { flex: 1 },
  jobName: { fontSize: 12, fontWeight: '600', color: '#0f1117', marginBottom: 2 },
  jobStatus: { fontSize: 11 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#0f1117', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center' },
})
