import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`w-full ${fullWidth ? '' : 'inline-block'}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-small font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-2.5 text-body
              bg-white text-text-primary
              border border-border-medium rounded-lg
              placeholder:text-text-muted
              transition-all duration-200 ease-in-out
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
              disabled:bg-surface disabled:text-text-muted disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={`mt-1 text-small ${error ? 'text-error-500' : 'text-text-muted'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`w-full ${fullWidth ? '' : 'inline-block'}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-small font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-2.5 text-body
            bg-white text-text-primary
            border border-border-medium rounded-lg
            placeholder:text-text-muted
            transition-all duration-200 ease-in-out
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            disabled:bg-surface disabled:text-text-muted disabled:cursor-not-allowed
            resize-y min-h-[100px]
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : ''}
            ${className}
          `}
          {...props}
        />
        {(error || hint) && (
          <p className={`mt-1 text-small ${error ? 'text-error-500' : 'text-text-muted'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export type { InputProps, TextAreaProps };
