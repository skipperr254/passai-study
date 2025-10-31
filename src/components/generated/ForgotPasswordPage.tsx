"use client";

import React, { useState } from 'react';
import { Book, Mail, ArrowLeft, AlertCircle, CheckCircle2, Send } from 'lucide-react';
export interface ForgotPasswordPageProps {
  onBackToSignIn?: () => void;
  onBackToLanding?: () => void;
}
export const ForgotPasswordPage = ({
  onBackToSignIn,
  onBackToLanding
}: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
    return '';
  };
  const handleBlur = () => {
    setTouched(true);
    const validationError = validateEmail(email);
    setError(validationError);
  };
  const handleChange = (value: string) => {
    setEmail(value);
    if (touched) {
      const validationError = validateEmail(value);
      setError(validationError);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };
  if (isSubmitted) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <button onClick={onBackToSignIn} className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Sign In</span>
          </button>
        </header>

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-md">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/25 mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Check Your Email</h1>
              <p className="text-sm sm:text-base text-slate-600">
                We've sent password reset instructions to
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Check your inbox</h3>
                    <p className="text-sm text-slate-600">
                      Look for an email from Passia with the subject "Reset Your Password"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Click the reset link</h3>
                    <p className="text-sm text-slate-600">
                      The link is valid for 24 hours. Click it to create a new password.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Create new password</h3>
                    <p className="text-sm text-slate-600">
                      Choose a strong password and sign in with your new credentials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Didn't receive the email?</span> Check your spam folder or{' '}
                  <button onClick={() => setIsSubmitted(false)} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    try again
                  </button>
                </p>
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="mt-6 text-center">
              <button onClick={onBackToSignIn} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @supports (backdrop-filter: blur(10px)) {
            .backdrop-blur-xl { backdrop-filter: blur(20px); }
          }
        `}</style>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <button onClick={onBackToSignIn} className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Sign In</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/25 mx-auto mb-4 sm:mb-6">
              <Book className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input id="email" type="email" value={email} onChange={e => handleChange(e.target.value)} onBlur={handleBlur} className={`w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${error && touched ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`} placeholder="you@example.com" disabled={isLoading} />
                </div>
                {error && touched && <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{error}</p>
                  </div>}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-slate-700">
                  <span className="font-semibold">Note:</span> The password reset link will be valid for 24 hours.
                  If you don't receive an email, please check your spam folder.
                </p>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoading} className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </> : <>
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{' '}
                <button onClick={onBackToSignIn} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Need help?{' '}
              <a href="mailto:support@passia.study" className="text-slate-700 hover:text-slate-900 font-medium underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};
export default ForgotPasswordPage;