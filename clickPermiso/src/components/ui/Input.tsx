import { useState } from 'react';

interface InputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  regex?: RegExp;
  mensajeError?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Input = ({ label, type = 'text', name, value, onChange, regex, mensajeError, placeholder, required, disabled, icon }: InputProps) => {
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    setFocused(false);
    if (regex && value && !regex.test(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    onChange(e);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-500 ml-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className={`relative flex items-center rounded-lg border transition-colors
        ${focused ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-50/50'}
        ${error ? 'border-red-300 bg-red-50/30' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {icon && <span className="pl-3 text-slate-400">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full px-4 py-2 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-300"
        />
      </div>
      {error && mensajeError && (
        <span className="text-red-500 text-[11px] font-medium ml-1">{mensajeError}</span>
      )}
    </div>
  );
};

export default Input;
