import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Disease } from '@/types';
import { colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';

interface DiseaseCardProps {
  disease: Disease;
  onPress: () => void;
  compact?: boolean;
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({ 
  disease, 
  onPress,
  compact = false
}) => {
  const getSeverityColor = (severity: string) => {
    if (severity.includes('Severe')) return colors.error;
    if (severity.includes('Moderate')) return colors.warning;
    return colors.success;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: disease.imageUrl }} 
        style={[styles.image, compact && styles.compactImage]} 
        resizeMode="cover"
      />
      
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.header}>
          <Text style={styles.name}>{disease.name}</Text>
          <View 
            style={[
              styles.severityBadge, 
              { backgroundColor: getSeverityColor(disease.severity) }
            ]}
          >
            <Text style={styles.severityText}>{disease.severity}</Text>
          </View>
        </View>
        
        {!compact && (
          <Text 
            style={styles.description}
            numberOfLines={2}
          >
            {disease.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          {!compact && (
            <Text style={styles.symptomsText}>
              {disease.symptoms.slice(0, 3).join(', ')}
              {disease.symptoms.length > 3 ? '...' : ''}
            </Text>
          )}
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
  compactContainer: {
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 'auto',
  },
  compactImage: {
    width: 70,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  compactContent: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomsText: {
    fontSize: 12,
    color: colors.darkGray,
    fontStyle: 'italic',
  },
});