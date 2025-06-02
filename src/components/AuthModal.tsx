// pages/index.tsx
'use client';

import React, { useState, useContext, useEffect, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { Dialog } from '@radix-ui/react-dialog';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

// 🔥 Firebase setup
const firebaseConfig = {
  apiKey: 'AIzaSyDTBczMFSp3ItB0h3iG9r-6QGzlCeUgo8M',
  authDomain: 'job-seeker-68c03.firebaseapp.com',
  projectId: 'job-seeker-68c03',
  storageBucket: 'job-seeker-68c03.appspot.com',
  messagingSenderId: '553044831836',
  appId: '1:553044831836:web:7cb1f2c3b1eef13fcb0099',
  measurementId: 'G-7G96X2LMHS',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔐 Auth Context
const AuthContext = createContext(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch {
      return null;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      return res.user;
    } catch {
      return null;
    }
  };

  return <AuthContext.Provider value={{ user, login, signup }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

// 🔐 Modal Component
function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleGmail = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email!;
      const name = user.displayName || 'User';
      const password = user.uid;

      const action = mode === 'login' ? login : signup;
      await action(email, password, name);

      toast.success(`Signed ${mode === 'login' ? 'in' : 'up'} with Gmail`);
      onClose();
    } catch {
      toast.error('Gmail login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const action = mode === 'login' ? login : signup;
    const result = await action(email, password, name);
    if (result) {
      toast.success(mode === 'login' ? 'Logged in!' : 'Account created!');
      onClose();
    } else {
      toast.error('Authentication failed');
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white p-6 w-full max-w-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>

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

// 🧪 Main Page
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Welcome {user?.displayName || 'Guest'}!</h1>
        {user ? (
          <p>You are logged in as {user.email}</p>
        ) : (
          <Button onClick={() => setShowModal(true)}>Login / Signup</Button>
        )}
        {showModal && <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />}
      </div>
    </AuthProvider>
  );
}

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // full modal code here
}

