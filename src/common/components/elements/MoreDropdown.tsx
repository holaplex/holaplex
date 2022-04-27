import { Menu, Popover, Transition } from '@headlessui/react';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { ExplorerIcon } from '../icons/Explorer';
import { SolscanIcon } from '../icons/Solscan';
import { Fragment, useEffect, useState } from 'react';

function MoreDropdown({
  address,
  triggerButtonExtraClassNames,
}: {
  address: string;
  triggerButtonExtraClassNames?: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(`https://www.holaplex.com/nfts/${address}`);
    setLinkCopied(true);
  };
  return (
    <Popover as="div" className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cx(
              'flex h-10 w-10 items-center justify-center  rounded-full ',
              open ? 'bg-white' : '',
              triggerButtonExtraClassNames
            )}
          >
            {/* <span className={`${open ? 'text-black' : ''} text-lg font-medium`}>Share</span> */}
            <FeatherIcon
              icon="share"
              className={open && !triggerButtonExtraClassNames ? 'stroke-black' : ''}
              width={20}
              height={20}
            />
          </Popover.Button>

          {open && (
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              as={Fragment}
            >
              <Popover.Panel
                static
                as="ul"
                className="absolute right-0 top-12 z-10 w-56 rounded-lg bg-gray-900 p-4 text-base shadow-lg"
              >
                <li>
                  {linkCopied ? (
                    <div className="flex items-center">
                      <FeatherIcon icon="check" /> <span className="pl-5">Link copied</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCopyClick}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FeatherIcon width={16} height={16} icon="copy" />
                      <span className="pl-5">Copy link to NFT</span>
                    </button>
                  )}
                </li>
                <li>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Checkout this amazing NFT`
                    )}&hashtags=holaplex&url=${encodeURI(`https://holaplex.com/nfts/${address}`)}`}
                    className="flex items-center pt-4 hover:text-gray-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FeatherIcon height={16} width={16} icon={`twitter`} />

                    <span className="pl-5"> Share to Twitter</span>
                  </a>
                </li>
              </Popover.Panel>
            </Transition>
          )}
        </>
      )}
    </Popover>
  );
}

export default MoreDropdown;
