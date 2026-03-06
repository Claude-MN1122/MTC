import apiClient from '@/lib/axios';

// ==================== TypeScript Interfaces ====================

export interface Invoice {
  id: number;
  invoice_number: string;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
    email?: string;
    program?: string;
  };
  amount: number;
  amount_paid: number;
  balance: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
  status_display?: string;
  due_date: string;
  issue_date: string;
  description: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeStructure {
  id: number;
  name: string;
  program?: string;
  year_of_study?: number;
  amount: number;
  fee_type: 'TUITION' | 'ACCOMMODATION' | 'DINING' | 'EXAM' | 'LIBRARY' | 'SPORTS' | 'OTHER';
  fee_type_display?: string;
  academic_year: string;
  semester: 'SEMESTER_1' | 'SEMESTER_2' | 'FULL_YEAR';
  semester_display?: string;
  is_active: boolean;
  is_mandatory: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  payment_reference: string;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
  };
  invoice?: number;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOBILE_MONEY' | 'CHEQUE';
  payment_method_display?: string;
  payment_date: string;
  transaction_reference?: string;
  bank?: string;
  narration?: string;
  received_by?: number;
  received_by_details?: {
    full_name: string;
    email?: string;
  };
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  status_display?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentBalance {
  student_number: string;
  full_name: string;
  total_invoiced: number;
  total_paid: number;
  outstanding_balance: number;
  overdue_amount: number;
  invoices_count: number;
  pending_invoices_count: number;
  last_payment_date?: string;
  last_payment_amount?: number;
}

export interface PaymentPlan {
  id: number;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
  };
  total_amount: number;
  amount_paid: number;
  remaining_balance: number;
  monthly_installment: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'CANCELLED';
  status_display?: string;
  installments_count: number;
  paid_installments: number;
  next_installment_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_invoiced: number;
  total_collected: number;
  outstanding_balance: number;
  overdue_amount: number;
  collection_rate: number;
  invoices_pending: number;
  invoices_overdue: number;
  payments_today: number;
  payments_this_month: number;
}

export interface InvoiceCreate {
  student: number;
  amount: number;
  due_date: string;
  description: string;
  notes?: string;
  fee_structure?: number;
}

export interface InvoiceUpdate {
  amount?: number;
  due_date?: string;
  description?: string;
  notes?: string;
  status?: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
}

export interface PaymentCreate {
  student: number;
  invoice?: number;
  amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOBILE_MONEY' | 'CHEQUE';
  payment_date: string;
  transaction_reference?: string;
  bank?: string;
  narration?: string;
  notes?: string;
}

export interface FeeStructureCreate {
  name: string;
  program?: string;
  year_of_study?: number;
  amount: number;
  fee_type: 'TUITION' | 'ACCOMMODATION' | 'DINING' | 'EXAM' | 'LIBRARY' | 'SPORTS' | 'OTHER';
  academic_year: string;
  semester: 'SEMESTER_1' | 'SEMESTER_2' | 'FULL_YEAR';
  is_mandatory: boolean;
  description?: string;
}

// ==================== API Methods ====================

/**
 * Fetch invoices with optional filters
 */
