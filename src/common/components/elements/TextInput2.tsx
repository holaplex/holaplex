export default function TextInput2(props: {
  id: string;
  type?: 'text' | 'email';
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className={props.hideLabel ? 'sr-only' : ''}>
        {props.label}
      </label>
      <input
        type={props.type || 'text'}
        name={props.id}
        id={props.id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={props.placeholder}
      />
    </div>
  );
}
