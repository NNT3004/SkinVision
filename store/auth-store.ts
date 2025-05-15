import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types';
import { router } from 'expo-router';

// Danh sách người dùng giả lập
const mockUsers = [
  {
    id: '1',
    email: 'NNT@gmail.com',
    password: '30042003',
    name: 'NNT',
  },
  {
    id: '2',
    email: 'NNT2@gmail.com',
    password: '30042003',
    name: 'NNT2',
  },
];

// Tạo store cho trạng thái xác thực
// Sử dụng Zustand để quản lý trạng thái xác thực
export const useAuthStore = create<AuthState>()(
  persist(// Tạo store cho trạng thái xác thực
    (set, get) => ({    // Hàm khởi tạo store
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Đăng nhập người dùng
      // Hàm này sẽ được gọi khi người dùng nhấn nút đăng nhập
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {// Đặt trạng thái tải và xóa lỗi trước đó
          // Mô phỏng gọi API với độ trễ
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Tìm người dùng trong danh sách giả lập
          const user = mockUsers.find(
            u => u.email === email && u.password === password
          );
          
          if (!user) {
            throw new Error('Email hoặc mật khẩu sai. Vui lòng nhặp lại');
          }
          // Nếu không tìm thấy người dùng, ném lỗi
          // Nếu tìm thấy người dùng, lưu thông tin người dùng vào state
          
          const { password: _, ...userWithoutPassword } = user;
          
          // Lưu trữ thông tin người dùng (không bao gồm mật khẩu)
          set({
            user: userWithoutPassword as User, // Lưu thông tin người dùng không bao gồm mật khẩu
            isAuthenticated: true, // Đặt trạng thái đã đăng nhập
            isLoading: false, // Đặt lại trạng thái tải
          });
          
          // Điều hướng đến màn hình chính
          router.replace('/(tabs)'); // Chuyển hướng đến màn hình chính
        } catch (error: any) {
          // Xử lý lỗi nếu đăng nhập thất bại
          set({
            error: error.message || 'Đăng nhập không thành công', // Lưu thông báo lỗi
            isLoading: false, // Đặt lại trạng thái tải
          });          
        }
      },

      
      // Đăng ký người dùng mới
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái tải và xóa lỗi trước đó
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Mô phỏng gọi API với độ trễ
          
          // Kiểm tra xem email đã tồn tại hay chưa
          const existingUser = mockUsers.find(u => u.email === email);
          
          if (existingUser) {
            throw new Error('Email này đã được đăng ký, vui lòng sử dụng email khác'); // Ném lỗi nếu email đã tồn tại
          }
          
          // Tạo người dùng mới
          const newUser = {
            id: String(mockUsers.length + 1), // Tạo ID mới cho người dùng
            email,
            name,
          };
          
          mockUsers.push({ ...newUser, password }); // Thêm người dùng mới vào danh sách mock
          
          set({
            user: newUser, // Lưu thông tin người dùng mới
            isAuthenticated: true, // Đặt trạng thái đã đăng nhập
            isLoading: false, // Đặt lại trạng thái tải
          });
          
          router.replace('/(tabs)'); // Điều hướng đến màn hình chính
        } catch (error: any) {
          set({
            error: error.message || 'Đăng Kí không thành công', // Lưu thông báo lỗi
            isLoading: false, // Đặt lại trạng thái tải
          });
        }
      },

      // Đăng xuất người dùng
      // Hàm này sẽ được gọi khi người dùng nhấn nút đăng xuất
      logout: () => {
        set({
          user: null,
          isAuthenticated: false, 
        });
        router.replace('/login'); 
      },

      // Cập nhật thông tin người dùng
      // Hàm này sẽ được gọi khi người dùng muốn cập nhật thông tin cá nhân
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        // Đặt trạng thái tải và xóa lỗi trước đó

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user; 
          
          if (!currentUser) {
            throw new Error('Không tìm thấy người dùng');
          }

          // Cập nhật thông tin người dùng
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          // Cập nhật thông tin người dùng
          set({
            user: updatedUser, // Lưu thông tin người dùng đã được cập nhật
            isLoading: false, // Đặt lại trạng thái tải
          });
        } catch (error: any) {
          // Xử lý lỗi nếu cập nhật hồ sơ thất bại
          set({
            error: error.message || 'Cập nhật hồ sơ không thành công', // Lưu thông báo lỗi
            isLoading: false, // Đặt lại trạng thái tải
          });
        }
      },
    }),
    {
      // Tên cho bộ lưu trữ được duy trì
      name: 'auth-storage', // Tên của bộ lưu trữ được duy trì

      // Sử dụng AsyncStorage để lưu trữ dữ liệu
      storage: createJSONStorage(() => AsyncStorage), // Sử dụng AsyncStorage để lưu trữ dữ liệu
    }
  )
);