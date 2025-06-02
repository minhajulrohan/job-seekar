'use client';

import React, { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, googleProvider, auth } = useAuth();

  const handleGmail = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const name = user.displayName || 'User';
      const email = user.email!;
      const password = user.uid;

      const action = mode === 'login' ? login : signup;
      await action(email, password, name);
      toast.success(`Signed ${mode === 'login' ? 'in' : 'up'} with Gmail`);
      onClose();
    } catch (err) {
      toast.error('Gmail login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const action = mode === 'login' ? login : signup;
    try {
      await action(email, password, name);
      toast.success(mode === 'login' ? 'Logged in!' : 'Account created!');
      onClose();
    } catch {
      toast.error('Authentication failed');
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white p-6 w-full max-w-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
          <Button className="w-full bg-red-600 mb-3" onClick={handleGmail} disabled={loading}>
            <Mail className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : `${mode === 'login' ? 'Sign in' : 'Sign up'} with Gmail`}
          </Button>
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </>
            )}
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-3 text-center">
            <Button variant="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
