import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      toast.success('Password reset email sent');
    } catch {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="grow flex items-center justify-center px-4 py-12 min-h-screen animate-page-enter">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-3">Check your email</h1>
          <p className="text-on-surface-variant mb-8">
            We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
          </p>
          <Link to="/login">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grow flex items-center justify-center px-4 py-12 min-h-screen animate-page-enter">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative bg-white border border-outline-variant/30 rounded-xl shadow-xl p-8 md:p-10">
          <Link to="/login" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-2">Reset your password</h1>
            <p className="text-on-surface-variant text-sm">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
