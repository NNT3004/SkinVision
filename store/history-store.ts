import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryState, ScanResult } from '@/types';

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      scans: [],
      isLoading: false,
      error: null,

      // Thêm một lượt quét mới vào danh sách
      addScan: (scanData) => {
        const newScan: ScanResult = {
          ...scanData, // Sao chép dữ liệu từ tham số đầu vào
          id: Date.now().toString(), // Tạo ID duy nhất dựa trên thời gian hiện tại
          date: new Date().toISOString(), // Lưu ngày giờ hiện tại dưới dạng ISO
        };

        set(state => ({
          scans: [newScan, ...state.scans], // Thêm lượt quét mới vào đầu danh sách
        }));
      },

      // Xóa một lượt quét dựa trên ID
      deleteScan: (id) => {
        set(state => ({
          scans: state.scans.filter(scan => scan.id !== id), // Lọc bỏ lượt quét có ID trùng khớp
        }));
      },

      // Cập nhật ghi chú cho một lượt quét
      updateScanNotes: (id, notes) => {
        set(state => ({
          scans: state.scans.map(scan => 
            scan.id === id ? { ...scan, notes } : scan // Nếu ID khớp, cập nhật ghi chú
          ),
        }));
      },
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);