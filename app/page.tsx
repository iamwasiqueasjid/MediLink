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
            border: '2px solid #1E3A8A',
            boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)' 
          }}>
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
            border: '2px solid #1E3A8A',
            boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)' 
          }}>
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
            border: '2px solid #1E3A8A',
            boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)' 
          }}>
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

      {/* How It Works Section */}
      <div style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1e3a8a', 
              marginBottom: '1rem' 
            }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Get started with MediLink in three simple steps
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '3rem',
            marginTop: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1e3a8a'
              }}>1</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>
                Create Account
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Sign up as a patient or register as a doctor. Complete your profile with necessary details.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1e3a8a'
              }}>2</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>
                Book Appointment
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Browse available doctors, select your preferred time slot, and book your appointment instantly.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1e3a8a'
              }}>3</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>
                Get Notified
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Receive real-time notifications about your appointment status and reminders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{ backgroundColor: '#f9fafb', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1e3a8a', 
                marginBottom: '1.5rem' 
              }}>
                Why Choose MediLink?
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.8' }}>
                Experience healthcare management like never before with our comprehensive platform designed for both patients and healthcare providers.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '0.25rem'
                  }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                      24/7 Availability
                    </h4>
                    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                      Access the platform anytime, anywhere to manage your healthcare needs.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '0.25rem'
                  }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                      Verified Doctors
                    </h4>
                    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                      All doctors on our platform are verified professionals with proven credentials.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '0.25rem'
                  }}></div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>
                      Smart Notifications
                    </h4>
                    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                      Stay informed with instant updates about your appointments and health reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#dbeafe', 
              borderRadius: '1rem', 
              padding: '3rem',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏥</div>
                <p style={{ fontSize: '1.25rem', color: '#1e3a8a', fontWeight: '600' }}>
                  Your Health, Our Priority
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '3rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1000+</div>
              <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Verified Doctors</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>50k+</div>
              <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Happy Patients</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>100k+</div>
              <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Appointments Booked</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>24/7</div>
              <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: '#ffffff', padding: '3rem 0 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <img src="/logo-blue.png" alt="MediLink Logo" style={{ width: '150px', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
              <p style={{ color: '#9ca3af', lineHeight: '1.6', marginTop: '1rem' }}>
                Connecting patients with healthcare providers for a healthier tomorrow. Your trusted platform for medical appointments.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/login" style={{ color: '#9ca3af', textDecoration: 'none' }}>Login</Link>
                <Link href="/register" style={{ color: '#9ca3af', textDecoration: 'none' }}>Register</Link>
                <a href="#features" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a>
                <a href="#how-it-works" style={{ color: '#9ca3af', textDecoration: 'none' }}>How It Works</a>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Help Center</a>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact Us</a>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#9ca3af' }}>
                <p>Email: support@medilink.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Park Road, Islamabad, Pakistan</p>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid #374151', 
            paddingTop: '1.5rem', 
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>© 2025 MediLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
