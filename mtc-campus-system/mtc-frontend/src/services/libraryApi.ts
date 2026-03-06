import apiClient from '@/lib/axios';

// ==================== TypeScript Interfaces ====================

export interface Book {
  id: number;
  title: string;
  isbn: string;
  author: string;
  publisher?: string;
  edition?: string;
  year_published?: number;
  category: string;
  subject?: string;
  total_copies: number;
  available_copies: number;
  location?: string;
  shelf_number?: string;
  description?: string;
  cover_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookBorrowing {
  id: number;
  borrowing_reference: string;
  book: number;
  book_details?: {
    title: string;
    isbn: string;
    author: string;
  };
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
    email?: string;
  };
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  status_display?: string;
  fine_amount?: number;
  fine_paid?: boolean;
  notes?: string;
  issued_by?: number;
  issued_by_details?: {
    full_name: string;
    email?: string;
  };
  returned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface BookReservation {
  id: number;
  reservation_reference: string;
  book: number;
  book_details?: {
    title: string;
    isbn: string;
    author: string;
  };
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
    email?: string;
  };
  reservation_date: string;
  expiry_date: string;
  status: 'PENDING' | 'AVAILABLE' | 'COLLECTED' | 'CANCELLED' | 'EXPIRED';
  status_display?: string;
  notification_sent?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookFine {
  id: number;
  fine_reference: string;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
  };
  borrowing?: number;
  amount: number;
  reason: 'OVERDUE' | 'DAMAGED' | 'LOST';
  reason_display?: string;
  status: 'PENDING' | 'PAID' | 'WAIVED';
  status_display?: string;
  issue_date: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  books_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_books: number;
  total_categories: number;
  books_borrowed: number;
  books_available: number;
  overdue_books: number;
  active_reservations: number;
  total_fines: number;
  fines_collected: number;
  pending_fines: number;
  books_issued_today: number;
  books_returned_today: number;
}

export interface BookCreate {
  title: string;
  isbn: string;
  author: string;
  publisher?: string;
  edition?: string;
  year_published?: number;
  category: string;
  subject?: string;
  total_copies: number;
  location?: string;
  shelf_number?: string;
  description?: string;
  is_active?: boolean;
}

export interface BookUpdate {
  title?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  edition?: string;
  year_published?: number;
  category?: string;
  subject?: string;
  total_copies?: number;
  location?: string;
  shelf_number?: string;
  description?: string;
  is_active?: boolean;
}

export interface BorrowingCreate {
  book: number;
  student: number;
  issue_date: string;
  due_date: string;
  notes?: string;
}

export interface ReservationCreate {
  book: number;
  student: number;
  notes?: string;
}

// ==================== API Methods ====================

/**
 * Fetch books with optional filters
 */
