'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authApi, appointmentApi, notificationApi } from '@/lib/api';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Verify authentication
      const authResponse = await authApi.verify();
      
      if (authResponse.user.role !== 'doctor') {
        router.push('/patient');
        return;
      }

      setUser(authResponse.user);

      // Load appointments
      const appointmentsResponse = await appointmentApi.getAll();
      setAppointments(appointmentsResponse.appointments);

      // Load notifications
      const notificationsResponse = await notificationApi.getAll();
      setNotifications(notificationsResponse.notifications);

      setLoading(false);
    } catch (error) {
      console.error('Load data error:', error);
      router.push('/login');
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: 'approved' | 'rejected') => {
    try {
      await appointmentApi.updateStatus(appointmentId, status);
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-900 font-semibold">Loading...</div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const upcomingAppointments = appointments.filter(a => a.status === 'approved');

  return (
    <DashboardLayout user={user}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '2rem',
          borderRadius: '1rem',
          color: '#ffffff',
          boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.3)'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Doctor Dashboard
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Manage your appointments and schedule</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '1.75rem', 
            borderRadius: '1rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Appointments</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{appointments.length}</p>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            padding: '1.75rem', 
            borderRadius: '1rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pending Review</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{pendingAppointments.length}</p>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            padding: '1.75rem', 
            borderRadius: '1rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Upcoming</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{upcomingAppointments.length}</p>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            padding: '1.75rem', 
            borderRadius: '1rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Notifications</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {notifications.filter(n => !n.read).length}
            </p>
          </div>
        </div>

        {/* Pending Appointments */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1e3a8a', 
            marginBottom: '1.5rem',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '0.75rem'
          }}>
            Pending Appointments ({pendingAppointments.length})
          </h2>
          
          {pendingAppointments.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              No pending appointments
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingAppointments.map((appointment: any) => (
                <div 
                  key={appointment._id} 
                  style={{ 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '0.75rem', 
                    padding: '1.5rem',
                    background: '#fefefe',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '1.125rem' }}>
                        {appointment.patientName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        📅 {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>Reason:</span> {appointment.reason}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Requested: {new Date(appointment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '1rem' }}>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'approved')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                          color: '#ffffff',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'rejected')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                          color: '#ffffff',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1e3a8a', 
            marginBottom: '1.5rem',
            borderBottom: '3px solid #10b981',
            paddingBottom: '0.75rem'
          }}>
            Upcoming Appointments ({upcomingAppointments.length})
          </h2>
          
          {upcomingAppointments.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              No upcoming appointments
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingAppointments.map((appointment: any) => (
                <div 
                  key={appointment._id} 
                  style={{ 
                    border: '2px solid #10b981', 
                    borderRadius: '0.75rem', 
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '1.125rem' }}>
                        {appointment.patientName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#047857', marginTop: '0.5rem', fontWeight: '500' }}>
                        📅 {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#065f46', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>Reason:</span> {appointment.reason}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                    }}>
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Appointments */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1e3a8a', 
            marginBottom: '1.5rem',
            borderBottom: '3px solid #6366f1',
            paddingBottom: '0.75rem'
          }}>
            All Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              No appointments yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {appointments.map((appointment: any) => (
                <div 
                  key={appointment._id} 
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.75rem', 
                    padding: '1rem',
                    background: '#fafafa',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '1rem' }}>
                        {appointment.patientName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      ...(appointment.status === 'pending' ? {
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        color: '#ffffff'
                      } : appointment.status === 'approved' ? {
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        color: '#ffffff'
                      } : appointment.status === 'rejected' ? {
                        background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                        color: '#ffffff'
                      } : {
                        background: '#e5e7eb',
                        color: '#374151'
                      })
                    }}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1e3a8a', 
            marginBottom: '1.5rem',
            borderBottom: '3px solid #8b5cf6',
            paddingBottom: '0.75rem'
          }}>
            Recent Notifications
          </h2>
          
          {notifications.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem 0' }}>
              No notifications
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.slice(0, 5).map((notification: any) => (
                <div 
                  key={notification._id} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '0.75rem',
                    background: notification.read 
                      ? '#f9fafb' 
                      : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: notification.read ? '1px solid #e5e7eb' : '1px solid #3b82f6',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: notification.read ? '400' : '600' }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
