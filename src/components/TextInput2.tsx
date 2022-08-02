import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

function TextInput2({
  label,
  hideLabel,
  leadingIcon,
  className,
  ...props
}: {
  label: string;
  hideLabel?: boolean;
  leadingIcon?: any;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="w-full">
      <label htmlFor={props.id} className={hideLabel ? 'sr-only' : ''}>
        {label}
      </label>
      <div className={clsx('relative rounded-md shadow-sm', !hideLabel && 'mt-1')}>
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leadingIcon}
          </div>
        )}
        <input
          {...props}
          type={props.type || 'text'}
          className={clsx(
            { 'pl-10 pr-3': leadingIcon },
            'w-full rounded-lg border-2 border-solid border-gray-800 bg-transparent placeholder-gray-500 focus:border-white focus:placeholder-transparent focus:shadow-none focus:ring-0',
            className
          )}
        />
      </div>
    </div>
  );
}

export default TextInput2;
