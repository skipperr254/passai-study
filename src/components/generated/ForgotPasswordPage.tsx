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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col" data-magicpath-id="0" data-magicpath-path="ForgotPasswordPage.tsx">
        {/* Header */}
        <header className="p-4 sm:p-6" data-magicpath-id="1" data-magicpath-path="ForgotPasswordPage.tsx">
          <button onClick={onBackToSignIn} className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" data-magicpath-id="2" data-magicpath-path="ForgotPasswordPage.tsx">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" data-magicpath-id="3" data-magicpath-path="ForgotPasswordPage.tsx" />
            <span className="text-sm font-semibold" data-magicpath-id="4" data-magicpath-path="ForgotPasswordPage.tsx">Back to Sign In</span>
          </button>
        </header>

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12" data-magicpath-id="5" data-magicpath-path="ForgotPasswordPage.tsx">
          <div className="w-full max-w-md" data-magicpath-id="6" data-magicpath-path="ForgotPasswordPage.tsx">
            {/* Success Icon */}
            <div className="text-center mb-8" data-magicpath-id="7" data-magicpath-path="ForgotPasswordPage.tsx">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/25 mx-auto mb-6" data-magicpath-id="8" data-magicpath-path="ForgotPasswordPage.tsx">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" data-magicpath-id="9" data-magicpath-path="ForgotPasswordPage.tsx" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2" data-magicpath-id="10" data-magicpath-path="ForgotPasswordPage.tsx">Check Your Email</h1>
              <p className="text-sm sm:text-base text-slate-600" data-magicpath-id="11" data-magicpath-path="ForgotPasswordPage.tsx">
                We've sent password reset instructions to
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1" data-magicpath-id="12" data-magicpath-path="ForgotPasswordPage.tsx">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8" data-magicpath-id="13" data-magicpath-path="ForgotPasswordPage.tsx">
              <div className="space-y-4" data-magicpath-id="14" data-magicpath-path="ForgotPasswordPage.tsx">
                <div className="flex gap-3" data-magicpath-id="15" data-magicpath-path="ForgotPasswordPage.tsx">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="16" data-magicpath-path="ForgotPasswordPage.tsx">
                    <span className="text-sm font-bold text-blue-600" data-magicpath-id="17" data-magicpath-path="ForgotPasswordPage.tsx">1</span>
                  </div>
                  <div data-magicpath-id="18" data-magicpath-path="ForgotPasswordPage.tsx">
                    <h3 className="font-semibold text-slate-900 mb-1" data-magicpath-id="19" data-magicpath-path="ForgotPasswordPage.tsx">Check your inbox</h3>
                    <p className="text-sm text-slate-600" data-magicpath-id="20" data-magicpath-path="ForgotPasswordPage.tsx">
                      Look for an email from Passia with the subject "Reset Your Password"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3" data-magicpath-id="21" data-magicpath-path="ForgotPasswordPage.tsx">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="22" data-magicpath-path="ForgotPasswordPage.tsx">
                    <span className="text-sm font-bold text-blue-600" data-magicpath-id="23" data-magicpath-path="ForgotPasswordPage.tsx">2</span>
                  </div>
                  <div data-magicpath-id="24" data-magicpath-path="ForgotPasswordPage.tsx">
                    <h3 className="font-semibold text-slate-900 mb-1" data-magicpath-id="25" data-magicpath-path="ForgotPasswordPage.tsx">Click the reset link</h3>
                    <p className="text-sm text-slate-600" data-magicpath-id="26" data-magicpath-path="ForgotPasswordPage.tsx">
                      The link is valid for 24 hours. Click it to create a new password.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3" data-magicpath-id="27" data-magicpath-path="ForgotPasswordPage.tsx">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="28" data-magicpath-path="ForgotPasswordPage.tsx">
                    <span className="text-sm font-bold text-blue-600" data-magicpath-id="29" data-magicpath-path="ForgotPasswordPage.tsx">3</span>
                  </div>
                  <div data-magicpath-id="30" data-magicpath-path="ForgotPasswordPage.tsx">
                    <h3 className="font-semibold text-slate-900 mb-1" data-magicpath-id="31" data-magicpath-path="ForgotPasswordPage.tsx">Create new password</h3>
                    <p className="text-sm text-slate-600" data-magicpath-id="32" data-magicpath-path="ForgotPasswordPage.tsx">
                      Choose a strong password and sign in with your new credentials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100" data-magicpath-id="33" data-magicpath-path="ForgotPasswordPage.tsx">
                <p className="text-sm text-slate-700" data-magicpath-id="34" data-magicpath-path="ForgotPasswordPage.tsx">
                  <span className="font-semibold" data-magicpath-id="35" data-magicpath-path="ForgotPasswordPage.tsx">Didn't receive the email?</span> Check your spam folder or{' '}
                  <button onClick={() => setIsSubmitted(false)} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-magicpath-id="36" data-magicpath-path="ForgotPasswordPage.tsx">
                    try again
                  </button>
                </p>
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="mt-6 text-center" data-magicpath-id="37" data-magicpath-path="ForgotPasswordPage.tsx">
              <button onClick={onBackToSignIn} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-magicpath-id="38" data-magicpath-path="ForgotPasswordPage.tsx">
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>

        <style data-magicpath-id="39" data-magicpath-path="ForgotPasswordPage.tsx">{`
          @supports (backdrop-filter: blur(10px)) {
            .backdrop-blur-xl { backdrop-filter: blur(20px); }
          }
        `}</style>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col" data-magicpath-id="40" data-magicpath-path="ForgotPasswordPage.tsx">
      {/* Header */}
      <header className="p-4 sm:p-6" data-magicpath-id="41" data-magicpath-path="ForgotPasswordPage.tsx">
        <button onClick={onBackToSignIn} className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" data-magicpath-id="42" data-magicpath-path="ForgotPasswordPage.tsx">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" data-magicpath-id="43" data-magicpath-path="ForgotPasswordPage.tsx" />
          <span className="text-sm font-semibold" data-magicpath-id="44" data-magicpath-path="ForgotPasswordPage.tsx">Back to Sign In</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12" data-magicpath-id="45" data-magicpath-path="ForgotPasswordPage.tsx">
        <div className="w-full max-w-md" data-magicpath-id="46" data-magicpath-path="ForgotPasswordPage.tsx">
          {/* Logo & Title */}
          <div className="text-center mb-8" data-magicpath-id="47" data-magicpath-path="ForgotPasswordPage.tsx">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/25 mx-auto mb-4 sm:mb-6" data-magicpath-id="48" data-magicpath-path="ForgotPasswordPage.tsx">
              <Book className="w-8 h-8 sm:w-10 sm:h-10 text-white" data-magicpath-id="49" data-magicpath-path="ForgotPasswordPage.tsx" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2" data-magicpath-id="50" data-magicpath-path="ForgotPasswordPage.tsx">Reset Your Password</h1>
            <p className="text-sm sm:text-base text-slate-600" data-magicpath-id="51" data-magicpath-path="ForgotPasswordPage.tsx">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8" data-magicpath-id="52" data-magicpath-path="ForgotPasswordPage.tsx">
            <form onSubmit={handleSubmit} className="space-y-5" data-magicpath-id="53" data-magicpath-path="ForgotPasswordPage.tsx">
              {/* Email Field */}
              <div data-magicpath-id="54" data-magicpath-path="ForgotPasswordPage.tsx">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="55" data-magicpath-path="ForgotPasswordPage.tsx">
                  Email Address
                </label>
                <div className="relative" data-magicpath-id="56" data-magicpath-path="ForgotPasswordPage.tsx">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" data-magicpath-id="57" data-magicpath-path="ForgotPasswordPage.tsx" />
                  <input id="email" type="email" value={email} onChange={e => handleChange(e.target.value)} onBlur={handleBlur} className={`w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${error && touched ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`} placeholder="you@example.com" disabled={isLoading} data-magicpath-id="58" data-magicpath-path="ForgotPasswordPage.tsx" />
                </div>
                {error && touched && <div className="flex items-center gap-1.5 mt-2 text-red-600" data-magicpath-id="59" data-magicpath-path="ForgotPasswordPage.tsx">
                    <AlertCircle className="w-4 h-4" data-magicpath-id="60" data-magicpath-path="ForgotPasswordPage.tsx" />
                    <p className="text-xs font-medium" data-magicpath-id="61" data-magicpath-path="ForgotPasswordPage.tsx">{error}</p>
                  </div>}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100" data-magicpath-id="62" data-magicpath-path="ForgotPasswordPage.tsx">
                <p className="text-xs text-slate-700" data-magicpath-id="63" data-magicpath-path="ForgotPasswordPage.tsx">
                  <span className="font-semibold" data-magicpath-id="64" data-magicpath-path="ForgotPasswordPage.tsx">Note:</span> The password reset link will be valid for 24 hours.
                  If you don't receive an email, please check your spam folder.
                </p>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoading} className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-magicpath-id="65" data-magicpath-path="ForgotPasswordPage.tsx">
                {isLoading ? <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" data-magicpath-id="66" data-magicpath-path="ForgotPasswordPage.tsx" />
                    <span data-magicpath-id="67" data-magicpath-path="ForgotPasswordPage.tsx">Sending...</span>
                  </> : <>
                    <Send className="w-5 h-5" data-magicpath-id="68" data-magicpath-path="ForgotPasswordPage.tsx" />
                    <span data-magicpath-id="69" data-magicpath-path="ForgotPasswordPage.tsx">Send Reset Link</span>
                  </>}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center" data-magicpath-id="70" data-magicpath-path="ForgotPasswordPage.tsx">
              <p className="text-sm text-slate-600" data-magicpath-id="71" data-magicpath-path="ForgotPasswordPage.tsx">
                Remember your password?{' '}
                <button onClick={onBackToSignIn} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-magicpath-id="72" data-magicpath-path="ForgotPasswordPage.tsx">
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center" data-magicpath-id="73" data-magicpath-path="ForgotPasswordPage.tsx">
            <p className="text-xs text-slate-500" data-magicpath-id="74" data-magicpath-path="ForgotPasswordPage.tsx">
              Need help?{' '}
              <a href="mailto:support@passia.study" className="text-slate-700 hover:text-slate-900 font-medium underline" data-magicpath-id="75" data-magicpath-path="ForgotPasswordPage.tsx">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      <style data-magicpath-id="76" data-magicpath-path="ForgotPasswordPage.tsx">{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};
export default ForgotPasswordPage;