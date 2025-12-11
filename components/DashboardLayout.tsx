'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
    specialization?: string;
  };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{ 
        backgroundColor: '#1e3a8a', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/logo-white.png" alt="MediLink Logo" style={{ width: '170px', maxHeight: '50px', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                textAlign: 'right',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem'
              }}>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                  {user.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#e0e7ff', textTransform: 'capitalize' }}>
                  {user.role} {user.specialization && `• ${user.specialization}`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{ 
                  padding: '0.625rem 1.25rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#1e3a8a',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </div>
    </div>
  );
}
