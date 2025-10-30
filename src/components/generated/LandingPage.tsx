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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" data-magicpath-id="0" data-magicpath-path="LandingPage.tsx">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 safe-top" data-magicpath-id="1" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4" data-magicpath-id="2" data-magicpath-path="LandingPage.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="3" data-magicpath-path="LandingPage.tsx">
            <div className="flex items-center gap-3" data-magicpath-id="4" data-magicpath-path="LandingPage.tsx">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20" data-magicpath-id="5" data-magicpath-path="LandingPage.tsx">
                <Book className="w-5 h-5 sm:w-7 sm:h-7 text-white" data-magicpath-id="6" data-magicpath-path="LandingPage.tsx" />
              </div>
              <div data-magicpath-id="7" data-magicpath-path="LandingPage.tsx">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight" data-magicpath-id="8" data-magicpath-path="LandingPage.tsx">PassAI</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block" data-magicpath-id="9" data-magicpath-path="LandingPage.tsx">Intelligent Study Platform</p>
              </div>
            </div>
            <button onClick={onSignIn} className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95" data-magicpath-id="10" data-magicpath-path="LandingPage.tsx">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6" data-magicpath-id="11" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="12" data-magicpath-path="LandingPage.tsx">
          <div className="text-center max-w-4xl mx-auto" data-magicpath-id="13" data-magicpath-path="LandingPage.tsx">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6 sm:mb-8" data-magicpath-id="14" data-magicpath-path="LandingPage.tsx">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700" data-magicpath-id="15" data-magicpath-path="LandingPage.tsx">AI-Powered Study Platform</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight" data-magicpath-id="16" data-magicpath-path="LandingPage.tsx">
              Master Your Exams
              <br data-magicpath-id="17" data-magicpath-path="LandingPage.tsx" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-transparent bg-clip-text" data-magicpath-id="18" data-magicpath-path="LandingPage.tsx">
                With Confidence
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed" data-magicpath-id="19" data-magicpath-path="LandingPage.tsx">
              Transform your study routine with intelligent quizzes, personalized learning paths, 
              and real-time progress tracking. Pass your exams with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center" data-magicpath-id="20" data-magicpath-path="LandingPage.tsx">
              <button onClick={onGetStarted} className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-2" data-magicpath-id="21" data-magicpath-path="LandingPage.tsx">
                <span className="text-base sm:text-lg" data-magicpath-id="22" data-magicpath-path="LandingPage.tsx">Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" data-magicpath-id="23" data-magicpath-path="LandingPage.tsx" />
              </button>
              <button onClick={onSignIn} className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl sm:rounded-2xl hover:border-blue-400 hover:bg-slate-50 transition-all active:scale-95" data-magicpath-id="24" data-magicpath-path="LandingPage.tsx">
                <span className="text-base sm:text-lg" data-magicpath-id="25" data-magicpath-path="LandingPage.tsx">I Have an Account</span>
              </button>
            </div>

            {/* Trust Badge */}
            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 font-medium" data-magicpath-id="26" data-magicpath-path="LandingPage.tsx">
              No credit card required • Free forever • Start in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6" data-magicpath-id="27" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="28" data-magicpath-path="LandingPage.tsx">
          <div className="text-center mb-10 sm:mb-16" data-magicpath-id="29" data-magicpath-path="LandingPage.tsx">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4" data-magicpath-id="30" data-magicpath-path="LandingPage.tsx">
              Everything You Need to Succeed
            </h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto" data-magicpath-id="31" data-magicpath-path="LandingPage.tsx">
              Powerful features designed to help you learn smarter, not harder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" data-magicpath-id="32" data-magicpath-path="LandingPage.tsx">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] sm:hover:scale-105" data-magicpath-id="33" data-magicpath-path="LandingPage.tsx">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4 sm:mb-6`} data-magicpath-id="34" data-magicpath-path="LandingPage.tsx">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" data-magicpath-id="35" data-magicpath-path="LandingPage.tsx" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3" data-magicpath-id="36" data-magicpath-path="LandingPage.tsx">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed" data-magicpath-id="37" data-magicpath-path="LandingPage.tsx">
                    {feature.description}
                  </p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white/50 backdrop-blur-sm" data-magicpath-id="38" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="39" data-magicpath-path="LandingPage.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center" data-magicpath-id="40" data-magicpath-path="LandingPage.tsx">
            {/* Left Column - Benefits List */}
            <div data-magicpath-id="41" data-magicpath-path="LandingPage.tsx">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6" data-magicpath-id="42" data-magicpath-path="LandingPage.tsx">
                Why Students Love PassAI
              </h3>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8" data-magicpath-id="43" data-magicpath-path="LandingPage.tsx">
                Join thousands of students who are already acing their exams with our proven study system.
              </p>
              <div className="space-y-3 sm:space-y-4" data-magicpath-id="44" data-magicpath-path="LandingPage.tsx">
                {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-3 sm:gap-4" data-magicpath-id="45" data-magicpath-path="LandingPage.tsx">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-green-100 flex items-center justify-center mt-0.5" data-magicpath-id="46" data-magicpath-path="LandingPage.tsx">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" data-magicpath-id="47" data-magicpath-path="LandingPage.tsx" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-medium flex-1" data-magicpath-id="48" data-magicpath-path="LandingPage.tsx">
                      {benefit}
                    </p>
                  </div>)}
              </div>
            </div>

            {/* Right Column - Visual Card */}
            <div className="relative" data-magicpath-id="49" data-magicpath-path="LandingPage.tsx">
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-2xl" data-magicpath-id="50" data-magicpath-path="LandingPage.tsx">
                <div className="mb-6 sm:mb-8" data-magicpath-id="51" data-magicpath-path="LandingPage.tsx">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6" data-magicpath-id="52" data-magicpath-path="LandingPage.tsx">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" data-magicpath-id="53" data-magicpath-path="LandingPage.tsx" />
                    <span className="text-xs sm:text-sm font-bold" data-magicpath-id="54" data-magicpath-path="LandingPage.tsx">Success Rate</span>
                  </div>
                  <div className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 sm:mb-3" data-magicpath-id="55" data-magicpath-path="LandingPage.tsx">96%</div>
                  <p className="text-base sm:text-lg text-blue-100 font-medium" data-magicpath-id="56" data-magicpath-path="LandingPage.tsx">
                    of students improve their grades within the first month
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6" data-magicpath-id="57" data-magicpath-path="LandingPage.tsx">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20" data-magicpath-id="58" data-magicpath-path="LandingPage.tsx">
                    <div className="text-2xl sm:text-3xl font-bold mb-1" data-magicpath-id="59" data-magicpath-path="LandingPage.tsx">50K+</div>
                    <p className="text-xs sm:text-sm text-blue-100" data-magicpath-id="60" data-magicpath-path="LandingPage.tsx">Active Students</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20" data-magicpath-id="61" data-magicpath-path="LandingPage.tsx">
                    <div className="text-2xl sm:text-3xl font-bold mb-1" data-magicpath-id="62" data-magicpath-path="LandingPage.tsx">1M+</div>
                    <p className="text-xs sm:text-sm text-blue-100" data-magicpath-id="63" data-magicpath-path="LandingPage.tsx">Quizzes Taken</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" data-magicpath-id="64" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="65" data-magicpath-path="LandingPage.tsx">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6" data-magicpath-id="66" data-magicpath-path="LandingPage.tsx">
            Ready to Transform Your Learning?
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10" data-magicpath-id="67" data-magicpath-path="LandingPage.tsx">
            Join PassAI today and start your journey to exam success
          </p>
          <button onClick={onGetStarted} className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 inline-flex items-center gap-3" data-magicpath-id="68" data-magicpath-path="LandingPage.tsx">
            <span data-magicpath-id="69" data-magicpath-path="LandingPage.tsx">Start Learning Now</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" data-magicpath-id="70" data-magicpath-path="LandingPage.tsx" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-6" data-magicpath-id="71" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="72" data-magicpath-path="LandingPage.tsx">
          <p className="text-xs sm:text-sm text-slate-600 font-medium" data-magicpath-id="73" data-magicpath-path="LandingPage.tsx">
            © 2024 PassAI. Made with ❤️ for students worldwide.
          </p>
        </div>
      </footer>

      <style data-magicpath-id="74" data-magicpath-path="LandingPage.tsx">{`
        .safe-top { padding-top: env(safe-area-inset-top); }
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-xl { backdrop-filter: blur(20px); }
          .backdrop-blur-sm { backdrop-filter: blur(10px); }
        }
      `}</style>
    </div>;
};