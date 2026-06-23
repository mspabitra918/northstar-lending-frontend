'use client';

import { KeyboardEvent, ReactNode, RefObject } from 'react';

interface BaseProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
}

export function TextField({
  label,
  name,
  value,
  error,
  onChange,
  type = 'text',
  placeholder,
  inputMode,
  autoComplete,
  hint,
  inputRef,
  onKeyDown,
  onFocus,
}: BaseProps & {
  type?: string;
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  autoComplete?: string;
  hint?: string;
  inputRef?: RefObject<HTMLInputElement>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="field-input"
        onChange={(e) => onChange(name, e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
      {hint && !error && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  name,
  value,
  error,
  onChange,
  options,
  placeholder = 'Select…',
}: BaseProps & { options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        aria-invalid={!!error}
        className="field-input"
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function RadioCards({
  label,
  name,
  value,
  error,
  onChange,
  options,
}: BaseProps & { options: { value: string; label: string; hint?: string }[] }) {
  return (
    <fieldset>
      <legend className="field-label">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                selected
                  ? 'border-star-400 bg-star-50 ring-2 ring-star-200'
                  : 'border-navy-200 hover:border-navy-300'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                className="sr-only"
                onChange={() => onChange(name, o.value)}
              />
              <span className="block font-medium text-navy-900">{o.label}</span>
              {o.hint && <span className="mt-0.5 block text-xs text-navy-400">{o.hint}</span>}
            </label>
          );
        })}
      </div>
      {error && <p className="field-error">{error}</p>}
    </fieldset>
  );
}

export function CheckboxField({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          className="mt-1 h-5 w-5 shrink-0 rounded border-navy-300 text-star-500 focus:ring-star-400"
          onChange={(e) => onChange(name, e.target.checked)}
        />
        <span className="text-sm leading-relaxed text-navy-700">{children}</span>
      </label>
      {error && <p className="field-error ml-8">{error}</p>}
    </div>
  );
}
