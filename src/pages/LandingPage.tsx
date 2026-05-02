import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, ChevronRight,
  Search, FileEdit, Users, 
  BarChart2, Target, Shield
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';

function Avatar({ name, index, size = 'default' }: { name: string; index: number; size?: 'default' | 'large' }) {
  const initial = name.charAt(0).toUpperCase();
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent'];
  const sizeClasses = size === 'large' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sizeClasses} rounded-full border-2 border-on-primary/20 flex items-center justify-center text-on-primary font-semibold ${colors[index % colors.length]}`}>
      {initial}
    </div>
  );
}

export function LandingPage() {
  const { data: session } = useSession();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Search,
      title: 'Track Every Application',
      description: 'Save jobs from anywhere. LinkedIn, Indeed, company career pages — one click adds it to your orbit.',
      metric: '12,847 applications tracked this week'
    },
    {
      icon: FileEdit,
      title: 'Tailor Resumes Instantly',
      description: 'Our AI analyzes job descriptions and optimizes your resume keywords. Pass every ATS scan.',
      metric: '3.2 hours saved per application on average'
    },
    {
      icon: Users,
      title: 'Never Miss an Interview',
      description: 'Built-in calendar sync and automated reminders. You\'ll never drop the ball again.',
      metric: '94% interview attendance rate'
    },
    {
      icon: BarChart2,
      title: 'Understand Your Pipeline',
      description: 'Visual analytics show where you\'re winning and where you\'re losing. Optimize accordingly.',
      metric: '2.4x improvement in response rates'
    }
  ];

  const testimonials = [
    {
      quote: "I used to lose track of everything in spreadsheets. Orbit gave me back control of my job search.",
      author: "Sarah Chen",
      role: "Product Designer at Stripe",
      avatar: "Sarah"
    },
    {
      quote: "The interview prep feature predicted the exact questions I got. Got the offer last week.",
      author: "James Wilson", 
      role: "Senior Engineer at Vercel",
      avatar: "James"
    }
  ];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-sm border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="Orbit" className="size-8" />
            <span className="text-xl font-bold tracking-tight text-on-surface">Orbit</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">How it works</a>
            <a href="#testimonials" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link to="/app/dashboard" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">
                Go to Dashboard
                <ChevronRight className="inline w-4 h-4 ml-1" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-on-surface hover:text-primary transition-colors hidden sm:block">Sign in</Link>
                <Link to="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Style */}
      <header className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Column - Headline */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-sm text-on-surface-variant font-medium">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Trusted by 12,000+ job seekers
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.05]">
                Your career,<br />
                <span className="text-primary">organized.</span>
              </h1>
              
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg">
                Stop losing track of applications in endless spreadsheets. Orbit keeps every job, every contact, and every deadline in one place — so you can focus on landing the role.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all group">
                  Start tracking free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border border-outline text-on-surface hover:border-on-surface-variant transition-colors">
                  See how it works
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  <Avatar name="Sarah" index={0} />
                  <Avatar name="James" index={1} />
                  <Avatar name="Emily" index={2} />
                </div>
                <p className="text-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Join them.</span> No credit card required.
                </p>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24">
                <div className="bg-surface rounded-2xl border border-outline-variant shadow-2xl shadow-inverse-surface/5 overflow-hidden">
                  {/* Window Chrome */}
                  <div className="px-4 py-3 bg-surface-container border-b border-outline-variant flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                  </div>
                  {/* Dashboard Preview */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Active Applications</p>
                        <p className="text-3xl font-bold text-on-surface">24</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-on-surface-variant">This month</p>
                        <p className="text-sm font-semibold text-accent">+12 new</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { company: 'Stripe', role: 'Senior Designer', status: 'Interview', statusColor: 'bg-status-interview' },
                        { company: 'Vercel', role: 'Product Designer', status: 'Applied', statusColor: 'bg-status-applied' },
                        { company: 'Linear', role: 'UX Lead', status: 'Offer', statusColor: 'bg-status-offer' },
                      ].map((job, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{job.company}</p>
                            <p className="text-xs text-on-surface-variant">{job.role}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${job.statusColor}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-container">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-4">
              Everything you need to land the role
            </h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              From first application to final offer, Orbit keeps your entire job search organized and on track.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeFeature === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveFeature(isActive ? -1 : i)}
                  className={`text-left p-8 rounded-2xl border transition-all duration-200 ${
                    isActive 
? 'bg-surface border-primary shadow-lg' 
                       : 'bg-surface border-outline-variant hover:border-outline hover:bg-surface-container-low'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">{feature.title}</h3>
                  <p className="text-on-surface-variant mb-4">{feature.description}</p>
                  <p className="text-xs font-medium text-accent flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {feature.metric}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-6">
                Three steps to clarity
              </h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Add your applications', desc: 'Import jobs from LinkedIn, paste from any site, or enter manually. Takes 10 seconds.' },
                  { step: '02', title: 'Track progress', desc: 'Update statuses as you move through stages. Orbit reminds you when it\'s time to follow up.' },
                  { step: '03', title: 'Get the offer', desc: 'Visualize your pipeline, prep with AI, and celebrate when offers come in.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-4xl font-bold text-outline-variant">{item.step}</span>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface mb-1">{item.title}</h4>
                      <p className="text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-surface to-surface-container rounded-3xl p-8 border border-outline-variant">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-outline-variant">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-on-surface">Response Rate</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-on-surface-variant">Applications sent</span>
                      <span className="font-semibold text-on-surface">127</span>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-on-surface-variant">Responses received</span>
                      <span className="font-semibold text-on-surface">34</span>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: '27%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-on-surface-variant">Interviews scheduled</span>
                      <span className="font-semibold text-on-surface">12</span>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-status-interview rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-surface-container">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-on-surface tracking-tight text-center mb-16">
            From people who've been there
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface p-8 rounded-2xl border border-outline-variant">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={t.avatar} index={i} size="large" />
                  <div>
                    <p className="font-semibold text-on-surface">{t.author}</p>
                    <p className="text-sm text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
                <p className="text-lg text-on-surface leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-6">
            Ready to take control?
          </h2>
          <p className="text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who've organized their search with Orbit. Free forever, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all group">
              Get started for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Free forever
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0f766e]" />
              Your data stays private
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="text-lg font-bold text-on-surface mb-2">Orbit</div>
              <p className="text-sm text-on-surface-variant">© {new Date().getFullYear()} Orbit. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <a href="/privacy" className="text-on-surface-variant hover:text-on-surface transition-colors">Privacy</a>
              <a href="/terms" className="text-on-surface-variant hover:text-on-surface transition-colors">Terms</a>
              <a href="/contact" className="text-on-surface-variant hover:text-on-surface transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
