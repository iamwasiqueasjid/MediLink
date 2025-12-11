'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const redirectPath = data.user.role === 'doctor' ? '/doctor' : '/patient';
          router.push(redirectPath);
        }
      } catch (error) {
        // User not logged in, stay on landing page
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }}>
      {/* Header */}
      <nav style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/logo-blue.png" alt="MediLink Logo" style={{ width: '150px', maxHeight: '45px', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                href="/login"
                style={{ 
                  padding: '0.5rem 1rem', 
                  color: '#1e3a8a', 
                  fontWeight: '500',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Login
              </Link>
              <Link 
                href="/register"
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  backgroundColor: '#1e3a8a', 
                  color: '#ffffff', 
                  borderRadius: '0.5rem', 
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            color: '#1e3a8a', 
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Smart Healthcare Appointment System
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563', 
            marginBottom: '3rem', 
            maxWidth: '48rem', 
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Book appointments with top doctors, manage your healthcare schedule, 
            and receive instant notifications - all in one secure platform.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link 
              href="/register"
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#1e3a8a', 
                color: '#ffffff', 
                borderRadius: '0.5rem', 
                fontWeight: '600', 
                fontSize: '1.125rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
            >
              Get Started
            </Link>
            <Link 
              href="/login"
              style={{ 
                padding: '1rem 2rem', 
                border: '2px solid #1e3a8a', 
                color: '#1e3a8a', 
                borderRadius: '0.5rem', 
                fontWeight: '600', 
                fontSize: '1.125rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                display: 'inline-block',
                backgroundColor: 'transparent'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features */}
        <div style={{ 
          marginTop: '6rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}></div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e3a8a', 
              marginBottom: '0.75rem' 
            }}>Easy Booking</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Schedule appointments with qualified doctors in just a few clicks.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}></div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e3a8a', 
              marginBottom: '0.75rem' 
            }}>Real-time Updates</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Get instant notifications when your appointments are approved or updated.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}></div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e3a8a', 
              marginBottom: '0.75rem' 
            }}>Secure & Private</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Your health data is protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
