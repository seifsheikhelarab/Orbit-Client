import { Eye, EyeOff, XCircle, AlertTriangle, ShieldCheck, Loader2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { signUp, signIn } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (pw.length === 0) return { level: 0, label: '', color: '', width: '0%' };
  if (score <= 1) return { level: 1, label: 'Weak', color: 'text-error', bg: 'bg-error', width: '25%' };
  if (score === 2) return { level: 2, label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-500', width: '50%' };
  if (score === 3) return { level: 3, label: 'Good', color: 'text-primary', bg: 'bg-primary', width: '75%' };
  return { level: 4, label: 'Strong', color: 'text-accent', bg: 'bg-accent', width: '100%' };
}

const t = (delay: string) => ({
  opacity: 0,
  transform: 'translateY(12px)',
  transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`
});

const tVisible = { opacity: 1, transform: 'translateY(0)' };

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const { error, data } = await signUp.email({
      email,
      password,
      name,
      callbackURL: '/app/dashboard'
    });
    if (error) {
      setErrorMsg(error.message || 'Registration failed');
      setLoading(false);
    } else if (data?.user) {
      setLoading(false);
      setSuccessMsg('Account created! Redirecting to dashboard...');
      setTimeout(() => navigate('/app/dashboard'), 1500);
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
        {/* Registration Card */}
        <div className="relative bg-surface border border-outline-variant/30 rounded-xl shadow-xl shadow-primary/5 p-8 md:p-10 backdrop-blur-sm">
          {/* Brand & Header */}
          <div className="text-center mb-10" style={mounted ? tVisible : t('0.08s')}>
            <img src="/icon.png" alt="Orbit" className="w-16 h-16 mx-auto mb-6 animate-float-gentle" />
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Create account</h1>
            <p className="text-on-surface-variant text-sm">Start your journey with Orbit today.</p>
          </div>

          {/* Social Sign Up */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low hover:shadow-md transition-all duration-200 py-3 px-4 rounded-lg font-medium text-on-surface-variant cursor-pointer active:scale-[0.98]"
            style={mounted ? tVisible : t('0.12s')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative my-8" style={mounted ? tVisible : t('0.16s')}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface px-4 text-on-surface-variant font-medium">or sign up with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Error Message - slide in */}
            {errorMsg && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm font-medium animate-slide-in-left">
                {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="bg-accent/10 text-accent px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-slide-in-left">
                <Mail className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2" style={mounted ? tVisible : t('0.20s')}>
              <label htmlFor="name" className="text-sm font-medium text-on-surface">Full Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2" style={mounted ? tVisible : t('0.25s')}>
              <label htmlFor="email" className="text-sm font-medium text-on-surface">Email Address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2" style={mounted ? tVisible : t('0.30s')}>
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex gap-1.5 h-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="flex-1 rounded-full overflow-hidden bg-outline-variant"
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out-quart ${
                            i <= strength.level ? strength.bg : ''
                          }`}
                          style={{
                            width: i <= strength.level ? '100%' : '0%',
                            transitionDelay: `${(i - 1) * 50}ms`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className={`text-label-sm font-medium flex items-center gap-1 transition-colors duration-200 ${strength.color}`}>
                    {strength.level <= 1 && <XCircle className="w-3 h-3" />}
                    {strength.level === 2 && <AlertTriangle className="w-3 h-3" />}
                    {strength.level >= 3 && <ShieldCheck className="w-3 h-3" />}
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2" style={mounted ? tVisible : t('0.35s')}>
              <div className="flex items-center h-5">
                <input type="checkbox" id="terms" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" />
              </div>
              <label htmlFor="terms" className="text-sm text-on-surface-variant leading-tight">
                I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms</a> &amp; <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>
              </label>
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
              style={mounted ? tVisible : t('0.40s')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-10 text-center text-sm text-on-surface-variant" style={mounted ? tVisible : t('0.45s')}>
            Already have an account?
            <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors ml-1 hover:underline">Log in</Link>
          </p>
        </div>

        {/* Additional Branding Context */}
        <div className="mt-12 text-center" style={mounted ? tVisible : t('0.50s')}>
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
