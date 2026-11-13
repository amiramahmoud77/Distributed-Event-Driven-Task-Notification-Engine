import React, { useState } from 'react';
import { AuthField } from './auth/AuthField';
import { AuthLayout } from './auth/AuthLayout';

interface LoginProps {
  onNavigateToSignup: () => void;
  onLoginSuccess: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

const validate = (email: string, password: string): FieldErrors => {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  if (!password) {
    errors.password = 'Enter your password.';
  }

  return errors;
};

export const Login: React.FC<LoginProps> = ({ onNavigateToSignup, onLoginSuccess, isDarkMode, setIsDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      // fetch is used directly here: the api() helper clears the token on a 401,
      // and a wrong password is also a 401.
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || `The server did not respond properly (status ${response.status}).`);
      }

      if (data?.token) {
        localStorage.setItem('token', data.token);
      }

      onLoginSuccess();
    } catch (err: any) {
      setServerError(err.message || 'Couldn’t reach the server. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mutedClass = isDarkMode ? 'text-[#8B96AB]' : 'text-[#5B6578]';
  const dangerClass = isDarkMode ? 'text-[#F07878]' : 'text-[#C23B3B]';
  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';

  return (
    <AuthLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <h2 className="text-3xl font-semibold tracking-tight">Sign in</h2>
      <p className={`mt-2 ${mutedClass}`}>Use the email and password you registered with.</p>

      {serverError && (
        <div
          role="alert"
          className="mt-6 border p-3.5"
          style={{ background: '#F0787814', borderColor: '#F0787855', borderRadius: 14 }}
        >
          <p className={`text-sm font-medium ${dangerClass}`}>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <AuthField
          id="login-email"
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
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={fieldErrors.password}
          isDarkMode={isDarkMode}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-xl bg-[#F2B533] py-3 text-sm font-semibold text-[#101826] transition-colors hover:bg-[#F7C455] disabled:opacity-60 ${focus}`}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className={`mt-6 text-sm ${mutedClass}`}>
        New here?{' '}
        <button
          type="button"
          onClick={onNavigateToSignup}
          className={`font-semibold text-[#F2B533] underline-offset-4 hover:underline ${focus}`}
        >
          Create an account
        </button>
      </p>
    </AuthLayout>
  );
};