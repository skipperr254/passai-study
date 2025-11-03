import React, { useState } from 'react';
import {
  Book,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
export interface SignUpPageProps {
  onSignUp?: (data: { name: string; email: string; password: string }) => void;
  onBackToLanding?: () => void;
  onGoToSignIn?: () => void;
  serverError?: string | null;
  isLoading?: boolean;
}
export const SignUpPage = ({
  onSignUp,
  onBackToLanding,
  onGoToSignIn,
  serverError,
  isLoading: isLoadingProp,
}: SignUpPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain a lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain an uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };
  const handleBlur = (field: string) => {
    setTouched({
      ...touched,
      [field]: true,
    });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({
      ...errors,
      [field]: error,
    });
  };
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({
        ...errors,
        [field]: error,
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
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }
    onSignUp?.({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };
  const passwordStrength = () => {
    const password = formData.password;
    if (!password)
      return {
        strength: 0,
        label: '',
        color: '',
      };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    if (strength <= 2)
      return {
        strength: 33,
        label: 'Weak',
        color: 'bg-red-500',
      };
    if (strength <= 3)
      return {
        strength: 66,
        label: 'Medium',
        color: 'bg-amber-500',
      };
    return {
      strength: 100,
      label: 'Strong',
      color: 'bg-green-500',
    };
  };
  const strength = passwordStrength();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <button
          onClick={onBackToLanding}
          className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back</span>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Start your journey to exam success
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.name && touched.name ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && touched.name && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.email && touched.email ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{errors.email}</p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.password && touched.password ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">Password Strength</span>
                      <span
                        className={`text-xs font-bold ${strength.label === 'Weak' ? 'text-red-600' : strength.label === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{
                          width: `${strength.strength}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && touched.password && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{errors.password}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} outline-none`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  !errors.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <p className="text-xs font-medium">Passwords match</p>
                    </div>
                  )}
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">{errors.confirmPassword}</p>
                  </div>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{serverError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingProp}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingProp ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <button
                  onClick={onGoToSignIn}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Terms & Privacy */}
          <p className="text-xs text-center text-slate-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
        }
      `}</style>
    </div>
  );
};
