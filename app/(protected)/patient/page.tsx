'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authApi, appointmentApi, notificationApi } from '@/lib/api';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Verify authentication
      const authResponse = await authApi.verify();
      
      if (authResponse.user.role !== 'patient') {
        router.push('/doctor');
        return;
      }

      setUser(authResponse.user);

      // Load appointments
      const appointmentsResponse = await appointmentApi.getAll();
      setAppointments(appointmentsResponse.appointments);

      // Load doctors
      const doctorsResponse = await authApi.getDoctors();
      setDoctors(doctorsResponse.doctors);

      // Load notifications
      const notificationsResponse = await notificationApi.getAll();
      setNotifications(notificationsResponse.notifications);

      setLoading(false);
    } catch (error) {
      console.error('Load data error:', error);
      router.push('/login');
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await appointmentApi.create(bookingData);
      setShowBooking(false);
      setBookingData({ doctorId: '', doctorName: '', date: '', time: '', reason: '' });
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentApi.cancel(id);
        await loadData();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-900 font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.5rem' }}>
              Patient Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Manage your appointments</p>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            style={{ 
              padding: '0.875rem 1.75rem', 
              backgroundColor: '#1e3a8a', 
              color: '#ffffff', 
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(30, 58, 138, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a8a';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(30, 58, 138, 0.3)';
            }}
          >
            + Book Appointment
          </button>
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
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pending</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            padding: '1.75rem', 
            borderRadius: '1rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#ffffff'
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Approved</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {appointments.filter(a => a.status === 'approved').length}
            </p>
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

        {/* Appointments List */}
        <div style={{ 
          backgroundColor: '#ffffff', 
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
            Your Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
              No appointments yet. Book your first appointment!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.map((appointment: any) => (
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
                        Dr. {appointment.doctorName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        📅 {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>Reason:</span> {appointment.reason}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem' }}>
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
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          style={{
                            color: '#ef4444',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.textDecoration = 'none';
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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

      {/* Booking Modal */}
      {showBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '1rem',
            maxWidth: '28rem',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              padding: '1.5rem',
              color: '#ffffff'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Book Appointment</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
                Schedule your visit with a doctor
              </p>
            </div>
            
            <form onSubmit={handleBookAppointment} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Select Doctor
                </label>
                <select
                  required
                  value={bookingData.doctorId}
                  onChange={(e) => {
                    const doctor = doctors.find(d => d._id === e.target.value);
                    setBookingData({
                      ...bookingData,
                      doctorId: e.target.value,
                      doctorName: doctor ? doctor.name : '',
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Reason
                </label>
                <textarea
                  required
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                  rows={3}
                  placeholder="Describe your symptoms or reason for visit"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(30, 58, 138, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(30, 58, 138, 0.3)';
                  }}
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  style={{
                    flex: 1,
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
