import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScanResult } from '@/types';
import { colors } from '@/constants/colors';
import { Calendar, ChevronRight } from 'lucide-react-native';

interface ScanHistoryCardProps {
  scan: ScanResult;
  onPress: () => void;
}

export const ScanHistoryCard: React.FC<ScanHistoryCardProps> = ({ scan, onPress }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get top disease result
  const topResult = scan.diseases.sort((a, b) => b.probability - a.probability)[0];

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: scan.imageUri }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {topResult ? topResult.name : 'Unknown'}
          </Text>
          <Text style={styles.probability}>
            {topResult ? `${Math.round(topResult.probability * 100)}%` : ''}
          </Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.darkGray} />
          <Text style={styles.date}>{formatDate(scan.date)}</Text>
        </View>
        
        {scan.notes && (
          <Text 
            style={styles.notes}
            numberOfLines={1}
          >
            {scan.notes}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.resultsText}>
            {scan.diseases.length} {scan.diseases.length === 1 ? 'result' : 'results'}
          </Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 'auto',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  probability: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: colors.darkGray,
  },
  notes: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 12,
    color: colors.darkGray,
  },
});