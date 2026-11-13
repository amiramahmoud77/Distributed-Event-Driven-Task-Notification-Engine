import React, { useEffect, useRef, useState } from 'react';
import { AuthField } from './auth/AuthField';
import { AuthLayout } from './auth/AuthLayout';

interface SignupProps {
  onNavigateToLogin: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const MIN_PASSWORD_LENGTH = 8;

const validate = (name: string, email: string, password: string): FieldErrors => {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  if (!password) {
    errors.password = 'Choose a password.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
};

export const Signup: React.FC<SignupProps> = ({ onNavigateToLogin, isDarkMode, setIsDarkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const redirectTimer = useRef<number | undefined>(undefined);

  // If the person leaves this page before the redirect fires, cancel it.
  useEffect(() => () => window.clearTimeout(redirectTimer.current), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate(name, email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || `The server did not respond properly (status ${response.status}).`);
      }

      setIsDone(true);
      redirectTimer.current = window.setTimeout(onNavigateToLogin, 1500);
    } catch (err: any) {
      setServerError(err.message || 'Couldn’t reach the server. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mutedClass = isDarkMode ? 'text-[#8B96AB]' : 'text-[#5B6578]';
  const dangerClass = isDarkMode ? 'text-[#F07878]' : 'text-[#C23B3B]';
  const successClass = isDarkMode ? 'text-[#5CC49A]' : 'text-[#1F8A5F]';
  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';

  return (
    <AuthLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <h2 className="text-3xl font-semibold tracking-tight">Create your account</h2>
      <p className={`mt-2 ${mutedClass}`}>It takes a few seconds. You can start adding tasks right after.</p>

      {serverError && (
        <div
          role="alert"
          className="mt-6 border p-3.5"
          style={{ background: '#F0787814', borderColor: '#F0787855', borderRadius: 14 }}
        >
          <p className={`text-sm font-medium ${dangerClass}`}>{serverError}</p>
        </div>
      )}

      {isDone && (
        <div
          role="status"
          className="mt-6 border p-3.5"
          style={{ background: '#5CC49A14', borderColor: '#5CC49A55', borderRadius: 14 }}
        >
          <p className={`text-sm font-medium ${successClass}`}>Account created. Taking you to sign in…</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <AuthField
          id="signup-name"
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Your full name"
          autoComplete="name"
          error={fieldErrors.name}
          isDarkMode={isDarkMode}
        />

        <AuthField
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@example.com"
          autoComplete="email"
          error={fieldErrors.email}
          isDarkMode={isDarkMode}
        />

        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          error={fieldErrors.password}
          isDarkMode={isDarkMode}
        />

        <button
          type="submit"
          disabled={isLoading || isDone}
          className={`w-full rounded-xl bg-[#F2B533] py-3 text-sm font-semibold text-[#101826] transition-colors hover:bg-[#F7C455] disabled:opacity-60 ${focus}`}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className={`mt-6 text-sm ${mutedClass}`}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className={`font-semibold text-[#F2B533] underline-offset-4 hover:underline ${focus}`}
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
};