export const getInvoices = async (params?: {
  student_number?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/invoices/', { params });
  return response.data;
};

/**
 * Get single invoice details
 */
export const getInvoiceById = async (id: number) => {
  const response = await apiClient.get(`/finance/invoices/${id}/`);
  return response.data;
};

/**
 * Create new invoice
 */
export const createInvoice = async (data: InvoiceCreate) => {
  const response = await apiClient.post('/finance/invoices/', data);
  return response.data;
};

/**
 * Update existing invoice
 */
export const updateInvoice = async (id: number, data: InvoiceUpdate) => {
  const response = await apiClient.patch(`/finance/invoices/${id}/`, data);
  return response.data;
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (id: number) => {
  const response = await apiClient.delete(`/finance/invoices/${id}/`);
  return response.data;
};

/**
 * Mark invoice as paid
 */
export const markInvoiceAsPaid = async (id: number, paymentData?: { amount?: number }) => {
  const response = await apiClient.post(`/finance/invoices/${id}/mark-paid/`, paymentData);
  return response.data;
};

/**
 * Get student balance information
 */
export const getStudentBalance = async (studentNumber: string) => {
  const response = await apiClient.get(`/finance/student-balance/${studentNumber}/`);
  return response.data;
};

/**
 * Get all student balances with filters
 */
export const getStudentBalances = async (params?: {
  has_balance?: boolean;
  overdue?: boolean;
  program?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/student-balances/', { params });
  return response.data;
};

/**
 * Fetch payment records
 */
export const getPayments = async (params?: {
  student_number?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/payments/', { params });
  return response.data;
};

/**
 * Get single payment details
 */
export const getPaymentById = async (id: number) => {
  const response = await apiClient.get(`/finance/payments/${id}/`);
  return response.data;
};

/**
 * Record new payment
 */
export const createPayment = async (data: PaymentCreate) => {
  const response = await apiClient.post('/finance/payments/', data);
  return response.data;
};

/**
 * Update payment record
 */
export const updatePayment = async (id: number, data: Partial<Payment>) => {
  const response = await apiClient.patch(`/finance/payments/${id}/`, data);
  return response.data;
};

/**
 * Delete payment record
 */
export const deletePayment = async (id: number) => {
  const response = await apiClient.delete(`/finance/payments/${id}/`);
  return response.data;
};

/**
 * Process payment refund
 */
export const processRefund = async (id: number, reason: string) => {
  const response = await apiClient.post(`/finance/payments/${id}/refund/`, { reason });
  return response.data;
};

/**
 * Fetch fee structures
 */
export const getFeeStructures = async (params?: {
  fee_type?: string;
  program?: string;
  academic_year?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/fee-structures/', { params });
  return response.data;
};

/**
 * Get single fee structure
 */
export const getFeeStructureById = async (id: number) => {
  const response = await apiClient.get(`/finance/fee-structures/${id}/`);
  return response.data;
};

/**
 * Create fee structure
 */
export const createFeeStructure = async (data: FeeStructureCreate) => {
  const response = await apiClient.post('/finance/fee-structures/', data);
  return response.data;
};

/**
 * Update fee structure
 */
export const updateFeeStructure = async (id: number, data: Partial<FeeStructure>) => {
  const response = await apiClient.patch(`/finance/fee-structures/${id}/`, data);
  return response.data;
};

/**
 * Delete fee structure
 */
export const deleteFeeStructure = async (id: number) => {
  const response = await apiClient.delete(`/finance/fee-structures/${id}/`);
  return response.data;
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/finance/dashboard-stats/');
  return response.data;
};

/**
 * Get revenue analytics
 */
export const getRevenueAnalytics = async (params?: {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
}) => {
  const response = await apiClient.get('/finance/analytics/revenue/', { params });
  return response.data;
};

/**
 * Get collection rate analytics
 */
export const getCollectionRateAnalytics = async (params?: {
  period?: 'monthly' | 'quarterly';
  program?: string;
}) => {
  const response = await apiClient.get('/finance/analytics/collection-rate/', { params });
  return response.data;
};

/**
 * Generate invoice PDF
 */
export const generateInvoicePDF = async (invoiceId: number) => {
  const response = await apiClient.get(`/finance/invoices/${invoiceId}/generate-pdf/`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Send invoice via email
 */
export const sendInvoiceEmail = async (invoiceId: number, email?: string) => {
  const response = await apiClient.post(`/finance/invoices/${invoiceId}/send-email/`, {
    email,
  });
  return response.data;
};

/**
 * Get payment plans
 */
export const getPaymentPlans = async (params?: {
  student_number?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/payment-plans/', { params });
  return response.data;
};

/**
 * Create payment plan
 */
export const createPaymentPlan = async (data: {
  student: number;
  total_amount: number;
  monthly_installment: number;
  start_date: string;
  end_date: string;
  notes?: string;
}) => {
  const response = await apiClient.post('/finance/payment-plans/', data);
  return response.data;
};

/**
 * Update payment plan
 */
export const updatePaymentPlan = async (id: number, data: Partial<PaymentPlan>) => {
  const response = await apiClient.patch(`/finance/payment-plans/${id}/`, data);
  return response.data;
};

/**
 * Get pending approvals
 */
export const getPendingApprovals = async (params?: {
  type?: 'invoice' | 'payment' | 'refund';
  page?: number;
  page_size?: number;
}) => {
  const response = await apiClient.get('/finance/pending-approvals/', { params });
  return response.data;
};

/**
 * Approve payment
 */
export const approvePayment = async (id: number, notes?: string) => {
  const response = await apiClient.post(`/finance/payments/${id}/approve/`, { notes });
  return response.data;
};

/**
 * Reject payment
 */
export const rejectPayment = async (id: number, reason: string) => {
  const response = await apiClient.post(`/finance/payments/${id}/reject/`, { reason });
  return response.data;
};

/**
 * Export financial reports
 */
export const exportFinancialReport = async (params: {
  report_type: 'invoices' | 'payments' | 'balances' | 'revenue';
  format: 'csv' | 'excel' | 'pdf';
  date_from: string;
  date_to: string;
}) => {
  const response = await apiClient.get('/finance/export-report/', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
