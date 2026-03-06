import apiClient from '@/lib/axios';

// ==================== TypeScript Interfaces ====================

export interface DashboardOverview {
  total_students: number;
  total_staff: number;
  active_courses: number;
  system_users: number;
  students_male: number;
  students_female: number;
  new_students_this_month: number;
  returning_students: number;
}

export interface EnrollmentAnalytics {
  total_enrollments: number;
  enrollments_by_program: Array<{
    program: string;
    count: number;
    percentage: number;
  }>;
  enrollments_by_year: Array<{
    year: string;
    count: number;
    growth_rate: number;
  }>;
  enrollments_by_gender: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  trend_data: Array<{
    month: string;
    count: number;
  }>;
}

export interface AttendanceAnalytics {
  overall_attendance_rate: number;
  attendance_by_department: Array<{
    department: string;
    rate: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  daily_attendance: Array<{
    date: string;
    present: number;
    absent: number;
    rate: number;
  }>;
  low_attendance_alerts: Array<{
    student_number: string;
    full_name: string;
    attendance_rate: number;
    days_absent: number;
  }>;
}

export interface AcademicPerformance {
  average_gpa: number;
  gpa_distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  performance_by_subject: Array<{
    subject: string;
    average_score: number;
    pass_rate: number;
  }>;
  top_performers: Array<{
    student_number: string;
    full_name: string;
    gpa: number;
  }>;
  at_risk_students: Array<{
    student_number: string;
    full_name: string;
    gpa: number;
    failed_subjects: number;
  }>;
}

export interface AccommodationAnalytics {
  total_hostels: number;
  total_rooms: number;
  occupancy_rate: number;
  available_spaces: number;
  occupancy_by_hostel: Array<{
    hostel_name: string;
    capacity: number;
    occupied: number;
    occupancy_rate: number;
    gender: string;
  }>;
  application_status: {
    pending: number;
    approved: number;
    rejected: number;
    waiting_list: number;
  };
  revenue_from_accommodation: number;
}

export interface DiningAnalytics {
  total_meals_served: number;
  meals_by_type: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  daily_meal_trend: Array<{
    date: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
  }>;
  peak_dining_hours: Array<{
    hour: string;
    count: number;
  }>;
  student_meal_participation: number;
  revenue_from_dining: number;
  cost_per_meal: number;
}

export interface FinanceAnalytics {
  total_revenue: number;
  revenue_by_source: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
  total_expenses: number;
  expenses_by_category: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  net_balance: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  monthly_cash_flow: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  budget_utilization: number;
}

export interface LibraryAnalytics {
  total_books: number;
  books_borrowed: number;
  books_available: number;
  overdue_books: number;
  popular_categories: Array<{
    category: string;
    borrowings_count: number;
    percentage: number;
  }>;
  most_borrowed_books: Array<{
    title: string;
    author: string;
    borrowings_count: number;
  }>;
  borrowing_trend: Array<{
    month: string;
    count: number;
  }>;
  fines_collected: number;
  active_readers: number;
}

export interface SystemUsageAnalytics {
  active_users: number;
  users_by_role: Array<{
    role: string;
    count: number;
  }>;
  login_frequency: Array<{
    date: string;
    logins: number;
    unique_users: number;
  }>;
  feature_usage: Array<{
    feature: string;
    usage_count: number;
    percentage: number;
  }>;
  average_session_duration: number;
  peak_usage_hours: Array<{
    hour: string;
    users: number;
  }>;
}

export interface CustomReport {
  id: number;
  name: string;
  description?: string;
  report_type: 'enrollment' | 'academic' | 'financial' | 'operational' | 'custom';
  filters: object;
  columns: string[];
  created_by: number;
  created_at: string;
  last_run?: string;
  is_public: boolean;
}

export interface ReportExecutionResult {
  report_id: number;
  report_name: string;
  execution_time: string;
  row_count: number;
  data: any[];
  summary?: object;
  export_url?: string;
}

// ==================== API Methods ====================

/**
 * Get overview dashboard statistics
 */
export const getDashboardOverview = async () => {
  const response = await apiClient.get('/analytics/overview/');
  return response.data;
};

/**
 * Get enrollment analytics
 */
export const getEnrollmentAnalytics = async (params?: {
  academic_year?: string;
  program?: string;
  period?: 'monthly' | 'quarterly' | 'yearly';
}) => {
  const response = await apiClient.get('/analytics/enrollment/', { params });
  return response.data;
};

/**
 * Get attendance analytics
 */
export const getAttendanceAnalytics = async (params?: {
  department?: string;
  date_from?: string;
  date_to?: string;
}) => {
  const response = await apiClient.get('/analytics/attendance/', { params });
  return response.data;
};

/**
 * Get academic performance analytics
 */
export const getAcademicPerformanceAnalytics = async (params?: {
  semester?: string;
  program?: string;
  year_of_study?: number;
}) => {
  const response = await apiClient.get('/analytics/academic-performance/', { params });
  return response.data;
};

/**
 * Get accommodation analytics
 */
export const getAccommodationAnalytics = async (params?: {
  hostel?: number;
  gender?: string;
  academic_year?: string;
}) => {
  const response = await apiClient.get('/analytics/accommodation/', { params });
  return response.data;
};

/**
 * Get dining analytics
 */
export const getDiningAnalytics = async (params?: {
  date_from?: string;
  date_to?: string;
  meal_type?: string;
}) => {
  const response = await apiClient.get('/analytics/dining/', { params });
  return response.data;
};

/**
 * Get finance analytics
 */
export const getFinanceAnalytics = async (params?: {
  financial_year?: string;
  quarter?: string;
  include_projections?: boolean;
}) => {
  const response = await apiClient.get('/analytics/finance/', { params });
  return response.data;
};

/**
 * Get library analytics
 */
export const getLibraryAnalytics = async (params?: {
  category?: string;
  date_from?: string;
  date_to?: string;
}) => {
  const response = await apiClient.get('/analytics/library/', { params });
  return response.data;
};

/**
 * Get system usage analytics
 */
export const getSystemUsageAnalytics = async (params?: {
  date_from?: string;
  date_to?: string;
  user_role?: string;
}) => {
  const response = await apiClient.get('/analytics/system-usage/', { params });
  return response.data;
};

/**
 * Get comparative analytics across modules
 */
export const getComparativeAnalytics = async (params?: {
  modules?: string[];
  period?: 'monthly' | 'quarterly' | 'yearly';
  comparison_type?: 'trend' | 'performance' | 'efficiency';
}) => {
  const response = await apiClient.get('/analytics/comparative/', { params });
  return response.data;
};

/**
 * Get predictive insights
 */
export const getPredictiveInsights = async (params?: {
  insight_type?: 'enrollment_forecast' | 'revenue_forecast' | 'risk_analysis';
  time_horizon?: 'short_term' | 'medium_term' | 'long_term';
}) => {
  const response = await apiClient.get('/analytics/predictive/', { params });
  return response.data;
};

/**
 * Get key performance indicators (KPIs)
 */
export const getKPIs = async (params?: {
  category?: 'academic' | 'operational' | 'financial';
  period?: 'current_month' | 'current_quarter' | 'current_year';
}) => {
  const response = await apiClient.get('/analytics/kpis/', { params });
  return response.data;
};

/**
 * Get alerts and notifications
 */
export const getAnalyticsAlerts = async (params?: {
  severity?: 'info' | 'warning' | 'critical';
  module?: string;
  is_read?: boolean;
}) => {
  const response = await apiClient.get('/analytics/alerts/', { params });
  return response.data;
};

/**
 * Create custom report
 */
export const createCustomReport = async (data: {
  name: string;
  description?: string;
  report_type: string;
  filters: object;
  columns: string[];
  is_public?: boolean;
}) => {
  const response = await apiClient.post('/analytics/custom-reports/', data);
  return response.data;
};

/**
 * Get custom reports list
 */
export const getCustomReports = async (params?: {
  report_type?: string;
  is_public?: boolean;
  created_by?: number;
}) => {
  const response = await apiClient.get('/analytics/custom-reports/', { params });
  return response.data;
};

/**
 * Run custom report
 */
export const runCustomReport = async (reportId: number, params?: object) => {
  const response = await apiClient.post(`/analytics/custom-reports/${reportId}/run/`, params);
  return response.data;
};

/**
 * Update custom report
 */
export const updateCustomReport = async (reportId: number, data: Partial<CustomReport>) => {
  const response = await apiClient.patch(`/analytics/custom-reports/${reportId}/`, data);
  return response.data;
};

/**
 * Delete custom report
 */
export const deleteCustomReport = async (reportId: number) => {
  const response = await apiClient.delete(`/analytics/custom-reports/${reportId}/`);
  return response.data;
};

/**
 * Export report data
 */
export const exportReport = async (params: {
  report_type: string;
  format: 'csv' | 'excel' | 'pdf' | 'json';
  data?: any[];
  filters?: object;
}) => {
  const response = await apiClient.post('/analytics/export/', params, {
    responseType: params.format !== 'json' ? 'blob' : 'json',
  });
  return response.data;
};

/**
 * Schedule automated report
 */
export const scheduleAutomatedReport = async (data: {
  report_id: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'csv' | 'excel' | 'pdf';
  start_date: string;
  end_date?: string;
}) => {
  const response = await apiClient.post('/analytics/scheduled-reports/', data);
  return response.data;
};

/**
 * Get scheduled reports
 */
export const getScheduledReports = async (params?: {
  status?: 'active' | 'paused' | 'completed';
}) => {
  const response = await apiClient.get('/analytics/scheduled-reports/', { params });
  return response.data;
};

/**
 * Generate executive summary report
 */
export const generateExecutiveSummary = async (params?: {
  period: 'monthly' | 'quarterly' | 'annual';
  include_charts?: boolean;
  sections?: string[];
}) => {
  const response = await apiClient.get('/analytics/executive-summary/', { params });
  return response.data;
};

/**
 * Get data visualization config
 */
export const getVisualizationConfig = async (chartType: string, dataSource: string) => {
  const response = await apiClient.get(`/analytics/visualization/${chartType}/${dataSource}/`);
  return response.data;
};

/**
 * Refresh analytics cache
 */
export const refreshAnalyticsCache = async () => {
  const response = await apiClient.post('/analytics/refresh-cache/');
  return response.data;
};

/**
 * Get report execution history
 */
export const getReportHistory = async (params?: {
  report_id?: number;
  date_from?: string;
  date_to?: string;
  limit?: number;
}) => {
  const response = await apiClient.get('/analytics/report-history/', { params });
  return response.data;
};
