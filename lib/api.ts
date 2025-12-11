// API base URLs - Now using Next.js API routes
const AUTH_API = '/api/auth';
const APPOINTMENT_API = '/api/appointments';
const NOTIFICATION_API = '/api/notifications';

// Helper function for API calls
async function apiCall(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth API
export const authApi = {
  register: (userData: any) => 
    apiCall(`${AUTH_API}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: any) =>
    apiCall(`${AUTH_API}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verify: () => apiCall(`${AUTH_API}/verify`),

  logout: () =>
    apiCall(`${AUTH_API}/logout`, {
      method: 'POST',
    }),

  getDoctors: () => apiCall(`${AUTH_API}/doctors`),
};

// Appointment API
export const appointmentApi = {
  create: (appointmentData: any) =>
    apiCall(APPOINTMENT_API, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  getAll: () => apiCall(APPOINTMENT_API),

  updateStatus: (id: string, status: string) =>
    apiCall(`${APPOINTMENT_API}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  cancel: (id: string) =>
    apiCall(`${APPOINTMENT_API}/${id}`, {
      method: 'DELETE',
    }),
};

// Notification API
export const notificationApi = {
  getAll: () => apiCall(NOTIFICATION_API),

  markAsRead: (id: string) =>
    apiCall(`${NOTIFICATION_API}/${id}/read`, {
      method: 'PATCH',
    }),
};
