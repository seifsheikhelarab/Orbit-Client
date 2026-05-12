import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signIn } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';

const t = (delay: string) => ({
  opacity: 0,
  transform: 'translateY(12px)',
  transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`
});

const tVisible = { opacity: 1, transform: 'translateY(0)' };

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await signIn.email({
      email,
      password,
      callbackURL: '/app/dashboard'
    });
    if (error) {
      setErrorMsg(error.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signIn.social({
        provider: 'google',
        callbackURL: '/app/dashboard'
    });
  };

  return (
    <main className="grow flex items-center justify-center px-4 py-12 min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements - floating */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 animate-[floatGentle_6s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50 animate-[floatGentle_8s_ease-in-out_infinite_1s]" />

      <div className="relative w-full max-w-md" style={mounted ? tVisible : { opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Login Card */}
        <div className="relative bg-surface border border-outline-variant/30 rounded-xl shadow-xl shadow-primary/5 p-8 md:p-10 backdrop-blur-sm">
          {/* Brand & Header */}
          <div className="text-center mb-10" style={mounted ? tVisible : t('0.08s')}>
            <img src="/icon.png" alt="Orbit" className="w-16 h-16 mx-auto mb-6 animate-float-gentle" />
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Welcome back</h1>
            <p className="text-on-surface-variant text-sm">Please enter your details to sign in.</p>
          </div>

          {/* Google Login Action */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low hover:shadow-md transition-all duration-200 py-3 px-4 rounded-lg font-medium text-on-surface-variant cursor-pointer active:scale-[0.98]"
            style={mounted ? tVisible : t('0.12s')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Login with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-8" style={mounted ? tVisible : t('0.16s')}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface px-4 text-on-surface-variant font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Error Message - slide in */}
            {errorMsg && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm font-medium animate-slide-in-left">
                {errorMsg}
              </div>
            )}
            {/* Email Input */}
            <div className="space-y-2" style={mounted ? tVisible : t('0.20s')}>
              <label htmlFor="email" className="text-sm font-medium text-on-surface">Email Address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2" style={mounted ? tVisible : t('0.25s')}>
              <label htmlFor="password" className="text-sm font-medium text-on-surface">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className={`inline-block transition-all duration-200 ${showPassword ? 'rotate-0' : 'rotate-0'}`}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </span>
                </button>
              </div>
            </div>

            {/* Helpers */}
            <div className="flex items-center justify-between" style={mounted ? tVisible : t('0.30s')}>
              <label className="flex items-center gap-2 group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-secondary transition-colors hover:underline">Forgot password?</Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className={`w-full font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-primary/70 text-on-primary/70 cursor-wait'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] text-on-primary'
              }`}
              style={mounted ? tVisible : t('0.35s')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-10 text-center text-sm text-on-surface-variant" style={mounted ? tVisible : t('0.40s')}>
            Don't have an account?
            <Link to="/register" className="font-bold text-primary hover:text-secondary transition-colors ml-1 hover:underline">Create an account</Link>
          </p>
        </div>

        {/* Additional Branding Context */}
        <div className="mt-12 text-center" style={mounted ? tVisible : t('0.45s')}>
          <p className="text-xs text-on-surface-variant leading-relaxed px-4">
            By continuing, you agree to Orbit's
            <a href="#" className="underline hover:text-on-surface transition-colors ml-1">Terms of Service</a> and
            <a href="#" className="underline hover:text-on-surface transition-colors ml-1">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
