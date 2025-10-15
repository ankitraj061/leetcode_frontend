'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/app/slices/authSlice';
import { checkAuth } from '@/app/slices/authSlice';



export default function LoginPageContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    emailId: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  
  
    useEffect(() => {
      if (isInitialized && isAuthenticated) {
        router.push('/');
      }
    }, [isAuthenticated, isInitialized, router]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleLogin = () => {
    // Redirect to your Google OAuth endpoint
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const credentials = {
        emailId: formData.emailId,
        password: formData.password,
      };

      const result = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful
        router.push('/');
      } else if (loginUser.rejected.match(result)) {
        // Handle login error
        setFormError(result.payload?.error || 'Login failed');
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">TC</span>
          </div>
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="mt-2 text-secondary">Sign in to your TrueCode account</p>
        </div>

        {/* Success Message from Signup */}
        {searchParams.get('signup') === 'success' && (
          <div className="mb-6 p-4 bg-success-light border border-success rounded-lg">
            <p className="text-success font-medium text-center">
              Account created successfully! Please sign in.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="bg-elevated rounded-xl shadow-lg p-8">
          
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full btn-secondary mb-6 flex items-center justify-center space-x-3 py-3 hover:shadow-md transition-all"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-primary font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-primary"></div>
            <span className="mx-4 text-tertiary text-sm font-medium">or</span>
            <div className="flex-1 border-t border-primary"></div>
          </div>

          {/* Error Messages
          {(error || formError) && (
            <div className="mb-4 p-3 bg-error-light border border-error rounded-lg">
              <p className="text-error text-sm">{formError || error}</p>
            </div>
          )} */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="emailId" className="block text-sm font-medium text-primary mb-1">
                Email Address
              </label>
              <input
                id="emailId"
                name="emailId"
                type="email"
                required
                value={formData.emailId}
                onChange={handleInputChange}
                className="input"
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand focus:ring-brand border-border-primary rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-brand hover:text-brand-hover font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              Don't have an account?{' '}
              <Link href="/accounts/signup" className="text-brand hover:text-brand-hover font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

