import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await signIn.email({ email, password });
    if (!error) {
      navigate('/app/dashboard');
    } else {
      setErrorMsg(error.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await signIn.social({
      provider: 'google'
    });
  };

  return (
    <main className="grow flex items-center justify-center px-4 py-12 min-h-screen">
      <div className="relative w-full max-w-md">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
        
        {/* Login Card */}
        <div className="relative bg-surface border border-outline-variant/30 rounded-xl shadow-xl shadow-primary/5 p-8 md:p-10 backdrop-blur-sm">
          {/* Brand & Header */}
          <div className="text-center mb-10">
            <img src="/icon.png" alt="Orbit" className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Welcome back</h1>
            <p className="text-on-surface-variant text-sm">Please enter your details to sign in.</p>
          </div>

          {/* Google Login Action */}
          <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low transition-all duration-200 py-3 px-4 rounded-lg font-medium text-on-surface-variant cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Login with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface px-4 text-on-surface-variant font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}
            {/* Email Input */}
            <div className="space-y-2">
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
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-on-surface">Password</label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required 
                />
              </div>
            </div>

            {/* Helpers */}
            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                <span className="ml-2 text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-secondary transition-colors">Forgot password?</Link>
            </div>

            {/* Submit Button */}
            <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-10 text-center text-sm text-on-surface-variant">
            Don't have an account? 
            <Link to="/register" className="font-bold text-primary hover:text-secondary transition-colors ml-1">Create an account</Link>
          </p>
        </div>

        {/* Additional Branding Context */}
        <div className="mt-12 text-center">
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
