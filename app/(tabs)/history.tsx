import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useHistoryStore } from '@/store/history-store';
import { useAuthStore } from '@/store/auth-store';
import { ScanHistoryCard } from '@/components/ScanHistoryCard';
import { EmptyState } from '@/components/EmtyState';
import { History, Camera } from 'lucide-react-native';

export default function HistoryScreen() {
  const { scans } = useHistoryStore();
  const { user } = useAuthStore();

  // Filter scans for the current user
  const userScans = user
    ? scans.filter((scan: { userId: any; }) => scan.userId === user.id)
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử chẩn đoán</Text>
        <Text style={styles.subtitle}>
          Xem kết quả phân tích da trước đây
        </Text>
      </View>

      <FlatList
        data={userScans}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ScanHistoryCard
            scan={item}
            onPress={() => router.push(`/scan-result/${item.id}`)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          userScans.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={
          <EmptyState
            icon={<History size={40} color={colors.primary} />}
            title="Chưa có lịch sử quét"
            description="Kết quả phân tích da của bạn sẽ hiển thị tại đây sau khi bạn quét da."
            buttonTitle="Quét ngay"
            onButtonPress={() => router.push('/')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});