export const getBooks = async (params?: {
  search?: string;
  category?: string;
  subject?: string;
  availability?: 'available' | 'unavailable' | 'all';
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/library/books/', { params });
  return response.data;
};

/**
 * Get single book details
 */
export const getBookById = async (id: number) => {
  const response = await apiClient.get(`/library/books/${id}/`);
  return response.data;
};

/**
 * Create new book
 */
export const createBook = async (data: BookCreate) => {
  const response = await apiClient.post('/library/books/', data);
  return response.data;
};

/**
 * Update existing book
 */
export const updateBook = async (id: number, data: BookUpdate) => {
  const response = await apiClient.patch(`/library/books/${id}/`, data);
  return response.data;
};

/**
 * Delete book
 */
export const deleteBook = async (id: number) => {
  const response = await apiClient.delete(`/library/books/${id}/`);
  return response.data;
};

/**
 * Search books by ISBN
 */
export const searchBookByISBN = async (isbn: string) => {
  const response = await apiClient.get(`/library/books/search-by-isbn/${isbn}/`);
  return response.data;
};

/**
 * Get book availability status
 */
export const getBookAvailability = async (bookId: number) => {
  const response = await apiClient.get(`/library/books/${bookId}/availability/`);
  return response.data;
};

/**
 * Fetch book borrowings with filters
 */
export const getBorrowings = async (params?: {
  student_number?: string;
  book_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/library/borrowings/', { params });
  return response.data;
};

/**
 * Get single borrowing record
 */
export const getBorrowingById = async (id: number) => {
  const response = await apiClient.get(`/library/borrowings/${id}/`);
  return response.data;
};

/**
 * Issue book to student
 */
export const issueBook = async (data: BorrowingCreate) => {
  const response = await apiClient.post('/library/borrowings/issue/', data);
  return response.data;
};

/**
 * Return borrowed book
 */
export const returnBook = async (borrowingId: number, data?: {
  condition?: string;
  notes?: string;
}) => {
  const response = await apiClient.post(`/library/borrowings/${borrowingId}/return/`, data);
  return response.data;
};

/**
 * Renew borrowed book
 */
export const renewBook = async (borrowingId: number, data?: {
  new_due_date?: string;
  notes?: string;
}) => {
  const response = await apiClient.post(`/library/borrowings/${borrowingId}/renew/`, data);
  return response.data;
};

/**
 * Mark book as lost
 */
export const markBookAsLost = async (borrowingId: number, reason: string) => {
  const response = await apiClient.post(`/library/borrowings/${borrowingId}/mark-lost/`, { reason });
  return response.data;
};

/**
 * Get current borrowings by student
 */
export const getCurrentBorrowings = async (studentNumber: string) => {
  const response = await apiClient.get(`/library/borrowings/current/${studentNumber}/`);
  return response.data;
};

/**
 * Get overdue borrowings
 */
export const getOverdueBorrowings = async (params?: {
  student_number?: string;
  days_overdue?: number;
}) => {
  const response = await apiClient.get('/library/borrowings/overdue/', { params });
  return response.data;
};

/**
 * Fetch book reservations
 */
export const getReservations = async (params?: {
  student_number?: string;
  book_id?: number;
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/library/reservations/', { params });
  return response.data;
};

/**
 * Get single reservation
 */
export const getReservationById = async (id: number) => {
  const response = await apiClient.get(`/library/reservations/${id}/`);
  return response.data;
};

/**
 * Create book reservation
 */
export const createReservation = async (data: ReservationCreate) => {
  const response = await apiClient.post('/library/reservations/', data);
  return response.data;
};

/**
 * Cancel reservation
 */
export const cancelReservation = async (id: number) => {
  const response = await apiClient.post(`/library/reservations/${id}/cancel/`);
  return response.data;
};

/**
 * Mark reservation as collected
 */
export const collectReservation = async (id: number) => {
  const response = await apiClient.post(`/library/reservations/${id}/collect/`);
  return response.data;
};

/**
 * Get active reservations for a book
 */
export const getBookReservations = async (bookId: number) => {
  const response = await apiClient.get(`/library/reservations/book/${bookId}/`);
  return response.data;
};

/**
 * Fetch book fines
 */
export const getFines = async (params?: {
  student_number?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/library/fines/', { params });
  return response.data;
};

/**
 * Get single fine record
 */
export const getFineById = async (id: number) => {
  const response = await apiClient.get(`/library/fines/${id}/`);
  return response.data;
};

/**
 * Pay fine
 */
export const payFine = async (fineId: number, data?: {
  payment_method?: string;
  notes?: string;
}) => {
  const response = await apiClient.post(`/library/fines/${fineId}/pay/`, data);
  return response.data;
};

/**
 * Waive fine
 */
export const waiveFine = async (fineId: number, reason: string) => {
  const response = await apiClient.post(`/library/fines/${fineId}/waive/`, { reason });
  return response.data;
};

/**
 * Get student fines summary
 */
export const getStudentFinesSummary = async (studentNumber: string) => {
  const response = await apiClient.get(`/library/fines/summary/${studentNumber}/`);
  return response.data;
};

/**
 * Fetch book categories
 */
export const getCategories = async (params?: {
  is_active?: boolean;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/library/categories/', { params });
  return response.data;
};

/**
 * Get single category
 */
export const getCategoryById = async (id: number) => {
  const response = await apiClient.get(`/library/categories/${id}/`);
  return response.data;
};

/**
 * Create book category
 */
export const createCategory = async (data: {
  name: string;
  code: string;
  description?: string;
}) => {
  const response = await apiClient.post('/library/categories/', data);
  return response.data;
};

/**
 * Update category
 */
export const updateCategory = async (id: number, data: Partial<BookCategory>) => {
  const response = await apiClient.patch(`/library/categories/${id}/`, data);
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number) => {
  const response = await apiClient.delete(`/library/categories/${id}/`);
  return response.data;
};

/**
 * Get library dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/library/dashboard-stats/');
  return response.data;
};

/**
 * Get borrowing analytics
 */
export const getBorrowingAnalytics = async (params?: {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
  category?: string;
}) => {
  const response = await apiClient.get('/library/analytics/borrowings/', { params });
  return response.data;
};

/**
 * Get popular books analytics
 */
export const getPopularBooksAnalytics = async (params?: {
  limit?: number;
  period?: 'monthly' | 'quarterly' | 'yearly';
}) => {
  const response = await apiClient.get('/library/analytics/popular-books/', { params });
  return response.data;
};

/**
 * Export library reports
 */
export const exportLibraryReport = async (params: {
  report_type: 'books' | 'borrowings' | 'reservations' | 'fines';
  format: 'csv' | 'excel' | 'pdf';
  date_from?: string;
  date_to?: string;
}) => {
  const response = await apiClient.get('/library/export-report/', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Generate barcode for book
 */
export const generateBookBarcode = async (bookId: number) => {
  const response = await apiClient.get(`/library/books/${bookId}/generate-barcode/`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Scan book barcode
 */
export const scanBookBarcode = async (barcode: string) => {
  const response = await apiClient.post('/library/books/scan-barcode/', { barcode });
  return response.data;
};
