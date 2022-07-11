import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';

interface PopoverProps {
  children: React.ReactElement;
  content: React.ReactElement;
  isShowOnHover?: boolean;
}

const Popover = ({ children, content, isShowOnHover = false }: PopoverProps) => {
  let [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>();
  let [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  let { styles, attributes } = usePopper(buttonRef, popperElement);

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
    <HeadlessPopover className="relative">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, 'onMouseEnter')}
          onMouseLeave={() => onHover(open, 'onMouseLeave')}
        >
          <HeadlessPopover.Button ref={setButtonRef}>{children}</HeadlessPopover.Button>
          <Transition show={open}>
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
