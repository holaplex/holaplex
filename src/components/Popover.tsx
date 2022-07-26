import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';

interface PopoverProps {
  children: React.ReactElement;
  content: React.ReactElement;
  isShowOnHover?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right'; //  many others
  disabled?: boolean;
}

const Popover = ({
  children,
  disabled,
  content,
  placement,
  isShowOnHover = false,
}: PopoverProps) => {
  let [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>();
  let [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  let { styles, attributes } = usePopper(buttonRef, popperElement, {
    placement,
  });

  const [openState, setOpenState] = useState(false);

  const togglePanel = () => {
    setOpenState(!openState);
    buttonRef?.click();
  };
  const onHover = (open: boolean, action: any) => {
    if (!isShowOnHover) return;
    if (
      (!open && !openState && action === 'onMouseEnter') ||
      (open && openState && action === 'onMouseLeave')
    ) {
      togglePanel();
    }
  };

  return (
    <HeadlessPopover as="span" className="relative">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, 'onMouseEnter')}
          onMouseLeave={() => onHover(open, 'onMouseLeave')}
        >
          <HeadlessPopover.Button ref={setButtonRef}>{children}</HeadlessPopover.Button>
          <Transition show={open && !disabled}>
            <HeadlessPopover.Panel
              static={isShowOnHover}
              className="absolute z-20"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              {content}
            </HeadlessPopover.Panel>
          </Transition>
        </div>
      )}
    </HeadlessPopover>
  );
};

export default Popover;
