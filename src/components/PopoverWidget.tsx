import { Popover, Transition } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';

interface PopoverProps {
  children: React.ReactElement;
  content: React.ReactElement;
  isShowOnHover?: boolean;
}

const PopoverWidget = ({ children, content, isShowOnHover = false }: PopoverProps) => {
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
    <Popover className="relative">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, 'onMouseEnter')}
          onMouseLeave={() => onHover(open, 'onMouseLeave')}
        >
          <Popover.Button ref={setButtonRef}>{children}</Popover.Button>
          <Transition show={open}>
            <Popover.Panel
              static={isShowOnHover}
              className="absolute z-10"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              {content}
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default PopoverWidget;
