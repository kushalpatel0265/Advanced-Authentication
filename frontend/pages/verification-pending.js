import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiMail, FiArrowRight } from 'react-icons/fi';

export default function VerificationPending() {
  const router = useRouter();
  const { email } = router.query;

  // Prevent access to this page directly without an email
  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <FiMail className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p className="mb-4">
              We've sent a verification code to:
            </p>
            <p className="font-medium text-gray-800 text-lg mb-4">
              {email}
            </p>
            <p className="mb-6">
              Enter the 6-digit code from your email to verify your account.
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href={`/verify-email?email=${encodeURIComponent(email)}`}
              className="group w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enter Verification Code
              <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-150" />
            </Link>
            
            <button
              onClick={() => router.push('/signup')}
              className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sign up
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or try signing up again with a different email address.
          </p>
        </div>
      </div>
    </div>
  );
}
