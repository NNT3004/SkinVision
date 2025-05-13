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
    return date.toLocaleDateString('vi-VN', {
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
          <Text style={styles.errorText}>Không tìm thấy kết quả quét</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/history')}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Xem lịch sử</Text>
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
            <Text style={styles.sectionTitle}>Kết quả phân tích</Text>
            <Text style={styles.sectionDescription}>
              Các tình trạng da có thể được phát hiện trong hình ảnh của bạn
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
                          { width: `${result.probability * 100}%` },
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
              <Text style={styles.sectionTitle}>Ghi chú</Text>
              {!isEditingNotes ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditingNotes(true)}
                >
                  <Edit3 size={16} color={colors.primary} />
                  <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.notesActions}>
                  <TouchableOpacity
                    style={styles.notesActionButton}
                    onPress={() => {
                      setNotes(''); // Đặt lại ghi chú về chuỗi rỗng
                      setIsEditingNotes(false); // Thoát khỏi chế độ chỉnh sửa
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
                placeholder="Thêm ghi chú về lượt quét này..."
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.notesText}>
                {scan.notes || 'Chưa có ghi chú nào.'}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tình trạng đã nhận diện</Text>
            <Text style={styles.sectionDescription}>
              Nhấn vào một tình trạng để tìm hiểu thêm
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
            Lưu ý: Phân tích này chỉ mang tính chất tham khảo và không thay thế cho lời khuyên y tế chuyên môn.
            Hãy luôn tham khảo ý kiến của nhân viên y tế để được chẩn đoán và điều trị chính xác.
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginHorizontal: 8,
  },
  scrollContent: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    marginLeft: 8,
    color: colors.darkGray,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    color: colors.darkGray,
    marginBottom: 8,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  probabilityContainer: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  probabilityBar: {
    height: '100%',
    backgroundColor: colors.success,
  },
  probabilityText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    marginLeft: 4,
    color: colors.primary,
  },
  notesActions: {
    flexDirection: 'row',
  },
  notesActionButton: {
    marginHorizontal: 4,
  },
  notesText: {
    marginTop: 8,
    color: colors.darkGray,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
  },
});