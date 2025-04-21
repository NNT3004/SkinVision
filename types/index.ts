// Type definitions for the app

export interface User {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
    phone?: string;
    birthdate?: string;
  }
  
  export interface Disease {
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
    imageUrl: string;
    severity: string;
  }
  
  export interface ScanResult {
    id: string;
    userId: string;
    imageUri: string;
    date: string;
    diseases: {
      id: string;
      name: string;
      probability: number;
    }[];
    notes?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
  }
  
  export interface HistoryState {
    scans: ScanResult[];
    isLoading: boolean;
    error: string | null;
    addScan: (scan: Omit<ScanResult, "id" | "date">) => void;
    deleteScan: (id: string) => void;
    updateScanNotes: (id: string, notes: string) => void;
  }