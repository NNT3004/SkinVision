import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useHistoryStore } from '@/store/history-store';
import { diseases } from '@/constants/diseases';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { DiseaseCard } from '@/components/DiseaseCard';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit3,
  Save,
  X,
  Share2,
  Trash2
} from 'lucide-react-native';

export default function ScanResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scans, updateScanNotes, deleteScan } = useHistoryStore();

  // Find the scan by ID
  const scan = scans.find(s => s.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(scan?.notes || '');

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Save notes
  const saveNotes = () => {
    if (scan) {
      updateScanNotes(scan.id, notes);
      setIsEditingNotes(false);
    }
  };

  // Delete scan
  const handleDelete = () => {
    Alert.alert(
      'Xóa lượt quét',
      'Bạn có chắc chắn muốn xóa lượt quét này không? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy hành động', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            if (scan) {
              deleteScan(scan.id);
              router.replace('/history');
            }
          }
        }
      ]
    );
  };

  // Share result
  const handleShare = () => {
    Alert.alert(
      'Chia sẻ kết quả',
      'Bạn có thể chia sẻ kết quả quét với nhân viên y tế hoặc lưu về thiết bị của mình.',
      [{ text: 'OK' }]
    );
  };

  // If scan not found, show error
  if (!scan) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={colors.error} />
          <Text style={styles.errorText}>Scan result not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/history')}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go to History</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sort diseases by probability
  const sortedResults = [...scan.diseases].sort((a, b) => b.probability - a.probability);

  // Get full disease info for each result
  const resultsWithInfo = sortedResults.map(result => {
    const diseaseInfo = diseases.find(d => d.id === result.id);
    return {
      ...result,
      diseaseInfo
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Scan Result',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Share2 size={22} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDelete}
              >
                <Trash2 size={22} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: scan.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.darkGray} />
            <Text style={styles.dateText}>{formatDate(scan.date)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            <Text style={styles.sectionDescription}>
              Potential skin conditions identified in your image
            </Text>

            <View style={styles.resultsContainer}>
              {resultsWithInfo.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <View style={styles.probabilityContainer}>
                      <View
                        style={[
                          styles.probabilityBar,
                          { width: `${result.probability * 100}%` }
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.probabilityText}>
                    {Math.round(result.probability * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>Notes</Text>
              {!isEditingNotes ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditingNotes(true)}
                >
                  <Edit3 size={16} color={colors.primary} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.notesActions}>
                  <TouchableOpacity
                    style={styles.notesActionButton}
                    onPress={() => {
                      setNotes(scan.notes || '');
                      setIsEditingNotes(false);
                    }}
                  >
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.notesActionButton}
                    onPress={saveNotes}
                  >
                    <Save size={16} color={colors.success} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isEditingNotes ? (
              <Input
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this scan..."
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.notesText}>
                {scan.notes || 'No notes added yet.'}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identified Conditions</Text>
            <Text style={styles.sectionDescription}>
              Tap on a condition to learn more
            </Text>

            {resultsWithInfo.map((result, index) => (
              result.diseaseInfo && (
                <DiseaseCard
                  key={index}
                  disease={result.diseaseInfo}
                  onPress={() => router.push(`/disease/${result.diseaseInfo.id}`)}
                />
              )
            ))}
          </View>

          <Text style={styles.disclaimer}>
            Note: This analysis is for informational purposes only and should not
            replace professional medical advice. Always consult a healthcare provider
            for diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  resultsContainer: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultInfo: {
    flex: 1,
    marginRight: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  probabilityContainer: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  probabilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  notesActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notesActionButton: {
    padding: 4,
  },
  notesText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: scan => scan.notes ? 'normal' : 'italic',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
});