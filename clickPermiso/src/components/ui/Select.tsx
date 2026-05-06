import { useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  mensajeError?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select = ({ label, name, value, onChange, options, mensajeError, required, disabled }: SelectProps) => {
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    setFocused(false);
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setError(false);
    onChange(e);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-500 ml-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setFocused(true)}
          disabled={disabled}
          className={`w-full px-4 py-2 text-sm rounded-lg border appearance-none transition-colors outline-none cursor-pointer
            ${focused ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-50/50'}
            ${error ? 'border-red-300 bg-red-50/30' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            text-slate-700
          `}
        >
          <option value="">Seleccionar...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && mensajeError && (
        <span className="text-red-500 text-[11px] font-medium ml-1">{mensajeError}</span>
      )}
    </div>
  );
};

export default Select;
