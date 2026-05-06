import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, ChevronRight,
  Search, FileEdit, Users,
  BarChart2, Target, Shield
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useState, useEffect, useRef, useCallback } from 'react';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out-quart ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

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
  const [navScrolled, setNavScrolled] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const { ref: barsRef, isVisible: barsVisible } = useScrollReveal(0.3);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const handleScroll = useCallback(() => {
    setNavScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (barsVisible && !barsAnimated) {
      setBarsAnimated(true);
    }
  }, [barsVisible, barsAnimated]);

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
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out-quart ${
          navScrolled
            ? 'bg-surface/95 backdrop-blur-md shadow-lg shadow-inverse-surface/5'
            : 'bg-surface/95 backdrop-blur-sm border-b border-outline-variant'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
              <Link to="/app/dashboard" className="text-sm font-medium text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1 group">
                Go to Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-on-surface hover:text-primary transition-colors hidden sm:block">Sign in</Link>
                <Link to="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
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
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-sm text-on-surface-variant font-medium animate-page-enter" style={{ animationDelay: '0ms' }}>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Trusted by 12,000+ job seekers
              </div>

              {/* Headline */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.05] animate-page-enter text-balance"
                style={{ animationDelay: '100ms' }}
              >
                Your career,<br />
                <span className="text-primary">organized.</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-xl text-on-surface-variant leading-relaxed max-w-lg animate-page-enter text-pretty"
                style={{ animationDelay: '200ms' }}
              >
                Stop losing track of applications in endless spreadsheets. Orbit keeps every job, every contact, and every deadline in one place — so you can focus on landing the role.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 animate-page-enter"
                style={{ animationDelay: '300ms' }}
              >
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-semibold text-base hover:bg-primary-hover transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] group">
                  Start tracking free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ease-out-quart" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border border-outline text-on-surface hover:border-on-surface hover:bg-surface-container transition-all active:scale-[0.98]">
                  See how it works
                </a>
              </div>

              {/* Social proof */}
              <div
                className="flex items-center gap-6 pt-4 animate-page-enter"
                style={{ animationDelay: '400ms' }}
              >
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
              <div className="sticky top-24 animate-page-enter" style={{ animationDelay: '500ms' }}>
                <div className="bg-surface rounded-2xl border border-outline-variant shadow-2xl shadow-inverse-surface/5 overflow-hidden animate-float-gentle hover:shadow-3xl transition-shadow duration-300">
                  {/* Window Chrome */}
                  <div className="px-4 py-3 bg-surface-container border-b border-outline-variant flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] hover:brightness-110 transition-all cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] hover:brightness-110 transition-all cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22c55e] hover:brightness-110 transition-all cursor-pointer"></div>
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
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors duration-150 cursor-default"
                          style={{ animationDelay: `${600 + i * 100}ms` }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{job.company}</p>
                            <p className="text-xs text-on-surface-variant">{job.role}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${job.statusColor} animate-pulse`} style={{ animationDelay: `${i * 300}ms` }}></div>
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
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-4">
                Everything you need to land the role
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                From first application to final offer, Orbit keeps your entire job search organized and on track.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeFeature === i;
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <button
                    onClick={() => setActiveFeature(isActive ? -1 : i)}
                    className={`text-left p-8 rounded-2xl border transition-all duration-300 ease-out-quart w-full ${
                      isActive
                        ? 'bg-surface border-primary shadow-lg shadow-primary/10 scale-[1.01]'
                        : 'bg-surface border-outline-variant hover:border-outline hover:bg-surface-container-low hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ease-out-quart ${
                      isActive ? 'bg-primary text-on-primary scale-105' : 'bg-surface-container text-on-surface-variant'
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
                </AnimatedSection>
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
              <AnimatedSection>
                <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-6">
                  Three steps to clarity
                </h2>
              </AnimatedSection>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Add your applications', desc: 'Import jobs from LinkedIn, paste from any site, or enter manually. Takes 10 seconds.' },
                  { step: '02', title: 'Track progress', desc: 'Update statuses as you move through stages. Orbit reminds you when it\'s time to follow up.' },
                  { step: '03', title: 'Get the offer', desc: 'Visualize your pipeline, prep with AI, and celebrate when offers come in.' },
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={i * 150}>
                    <div className="flex gap-4 group">
                      <span className="text-4xl font-bold text-outline-variant group-hover:text-primary transition-colors duration-300">{item.step}</span>
                      <div>
                        <h4 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors duration-200">{item.title}</h4>
                        <p className="text-on-surface-variant">{item.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div ref={barsRef} className="bg-gradient-to-br from-surface to-surface-container rounded-3xl p-8 border border-outline-variant shadow-xl shadow-inverse-surface/5 hover:shadow-2xl transition-shadow duration-300">
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
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: barsAnimated ? '100%' : '0%',
                          transform: barsAnimated ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.8s ease-out-expo'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-on-surface-variant">Responses received</span>
                      <span className="font-semibold text-on-surface">34</span>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{
                          width: barsAnimated ? '27%' : '0%',
                          transform: barsAnimated ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.8s ease-out-expo 0.15s'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-on-surface-variant">Interviews scheduled</span>
                      <span className="font-semibold text-on-surface">12</span>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-status-interview rounded-full"
                        style={{
                          width: barsAnimated ? '9%' : '0%',
                          transform: barsAnimated ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.8s ease-out-expo 0.3s'
                        }}
                      ></div>
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
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-on-surface tracking-tight text-center mb-16">
              From people who've been there
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="bg-surface p-8 rounded-2xl border border-outline-variant hover:shadow-lg hover:shadow-inverse-surface/5 hover:-translate-y-1 transition-all duration-300 ease-out-quart group">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name={t.avatar} index={i} size="large" />
                    <div>
                      <p className="font-semibold text-on-surface group-hover:text-primary transition-colors duration-200">{t.author}</p>
                      <p className="text-sm text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-lg text-on-surface leading-relaxed italic">"{t.quote}"</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-6">
              Ready to take control?
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto">
              Join thousands of job seekers who've organized their search with Orbit. Free forever, no credit card required.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] group">
                Get started for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ease-out-quart" />
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-on-surface-variant flex-wrap">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Free forever
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                Your data stays private
              </span>
            </div>
          </AnimatedSection>
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
