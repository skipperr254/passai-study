import React from 'react';
import { Book, Brain, TrendingUp, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
export interface LandingPageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}
export const LandingPage = ({
  onGetStarted,
  onSignIn
}: LandingPageProps) => {
  const features = [{
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Intelligent quiz generation that adapts to your learning style',
    gradient: 'from-blue-500 to-blue-600'
  }, {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your improvement with detailed analytics and insights',
    gradient: 'from-purple-500 to-purple-600'
  }, {
    icon: Award,
    title: 'Achieve Goals',
    description: 'Set milestones and celebrate your learning achievements',
    gradient: 'from-green-500 to-green-600'
  }];
  const benefits = ['Personalized study plans tailored to your needs', 'Instant feedback on quiz performance', 'Beautiful progress visualizations', 'Track multiple subjects effortlessly', 'Study reminders and smart scheduling', 'Proven exam preparation methods'];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Book className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">PassAI</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">Intelligent Study Platform</p>
              </div>
            </div>
            <button onClick={onSignIn} className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">AI-Powered Study Platform</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Master Your Exams
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-transparent bg-clip-text">
                With Confidence
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your study routine with intelligent quizzes, personalized learning paths, 
              and real-time progress tracking. Pass your exams with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <button onClick={onGetStarted} className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg">Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onSignIn} className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl sm:rounded-2xl hover:border-blue-400 hover:bg-slate-50 transition-all active:scale-95">
                <span className="text-base sm:text-lg">I Have an Account</span>
              </button>
            </div>

            {/* Trust Badge */}
            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 font-medium">
              No credit card required • Free forever • Start in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to help you learn smarter, not harder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] sm:hover:scale-105">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4 sm:mb-6`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - Benefits List */}
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Why Students Love PassAI
              </h3>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
                Join thousands of students who are already acing their exams with our proven study system.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-medium flex-1">
                      {benefit}
                    </p>
                  </div>)}
              </div>
            </div>

            {/* Right Column - Visual Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-2xl">
                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-bold">Success Rate</span>
                  </div>
                  <div className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 sm:mb-3">96%</div>
                  <p className="text-base sm:text-lg text-blue-100 font-medium">
                    of students improve their grades within the first month
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">50K+</div>
                    <p className="text-xs sm:text-sm text-blue-100">Active Students</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">1M+</div>
                    <p className="text-xs sm:text-sm text-blue-100">Quizzes Taken</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
            Ready to Transform Your Learning?
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10">
            Join PassAI today and start your journey to exam success
          </p>
          <button onClick={onGetStarted} className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 inline-flex items-center gap-3">
            <span>Start Learning Now</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            © 2024 PassAI. Made with ❤️ for students worldwide.
          </p>
        </div>
      </footer>

      <style>{`
        .safe-top { padding-top: env(safe-area-inset-top); }
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
          .backdrop-blur-sm { backdrop-filter: blur(10px); }
        }
      `}</style>
    </div>;
};