import apiClient from '@/lib/axios';

export interface Hostel {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  capacity: number;
  description?: string;
  is_active: boolean;
  total_rooms: number;
  occupied_spaces: number;
  available_spaces: number;
  occupancy_rate: number;
}

export interface Room {
  id: number;
  hostel: number;
  hostel_name: string;
  room_number: string;
  capacity: number;
  floor?: string;
  room_type?: string;
  is_active: boolean;
  occupied_spaces: number;
  available_spaces: number;
  is_full: boolean;
  occupancy_rate: number;
}

export interface AccommodationApplication {
  id: number;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
    email?: string;
  };
  hostel?: number;
  hostel_name?: string;
  room?: number;
  room_number?: string;
  period: string;
  period_display?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'CANCELLED';
  status_display?: string;
  application_date: string;
  decision_date?: string;
  notes?: string;
  rejection_reason?: string;
  waiting_list_position: number;
  check_in_date?: string;
  check_out_date?: string;
}

/**
 * Fetch all hostels
 */
export const getHostels = async (params?: {
  gender?: string;
  is_active?: boolean;
  search?: string;
}) => {
  const response = await apiClient.get('/accommodation/hostels/', { params });
  return response.data;
};

/**
 * Get single hostel details
 */
export const getHostel = async (id: number) => {
  const response = await apiClient.get(`/accommodation/hostels/${id}/`);
  return response.data;
};

/**
 * Get hostel statistics
 */
export const getHostelStatistics = async (id: number) => {
  const response = await apiClient.get(`/accommodation/hostels/${id}/statistics/`);
  return response.data;
};

/**
 * Create new hostel
 */
export const createHostel = async (data: Partial<Hostel>) => {
  const response = await apiClient.post('/accommodation/hostels/', data);
  return response.data;
};

/**
 * Update hostel
 */
export const updateHostel = async (id: number, data: Partial<Hostel>) => {
  const response = await apiClient.patch(`/accommodation/hostels/${id}/`, data);
  return response.data;
};

/**
 * Delete hostel
 */
export const deleteHostel = async (id: number) => {
  const response = await apiClient.delete(`/accommodation/hostels/${id}/`);
  return response.data;
};

/**
 * Fetch all rooms
 */
export const getRooms = async (params?: {
  hostel?: number;
  is_active?: boolean;
  search?: string;
}) => {
  const response = await apiClient.get('/accommodation/rooms/', { params });
  return response.data;
};

/**
 * Get single room details
 */
export const getRoom = async (id: number) => {
  const response = await apiClient.get(`/accommodation/rooms/${id}/`);
  return response.data;
};

/**
 * Get room availability
 */
export const getRoomAvailability = async (id: number) => {
  const response = await apiClient.get(`/accommodation/rooms/${id}/availability/`);
  return response.data;
};

/**
 * Create new room
 */
export const createRoom = async (data: Partial<Room>) => {
  const response = await apiClient.post('/accommodation/rooms/', data);
  return response.data;
};

/**
 * Update room
 */
export const updateRoom = async (id: number, data: Partial<Room>) => {
  const response = await apiClient.patch(`/accommodation/rooms/${id}/`, data);
  return response.data;
};

/**
 * Delete room
 */
export const deleteRoom = async (id: number) => {
  const response = await apiClient.delete(`/accommodation/rooms/${id}/`);
  return response.data;
};

/**
 * Fetch accommodation applications
 */
export const getApplications = async (params?: {
  status?: string;
  period?: string;
  hostel?: number;
  search?: string;
}) => {
  const response = await apiClient.get('/accommodation/applications/', { params });
  return response.data;
};

/**
 * Get single application
 */
export const getApplication = async (id: number) => {
  const response = await apiClient.get(`/accommodation/applications/${id}/`);
  return response.data;
};

/**
 * Submit accommodation application
 */
export const applyForAccommodation = async (data: {
  student: number;
  hostel?: number;
  period: string;
  notes?: string;
}) => {
  const response = await apiClient.post('/accommodation/applications/apply/', data);
  return response.data;
};

/**
 * Get my applications
 */
export const getMyApplications = async () => {
  const response = await apiClient.get('/accommodation/applications/my_applications/');
  return response.data;
};

/**
 * Approve application
 */
export const approveApplication = async (id: number, data?: {
  assign_room?: number;
  assign_hostel?: number;
  notes?: string;
}) => {
  const response = await apiClient.post(`/accommodation/applications/${id}/approve/`, data || {});
  return response.data;
};

/**
 * Reject application
 */
export const rejectApplication = async (id: number, data?: { reason?: string }) => {
  const response = await apiClient.post(`/accommodation/applications/${id}/reject/`, data || {});
  return response.data;
};

/**
 * Cancel application
 */
export const cancelApplication = async (id: number) => {
  const response = await apiClient.post(`/accommodation/applications/${id}/cancel_application/`);
  return response.data;
};

/**
 * Get waiting list
 */
export const getWaitingList = async () => {
  const response = await apiClient.get('/accommodation/applications/waiting_list/');
  return response.data;
};

/**
 * Process waiting list
 */
export const processWaitingList = async (hostelId?: number) => {
  const response = await apiClient.post('/accommodation/applications/process_waiting_list/', null, {
    params: { hostel: hostelId }
  });
  return response.data;
};

/**
 * Get application statistics
 */
export const getApplicationStatistics = async () => {
  const response = await apiClient.get('/accommodation/applications/statistics/');
  return response.data;
};
