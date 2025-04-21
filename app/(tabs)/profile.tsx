import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useHistoryStore } from '@/store/history-store';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  User, 
  Mail, 
  Camera, 
  LogOut, 
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  FileText,
  Settings,
  X,
  Calendar,
  Phone
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const { scans } = useHistoryStore();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
  });
  
  // Filter scans for the current user
  const userScans = user 
    ? scans.filter((scan: { userId: any; }) => scan.userId === user.id)
    : [];
  
  // Pick an image from the gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        updateProfile({ profileImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      phone: '',
    };
    
    if (profileForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }
    
    if (profileForm.phone && !/^\+?[0-9]{10,15}$/.test(profileForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Save profile changes
  const saveChanges = async () => {
    if (!validateForm()) return;
    
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        birthdate: profileForm.birthdate,
      });
      
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Your profile has been updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };
  
  // Render a menu item
  const MenuItem = ({ icon, title, onPress }: { 
    icon: React.ReactNode, 
    title: string, 
    onPress: () => void 
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <ChevronRight size={20} color={colors.darkGray} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Manage your account and preferences
          </Text>
        </View>
        
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={pickImage}
          >
            <Image 
              source={{ 
                uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
              }} 
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            
            <View style={styles.emailContainer}>
              <Mail size={16} color={colors.darkGray} />
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.emailContainer}>
                <Phone size={16} color={colors.darkGray} />
                <Text style={styles.profileEmail}>{user.phone}</Text>
              </View>
            )}
            
            {user?.birthdate && (
              <View style={styles.emailContainer}>
                <Calendar size={16} color={colors.darkGray} />
                <Text style={styles.profileEmail}>{user.birthdate}</Text>
              </View>
            )}
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userScans.length}</Text>
                <Text style={styles.statLabel}>Scans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {userScans.length > 0 ? 
                    new Date(userScans[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                    '-'
                  }
                </Text>
                <Text style={styles.statLabel}>Last Scan</Text>
              </View>
            </View>
            
            <Button
              title="Edit Profile"
              onPress={() => {
                setProfileForm({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  birthdate: user?.birthdate || '',
                });
                setFormErrors({ name: '', phone: '' });
                setIsEditModalVisible(true);
              }}
              variant="outline"
              icon={<User size={18} color={colors.primary} />}
            />
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          <MenuItem 
            icon={<Bell size={20} color={colors.primary} />}
            title="Notifications"
            onPress={() => Alert.alert('Notifications', 'Notification settings would go here.')}
          />
          
          <MenuItem 
            icon={<Shield size={20} color={colors.primary} />}
            title="Privacy & Security"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would go here.')}
          />
          
          <MenuItem 
            icon={<Settings size={20} color={colors.primary} />}
            title="App Settings"
            onPress={() => Alert.alert('Settings', 'App settings would go here.')}
          />
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Support</Text>
          
          <MenuItem 
            icon={<HelpCircle size={20} color={colors.primary} />}
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'Help and support information would go here.')}
          />
          
          <MenuItem 
            icon={<FileText size={20} color={colors.primary} />}
            title="Terms & Policies"
            onPress={() => Alert.alert('Terms', 'Terms and policies would go here.')}
          />
        </View>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          icon={<LogOut size={20} color={colors.error} />}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setIsEditModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Input
                label="Full Name"
                value={profileForm.name}
                onChangeText={(text) => setProfileForm({...profileForm, name: text})}
                placeholder="Enter your full name"
                error={formErrors.name}
                icon={<User size={20} color={colors.darkGray} />}
              />
              
              <Input
                label="Email"
                value={profileForm.email}
                onChangeText={(text) => setProfileForm({...profileForm, email: text})}
                placeholder="Enter your email"
                editable={false}
                icon={<Mail size={20} color={colors.darkGray} />}
              />
              
              <Input
                label="Phone Number"
                value={profileForm.phone}
                onChangeText={(text) => setProfileForm({...profileForm, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                error={formErrors.phone}
                icon={<Phone size={20} color={colors.darkGray} />}
              />
              
              <Input
                label="Date of Birth"
                value={profileForm.birthdate}
                onChangeText={(text) => setProfileForm({...profileForm, birthdate: text})}
                placeholder="MM/DD/YYYY"
                icon={<Calendar size={20} color={colors.darkGray} />}
              />
              
              <Text style={styles.modalNote}>
                Note: Your email cannot be changed. Please contact support if you need to update your email address.
              </Text>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setIsEditModalVisible(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Save Changes"
                onPress={saveChanges}
                loading={isLoading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
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
  profileSection: {
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
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    marginBottom: 40,
    borderColor: colors.error,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  modalNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
});