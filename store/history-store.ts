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

      addScan: (scanData) => {
        const newScan: ScanResult = {
          ...scanData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };

        set(state => ({
          scans: [newScan, ...state.scans],
        }));
      },

      deleteScan: (id) => {
        set(state => ({
          scans: state.scans.filter(scan => scan.id !== id),
        }));
      },

      updateScanNotes: (id, notes) => {
        set(state => ({
          scans: state.scans.map(scan => 
            scan.id === id ? { ...scan, notes } : scan
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