import apiClient from '@/lib/axios';

export interface DiningAttendance {
  id: number;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
    email?: string;
  };
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  meal_type_display?: string;
  date: string;
  timestamp: string;
  scanner_device?: string;
  notes?: string;
}

export interface MealEligibility {
  student_number: string;
  full_name: string;
  is_eligible: boolean;
  has_accommodation: boolean;
  meals_consumed: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  can_scan_breakfast: boolean;
  can_scan_lunch: boolean;
  can_scan_dinner: boolean;
}

export interface ScanResult {
  success: boolean;
  message: string;
  student?: {
    id: number;
    full_name: string;
    student_number: string;
  };
  meal_type: string;
  date: string;
  timestamp: string;
  attendance_id?: number;
  eligibility?: MealEligibility;
}

export interface OfflineScan {
  id: number;
  student_number: string;
  meal_type: string;
  meal_type_display?: string;
  timestamp: string;
  device_id: string;
  sync_status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  sync_status_display?: string;
  sync_attempts: number;
  last_sync_attempt?: string;
  sync_error?: string;
  attendance_record?: number;
}

/**
 * Get dining attendance records
 */
export const getAttendanceRecords = async (params?: {
  meal_type?: string;
  date_from?: string;
  date_to?: string;
  today?: boolean;
  search?: string;
}) => {
  const response = await apiClient.get('/dining/attendance/', { params });
  return response.data;
};

/**
 * Get single attendance record
 */
export const getAttendanceRecord = async (id: number) => {
  const response = await apiClient.get(`/dining/attendance/${id}/`);
  return response.data;
};

/**
 * Process QR code scan
 */
export const processQRScan = async (data: {
  qr_data: string;
  meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  scanner_device?: string;
}) => {
  const response = await apiClient.post('/dining/scan/', data);
  return response.data;
};

/**
 * Check student meal eligibility
 */
export const checkMealEligibility = async (studentNumber: string) => {
  const response = await apiClient.get('/dining/eligibility/', {
    params: { student_number: studentNumber }
  });
  return response.data;
};

/**
 * Get today's attendance statistics
 */
export const getTodayStatistics = async () => {
  const response = await apiClient.get('/dining/statistics/today/');
  return response.data;
};

/**
 * Get attendance analytics
 */
export const getAttendanceAnalytics = async (params?: {
  date_from?: string;
  date_to?: string;
  meal_type?: string;
}) => {
  const response = await apiClient.get('/dining/analytics/', { params });
  return response.data;
};

/**
 * Submit offline scan batch
 */
export const submitOfflineScans = async (scans: Array<{
  studentNumber: string;
  mealType: string;
  timestamp: string;
}>, deviceId?: string) => {
  const response = await apiClient.post('/dining/offline-scans/sync/', {
    scans,
    device_id: deviceId
  });
  return response.data;
};

/**
 * Get pending offline scans
 */
export const getOfflineScans = async () => {
  const response = await apiClient.get('/dining/offline-scans/');
  return response.data;
};

/**
 * Retry failed offline scans
 */
export const retryOfflineScan = async (id: number) => {
  const response = await apiClient.post(`/dining/offline-scans/${id}/retry/`);
  return response.data;
};

/**
 * Clear synced offline scans
 */
export const clearSyncedScans = async () => {
  const response = await apiClient.post('/dining/offline-scans/clear-synced/');
  return response.data;
};
