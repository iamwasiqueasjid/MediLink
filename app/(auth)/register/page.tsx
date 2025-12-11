'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'doctor',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register(formData);
      
      // Redirect to login after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '1.5rem', 
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '3rem',
        width: '100%',
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <img src="/logo-blue.png" alt="MediLink Logo" style={{ width: '200px', maxHeight: '60px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Join MediLink and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              padding: '0.875rem 1rem', 
              borderRadius: '0.75rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="your@email.com"
              onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="••••••••"
              minLength={6}
              onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label htmlFor="role" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              I am a
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'patient' | 'doctor' })}
              style={{ 
                width: '100%', 
                padding: '0.875rem 1rem', 
                border: '2px solid #e5e7eb', 
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'doctor' && (
            <div>
              <label htmlFor="specialization" style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                required={formData.role === 'doctor'}
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="e.g., Cardiology"
                onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              background: '#1e3a8a',
              color: '#ffffff', 
              padding: '1rem', 
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1e40af';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 58, 138, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1e3a8a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.4)';
              }
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link 
              href="/login" 
              style={{ 
                color: '#1e3a8a', 
                fontWeight: '600', 
                textDecoration: 'none'
              }}
            >
              Sign in
            </Link>
          </p>
          <Link 
            href="/" 
            style={{ 
              color: '#9ca3af', 
              textDecoration: 'none', 
              fontSize: '0.875rem',
              marginTop: '1rem',
              display: 'inline-block'
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
