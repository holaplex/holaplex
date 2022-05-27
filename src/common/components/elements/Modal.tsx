import { Dispatch, FC, ReactNode, SetStateAction, useRef } from 'react';
import { useOutsideAlerter } from '@/hooks/useOutsideAlerter';
import cx from 'classnames';
import { Close } from '@/components/icons/Close';
import classNames from 'classnames';

type ModalProps = {
  open: Boolean;
  // for whatever reason big B and little B are diff to TS...
  setOpen:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<Boolean>>
    | ((open: Boolean) => void);
  children: ReactNode;
  title?: String;
  priority?: boolean;
  short?: Boolean;
};

export const Modal: FC<ModalProps> = ({
  open,
  setOpen,
  children,
  title,
  priority = false,
  short,
}) => {
  const modalRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(modalRef, () => setOpen(priority)); // disable outside alerter if priority (require clicking close)

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      className={cx(
        'fixed top-0 left-0 right-0 bottom-0',
        'bg-gray-800 bg-opacity-40 backdrop-blur-lg ',
        'transition-opacity duration-500 ease-in-out',
        'flex flex-col items-center justify-center',
        {
          'opacity-100': open,
          'opacity-0': !open,
          'pointer-events-auto': open,
          'pointer-events-none': !open,
          'z-50': priority,
          'z-20': !priority,
        }
      )}
    >
      <div
        ref={priority ? null : modalRef}
        className={classNames(
          'scrollbar-thumb-rounded-full relative flex h-full max-h-screen w-full flex-col overflow-y-auto rounded-xl bg-gray-900 p-6 text-white shadow-md scrollbar-thin scrollbar-track-gray-900  sm:h-auto  sm:max-w-lg',
          short ? 'sm:max-h-[30rem]' : 'sm:max-h-[50rem]'
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className={`absolute top-7 right-6 hover:text-gray-400`}
        >
          <Close color={`#ffffff`} />
        </button>
        {title && (
          <div className={`flex w-full items-center justify-center`}>
            <h4 className={`text-2xl font-medium`}>{title}</h4>
          </div>
        )}
        <div
          className={`scrollbar-thumb-rounded-full flex h-full w-full flex-col scrollbar-thin scrollbar-track-gray-900`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
