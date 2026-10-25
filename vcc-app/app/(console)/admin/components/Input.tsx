'use client';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  multiline = false,
  rows = 4,
}: InputProps) {
  const baseStyles = 'w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseStyles} resize-none ${error ? 'border-red-500' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseStyles} ${error ? 'border-red-500' : ''}`}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
