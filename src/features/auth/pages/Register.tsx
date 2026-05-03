import { Eye, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signUp, signIn } from '@/lib/auth-client';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await signUp.email({ email, password, name });
    if (!error) {
      navigate('/app/dashboard');
    } else {
      setErrorMsg(error.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await signIn.social({
      provider: 'google',
    });
  };

  return (
    <main className="grow flex items-center justify-center p-6 sm:p-12 relative overflow-hidden min-h-screen">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tertiary/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Brand Identity */}
        <div className="text-center mb-10">
          <img src="/icon.png" alt="Orbit" className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Orbit</h1>
          <p className="text-on-surface-variant font-medium">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm">
          {/* Social Sign Up */}
          <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-surface border border-outline-variant rounded-xl font-medium text-on-surface-variant hover:bg-surface-container transition-colors duration-200 mb-6 cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative mb-8 text-center">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <span className="relative px-4 bg-surface-container-lowest text-xs text-outline font-medium uppercase tracking-widest">or sign up with email</span>
          </div>

          {/* Form Fields */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {errorMsg && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-on-surface-variant mb-1.5 ml-1">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Alex Rivera" className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline/50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant mb-1.5 ml-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="alex@example.com" className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline/50" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline/50" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="flex gap-1.5 h-1 mt-3">
                <div className="flex-1 bg-primary rounded-full"></div>
                <div className="flex-1 bg-primary rounded-full"></div>
                <div className="flex-1 bg-primary rounded-full"></div>
                <div className="flex-1 bg-outline-variant rounded-full"></div>
              </div>
              <p className="text-[11px] text-primary font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 fill-primary text-on-primary" />
                Strong password
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <div className="flex items-center h-5">
                <input type="checkbox" id="terms" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-bright cursor-pointer" />
              </div>
              <label htmlFor="terms" className="text-sm text-on-surface-variant leading-tight">
                I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms</a> &amp; <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Action Button */}
            <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 mt-2 cursor-pointer flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 text-on-surface-variant font-medium">
          Already have an account? 
          <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log in</Link>
        </p>
      </div>
    </main>
  );
}
