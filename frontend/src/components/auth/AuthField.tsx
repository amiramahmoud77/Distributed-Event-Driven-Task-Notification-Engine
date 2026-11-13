import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string | null;
  isDarkMode: boolean;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  isDarkMode,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === 'password';

  const t = isDarkMode
    ? {
        field: 'bg-[#172033] border-[#2C3A56] text-[#E8ECF4] placeholder:text-[#8B96AB]',
        muted: 'text-[#8B96AB] hover:text-[#E8ECF4]',
        danger: 'text-[#F07878]',
      }
    : {
        field: 'bg-white border-[#D7DEE8] text-[#14213D] placeholder:text-[#8B93A5]',
        muted: 'text-[#5B6578] hover:text-[#14213D]',
        danger: 'text-[#C23B3B]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={isPassword && isVisible ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-[#F2B533] ${
            isPassword ? 'pr-11' : ''
          } ${error ? 'border-[#F07878]' : ''} ${t.field}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setIsVisible((current) => !current)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 ${t.muted} ${focus}`}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className={`mt-1.5 text-sm ${t.danger}`}>
          {error}
        </p>
      )}
    </div>
  );
};