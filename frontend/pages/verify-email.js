import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = router.query;
  const { setUser, api } = useAuth();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  // Check if email is already verified when the component mounts
  useEffect(() => {
    if (email) {
      checkVerificationStatus();
    }
  }, [email]);

  const checkVerificationStatus = async () => {
    try {
      const { data } = await api.get(`/api/auth/check-verification?email=${email}`);
      
      if (data.success && data.isVerified) {
        toast.success('Email is already verified');
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log('Verification check error:', error.message);
    }
  };

  const handleInput = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newCode = [...verificationCode];
    
    pastedData.forEach((value, index) => {
      if (index < 6 && /^\d$/.test(value)) {
        newCode[index] = value;
      }
    });
    
    setVerificationCode(newCode);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex].focus();
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post('/api/auth/verify-email', {
        code,
        email
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Verification failed');
      }
      
      setVerificationStatus('success');
      setMessage('Email verified successfully! Redirecting to dashboard...');
      
      // Update user state and redirect
      setUser(data.user);
      toast.success('Email verification successful!');
      
      // Redirect to dashboard
      router.replace('/dashboard');

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      
      if (errorMessage.includes('already verified')) {
        toast.success('Email is already verified');
        router.replace('/dashboard');
        return;
      }

      setVerificationStatus('error');
      setMessage(errorMessage);
      toast.error(errorMessage);
      setVerificationCode(['', '', '', '', '', '']); // Clear all inputs
      inputRefs.current[0].focus(); // Focus first input
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no email is provided, redirect to signup
  useEffect(() => {
    if (router.isReady && !email) {
      router.replace('/signup');
    }
  }, [router.isReady, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {verificationStatus === 'success' && (
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          )}
          {verificationStatus === 'error' && (
            <FiXCircle className="mx-auto h-12 w-12 text-red-500" />
          )}
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to
            <span className="font-medium text-gray-900 block mt-1">{email}</span>
          </p>
          
          {verificationStatus !== 'success' && (
            <form onSubmit={handleVerification} className="mt-8 space-y-6">
              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isSubmitting}
                    className="w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                    style={{ aspectRatio: '1' }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || verificationCode.some(digit => digit === '')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Add resend code functionality
                    toast.success('New verification code sent!');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Resend
                </button>
              </div>
            </form>
          )}
          
          {message && (
            <p className={`mt-2 text-center text-sm ${
              verificationStatus === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}

          {verificationStatus === 'error' && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setVerificationStatus('pending');
                  setMessage('');
                  setVerificationCode(['', '', '', '', '', '']);
                  inputRefs.current[0].focus();
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Try Again
              </button>
              <p className="text-sm text-gray-500">or</p>
              <button
                onClick={() => router.push('/signup')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Go Back to Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
