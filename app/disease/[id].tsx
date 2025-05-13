import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { diseases } from '@/constants/diseases';
import {
  AlertCircle,
  Stethoscope,
  ArrowLeft,
  ChevronRight
} from 'lucide-react-native';

export default function DiseaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the disease by ID
  const disease = diseases.find(d => d.id === id);

  // If disease not found, show error
  if (!disease) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Không tìm thấy' }} />
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={colors.error} />
          <Text style={styles.errorText}>Không tìm thấy bệnh</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Set the screen title to the disease name
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: disease.name }} />
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: disease.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{disease.name}</Text>
            {/* <View style={styles.severityContainer}>
              <Text style={styles.severityLabel}>Mức độ nghiêm trọng:</Text>
              <View
                style={[
                  styles.severityBadge,
                  {
                    backgroundColor: disease.severity.includes('Severe')
                      ? colors.error
                      : disease.severity.includes('Moderate')
                        ? colors.warning
                        : colors.success
                  }
                ]}
              >
                <Text style={styles.severityText}>{disease.severity}</Text>
              </View>
            </View> */}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{disease.description}</Text>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Triệu chứng</Text>
            <View style={styles.listContainer}>
              {disease.symptoms.map((symptom, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phương pháp điều trị</Text>
            <View style={styles.listContainer}>
              {disease.treatments.map((treatment, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{treatment}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* <TouchableOpacity style={styles.consultButton}>
            <Stethoscope size={20} color="#FFFFFF" />
            <Text style={styles.consultButtonText}>
              Tham khảo ý kiến bác sĩ da liễu
            </Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity> */}

          <Text style={styles.disclaimer}>
            Lưu ý: Thông tin này chỉ mang tính chất tham khảo và không thay thế cho lời khuyên y tế chuyên môn.
            Luôn tham khảo ý kiến của nhân viên y tế để được chẩn đoán và điều trị chính xác.
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  consultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  consultButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
});