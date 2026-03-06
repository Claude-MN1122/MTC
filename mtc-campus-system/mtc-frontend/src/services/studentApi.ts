import apiClient from '@/lib/axios';

export interface Student {
  id: number;
  student_number: string;
  full_name: string;
  national_id: string;
  department: string;
  department_display: string;
  year_of_study: number;
  year_of_study_display: string;
  gender: string;
  photo_url?: string | null;
  qr_code_url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  is_active: boolean;
  is_registered: boolean;
  has_photo: boolean;
  has_qr_code: boolean;
  id_card_ready: boolean;
}

export interface QRCodeResponse {
  student_number: string;
  full_name: string;
  department: string;
  qr_code_url: string;
  qr_data: {
    student_number: string;
    full_name: string;
    department: string;
    institution: string;
  };
}

/**
 * Fetch all students with pagination and filtering
 */
export const getStudents = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  department?: string;
  year_of_study?: number;
}) => {
  const response = await apiClient.get('/students/', { params });
  return response.data;
};

/**
 * Get a single student by ID
 */
export const getStudent = async (id: number) => {
  const response = await apiClient.get(`/students/${id}/`);
  return response.data;
};

/**
 * Get student's QR code data
 */
export const getStudentQRCode = async (id: number): Promise<QRCodeResponse> => {
  const response = await apiClient.get(`/students/${id}/qr_code/`);
  return response.data;
};

/**
 * Download student's QR code image
 */
export const downloadStudentQRCode = async (id: number) => {
  const response = await apiClient.get(`/students/${id}/download_qr_code/`, {
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `qr_${id}.png`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Upload student photo
 */
export const uploadStudentPhoto = async (id: number, photoFile: File) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  
  const response = await apiClient.post(`/students/${id}/upload_photo/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Regenerate student's QR code
 */
export const regenerateQRCode = async (id: number) => {
  const response = await apiClient.post(`/students/${id}/regenerate_qr_code/`);
  return response.data;
};

/**
 * Generate and download student ID card PDF
 */
export const downloadStudentIDCard = async (id: number) => {
  const response = await apiClient.get(`/students/${id}/id_card/`, {
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `id_card_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Generate and download multiple ID cards
 */
export const downloadMultipleIDCards = async (studentIds: number[]) => {
  const response = await apiClient.get('/students/generate_id_cards/', {
    params: { ids: studentIds.join(',') },
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'student_id_cards.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
