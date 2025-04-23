import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { diseases } from '@/constants/diseases';
import { DiseaseCard } from '@/components/DiseaseCard';
import { Search, X } from 'lucide-react-native';

export default function DiseasesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter diseases based on search query
  const filteredDiseases = diseases.filter(disease => 
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.symptoms.some(symptom => 
      symptom.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Bệnh ngoài da</Text>
        <Text style={styles.subtitle}>
          Tìm hiểu về các tình trạng da phổ biến và các triệu chứng của chúng
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.darkGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.darkGray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredDiseases}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DiseaseCard
            disease={item}
            onPress={() => router.push(`/disease/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không tìm thấy bệnh "{searchQuery}"
            </Text>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});