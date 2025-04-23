import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth-store';
import { useHistoryStore } from '@/store/history-store';
import { colors } from '@/constants/colors';
import { diseases } from '@/constants/diseases';
import { Camera, Upload, Info, ArrowRight } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { DiseaseCard } from '@/components/DiseaseCard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { addScan } = useHistoryStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Request camera permissions
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Yêu cầu quyền truy cập',
          'Ứng dụng cần quyền truy cập camera để chụp ảnh phục vụ phân tích da.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Lỗi khi chụp ảnh:', error);
      Alert.alert('Lỗi', 'Chụp ảnh không thành công. Vui lòng thử lại.');
    }
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Chọn ảnh không thành công. Vui lòng thử lại.');
    }
  };

  // Process the selected image
  const processImage = async (imageUri: string) => {
    if (!user) return;

    setIsProcessing(true);

    try {
      // Simulate API call for disease recognition
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock results - in a real app, this would come from an API
      const randomDiseases = [...diseases]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const results = randomDiseases.map(disease => ({
        id: disease.id,
        name: disease.name,
        probability: Math.random() * 0.7 + 0.3, // Random probability between 0.3 and 1.0
      }));

      // Add to history
      const scanId = Date.now().toString();
      addScan({
        userId: user.id,
        imageUri,
        diseases: results,
      });

      // Navigate to result screen
      router.push(`/scan-result/${scanId}`);
    } catch (error) {
      console.error('Lỗi khi xử lý ảnh:', error);
      Alert.alert('Lỗi', 'Phân tích ảnh không thành công. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <Image
            source={{
              uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
            }}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.scanSection}>
          <Text style={styles.sectionTitle}>Phân tích da</Text>
          <Text style={styles.sectionDescription}>
            Chụp ảnh hoặc tải lên một bức ảnh để phân tích tình trạng da của bạn
          </Text>

          <View style={styles.scanOptions}>
            <TouchableOpacity
              style={styles.scanOption}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              <View style={styles.scanOptionIcon}>
                <Camera size={28} color={colors.primary} />
              </View>
              <Text style={styles.scanOptionText}>Chụp ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanOption}
              onPress={pickImage}
              disabled={isProcessing}
            >
              <View style={styles.scanOptionIcon}>
                <Upload size={28} color={colors.primary} />
              </View>
              <Text style={styles.scanOptionText}>Tải ảnh lên</Text>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>Đang phân tích ảnh...</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.infoTitle}>Bạn có biết?</Text>
          </View>
          <Text style={styles.infoText}>
            Kiểm tra da thường xuyên giúp phát hiện các vấn đề về da sớm,
            làm cho việc điều trị trở nên dễ dàng hơn. Hãy nhớ tham khảo ý kiến bác sĩ da liễu
            để có chẩn đoán chuyên môn.
          </Text>
        </View>


        <View style={styles.commonSection}>
          <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Các vấn đề da thường gặp</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/disease')}
            >
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {diseases.slice(0, 3).map(disease => (
            <DiseaseCard
              key={disease.id}
              disease={disease}
              onPress={() => router.push(`/disease/${disease.id}`)}
            />
          ))}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  scanSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 20,
  },
  scanOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scanOption: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scanOptionIcon: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  processingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  commonSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});