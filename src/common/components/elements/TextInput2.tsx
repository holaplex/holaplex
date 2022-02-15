import { InputHTMLAttributes } from 'react';

export default function TextInput2({
  label,
  hideLabel,
  leadingIcon,
  ...props
}: {
  label: string;
  hideLabel?: boolean;
  leadingIcon?: any;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={props.id} className={hideLabel ? 'sr-only' : ''}>
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leadingIcon}
          </div>
        )}
        <input
          {...props}
          type={props.type || 'text'}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}
