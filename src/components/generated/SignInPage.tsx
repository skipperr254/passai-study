import React, { useState } from 'react';
import { Book, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
export interface SignInPageProps {
  onSignIn?: (data: {
    email: string;
    password: string;
  }) => void;
  onBackToLanding?: () => void;
  onGoToSignUp?: () => void;
  onForgotPassword?: () => void;
  serverError?: string | null;
  isLoading?: boolean;
}
export const SignInPage = ({
  onSignIn,
  onBackToLanding,
  onGoToSignUp,
  onForgotPassword,
  serverError,
  isLoading: isLoadingProp
}: SignInPageProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      default:
        return '';
    }
  };
  const handleBlur = (field: string) => {
    setTouched({
      ...touched,
      [field]: true
    });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({
      ...errors,
      [field]: error
    });
  };
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({
        ...errors,
        [field]: error
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        email: true,
        password: true
      });
      return;
    }
    onSignIn?.({
      email: formData.email,
      password: formData.password
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col" data-magicpath-id="0" data-magicpath-path="SignInPage.tsx">
      {/* Header */}
      <header className="p-4 sm:p-6" data-magicpath-id="1" data-magicpath-path="SignInPage.tsx">
        <button onClick={onBackToLanding} className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" data-magicpath-id="2" data-magicpath-path="SignInPage.tsx">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" data-magicpath-id="3" data-magicpath-path="SignInPage.tsx" />
          <span className="text-sm font-semibold" data-magicpath-id="4" data-magicpath-path="SignInPage.tsx">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12" data-magicpath-id="5" data-magicpath-path="SignInPage.tsx">
        <div className="w-full max-w-md" data-magicpath-id="6" data-magicpath-path="SignInPage.tsx">
          {/* Logo & Title */}
          <div className="text-center mb-8" data-magicpath-id="7" data-magicpath-path="SignInPage.tsx">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/25 mx-auto mb-4 sm:mb-6" data-magicpath-id="8" data-magicpath-path="SignInPage.tsx">
              <Book className="w-8 h-8 sm:w-10 sm:h-10 text-white" data-magicpath-id="9" data-magicpath-path="SignInPage.tsx" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2" data-magicpath-id="10" data-magicpath-path="SignInPage.tsx">Welcome Back</h1>
            <p className="text-sm sm:text-base text-slate-600" data-magicpath-id="11" data-magicpath-path="SignInPage.tsx">Sign in to continue your learning journey</p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8" data-magicpath-id="12" data-magicpath-path="SignInPage.tsx">
            <form onSubmit={handleSubmit} className="space-y-5" data-magicpath-id="13" data-magicpath-path="SignInPage.tsx">
              {/* Server Error Alert */}
              {serverError && <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3" data-magicpath-id="14" data-magicpath-path="SignInPage.tsx">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" data-magicpath-id="15" data-magicpath-path="SignInPage.tsx" />
                  <div className="flex-1" data-magicpath-id="16" data-magicpath-path="SignInPage.tsx">
                    <p className="text-sm font-semibold text-red-900 mb-1" data-magicpath-id="17" data-magicpath-path="SignInPage.tsx">Authentication Failed</p>
                    <p className="text-xs text-red-700" data-magicpath-id="18" data-magicpath-path="SignInPage.tsx">{serverError}</p>
                  </div>
                </div>}

              {/* Email Field */}
              <div data-magicpath-id="19" data-magicpath-path="SignInPage.tsx">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="20" data-magicpath-path="SignInPage.tsx">
                  Email Address
                </label>
                <div className="relative" data-magicpath-id="21" data-magicpath-path="SignInPage.tsx">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" data-magicpath-id="22" data-magicpath-path="SignInPage.tsx" />
                  <input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} className={`w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.email && touched.email ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`} placeholder="you@example.com" data-magicpath-id="23" data-magicpath-path="SignInPage.tsx" />
                </div>
                {errors.email && touched.email && <div className="flex items-center gap-1.5 mt-2 text-red-600" data-magicpath-id="24" data-magicpath-path="SignInPage.tsx">
                    <AlertCircle className="w-4 h-4" data-magicpath-id="25" data-magicpath-path="SignInPage.tsx" />
                    <p className="text-xs font-medium" data-magicpath-id="26" data-magicpath-path="SignInPage.tsx">{errors.email}</p>
                  </div>}
              </div>

              {/* Password Field */}
              <div data-magicpath-id="27" data-magicpath-path="SignInPage.tsx">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2" data-magicpath-id="28" data-magicpath-path="SignInPage.tsx">
                  Password
                </label>
                <div className="relative" data-magicpath-id="29" data-magicpath-path="SignInPage.tsx">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" data-magicpath-id="30" data-magicpath-path="SignInPage.tsx" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => handleChange('password', e.target.value)} onBlur={() => handleBlur('password')} className={`w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.password && touched.password ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`} placeholder="••••••••" data-magicpath-id="31" data-magicpath-path="SignInPage.tsx" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" data-magicpath-id="32" data-magicpath-path="SignInPage.tsx">
                    {showPassword ? <EyeOff className="w-5 h-5" data-magicpath-id="33" data-magicpath-path="SignInPage.tsx" /> : <Eye className="w-5 h-5" data-magicpath-id="34" data-magicpath-path="SignInPage.tsx" />}
                  </button>
                </div>
                {errors.password && touched.password && <div className="flex items-center gap-1.5 mt-2 text-red-600" data-magicpath-id="35" data-magicpath-path="SignInPage.tsx">
                    <AlertCircle className="w-4 h-4" data-magicpath-id="36" data-magicpath-path="SignInPage.tsx" />
                    <p className="text-xs font-medium" data-magicpath-id="37" data-magicpath-path="SignInPage.tsx">{errors.password}</p>
                  </div>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between" data-magicpath-id="38" data-magicpath-path="SignInPage.tsx">
                <label className="flex items-center gap-2 cursor-pointer group" data-magicpath-id="39" data-magicpath-path="SignInPage.tsx">
                  <div className="relative" data-magicpath-id="40" data-magicpath-path="SignInPage.tsx">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="sr-only peer" data-magicpath-id="41" data-magicpath-path="SignInPage.tsx" />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-gradient-to-br peer-checked:from-blue-600 peer-checked:to-indigo-600 peer-checked:border-blue-600 transition-all group-hover:border-blue-400" data-magicpath-id="42" data-magicpath-path="SignInPage.tsx"></div>
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 12 12" fill="none" data-magicpath-id="43" data-magicpath-path="SignInPage.tsx">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-magicpath-id="44" data-magicpath-path="SignInPage.tsx" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors" data-magicpath-id="45" data-magicpath-path="SignInPage.tsx">
                    Remember me
                  </span>
                </label>
                <button type="button" onClick={onForgotPassword} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-magicpath-id="46" data-magicpath-path="SignInPage.tsx">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoadingProp} className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-magicpath-id="47" data-magicpath-path="SignInPage.tsx">
                {isLoadingProp ? <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" data-magicpath-id="48" data-magicpath-path="SignInPage.tsx" />
                    <span data-magicpath-id="49" data-magicpath-path="SignInPage.tsx">Signing In...</span>
                  </> : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6" data-magicpath-id="50" data-magicpath-path="SignInPage.tsx">
              <div className="absolute inset-0 flex items-center" data-magicpath-id="51" data-magicpath-path="SignInPage.tsx">
                <div className="w-full border-t border-slate-200" data-magicpath-id="52" data-magicpath-path="SignInPage.tsx"></div>
              </div>
              <div className="relative flex justify-center text-xs" data-magicpath-id="53" data-magicpath-path="SignInPage.tsx">
                <span className="px-4 bg-white text-slate-500 font-medium" data-magicpath-id="54" data-magicpath-path="SignInPage.tsx">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3" data-magicpath-id="55" data-magicpath-path="SignInPage.tsx">
              <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all active:scale-95" data-magicpath-id="56" data-magicpath-path="SignInPage.tsx">
                <svg className="w-5 h-5" viewBox="0 0 24 24" data-magicpath-id="57" data-magicpath-path="SignInPage.tsx">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" data-magicpath-id="58" data-magicpath-path="SignInPage.tsx" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" data-magicpath-id="59" data-magicpath-path="SignInPage.tsx" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" data-magicpath-id="60" data-magicpath-path="SignInPage.tsx" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" data-magicpath-id="61" data-magicpath-path="SignInPage.tsx" />
                </svg>
                <span className="text-sm font-semibold text-slate-700" data-magicpath-id="62" data-magicpath-path="SignInPage.tsx">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all active:scale-95" data-magicpath-id="63" data-magicpath-path="SignInPage.tsx">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" data-magicpath-id="64" data-magicpath-path="SignInPage.tsx">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-magicpath-id="65" data-magicpath-path="SignInPage.tsx" />
                </svg>
                <span className="text-sm font-semibold text-slate-700" data-magicpath-id="66" data-magicpath-path="SignInPage.tsx">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center" data-magicpath-id="67" data-magicpath-path="SignInPage.tsx">
              <p className="text-sm text-slate-600" data-magicpath-id="68" data-magicpath-path="SignInPage.tsx">
                Don't have an account?{' '}
                <button onClick={onGoToSignUp} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-magicpath-id="69" data-magicpath-path="SignInPage.tsx">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style data-magicpath-id="70" data-magicpath-path="SignInPage.tsx">{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>;
};