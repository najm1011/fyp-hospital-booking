import { useState } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  icon: Icon,
  disabled = false,
  required = false,
  autoComplete,
  helpText,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = touched && error;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
            hasError
              ? 'text-error-600'
              : isFocused
                ? 'text-primary-600'
                : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 transition-colors duration-200 ${
                hasError
                  ? 'text-error-400'
                  : isFocused
                    ? 'text-primary-500'
                    : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          className={`
            block w-full rounded-xl border-2 transition-all duration-200
            ${Icon ? 'pl-11' : 'pl-4'}
            ${isPassword || hasError ? 'pr-11' : 'pr-4'}
            py-3
            text-base text-gray-900 placeholder-gray-400
            ${hasError
              ? 'border-error-300 bg-error-50/50 focus:border-error-500 focus:ring-4 focus:ring-error-500/10'
              : 'border-gray-200 bg-white hover:border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
            focus:outline-none
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center group/btn"
          >
            {showPassword ? (
              <FiEye className="h-5 w-5 text-gray-400 group-hover/btn:text-gray-600 transition-colors" />
            ) : (
              <FiEyeOff className="h-5 w-5 text-gray-400 group-hover/btn:text-gray-600 transition-colors" />
            )}
          </button>
        )}
        {hasError && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <FiAlertCircle className="h-5 w-5 text-error-500" />
          </div>
        )}
      </div>
      {hasError && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-error-600 flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
      {helpText && !hasError && (
        <p id={`${name}-help`} className="mt-1.5 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;
