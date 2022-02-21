import { InputHTMLAttributes } from 'react';
import cx from 'classnames';

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
    <div className="w-full">
      <label htmlFor={props.id} className={hideLabel ? 'sr-only' : ''}>
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
            {leadingIcon}
          </div>
        )}
        <input
          {...props}
          type={props.type || 'text'}
          className={cx(
            'block w-full rounded-md border-gray-300 bg-gray-900 shadow-sm focus:border-white focus:bg-black focus:ring-white sm:text-sm  ',
            { 'pl-8 pr-3': leadingIcon }
          )}
        />
      </div>
    </div>
  );
}
