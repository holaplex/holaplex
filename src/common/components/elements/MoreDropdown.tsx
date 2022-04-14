import { Menu, Popover, Transition } from '@headlessui/react';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { ExplorerIcon } from '../icons/Explorer';
import { SolscanIcon } from '../icons/Solscan';
import { Fragment, useEffect, useState } from 'react';

function MoreDropdown({ address }: { address: string }) {
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
              'flex h-10 w-10 items-center justify-center rounded-full ',
              open ? 'bg-white' : ''
            )}
          >
            <FeatherIcon icon="more-horizontal" className={open ? 'stroke-black' : ''} />
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
                className="absolute right-0 top-12 z-10 w-56 rounded-lg bg-gray-800 p-4 text-base shadow-lg"
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
                    href={`https://explorer.solana.com/address/${address}`}
                    className="flex items-center pt-4 hover:text-gray-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExplorerIcon width={16} height={16} />
                    <span className="pl-5">View on Explorer</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://solscan.io/account/${address}`}
                    className="flex items-center pt-4 hover:text-gray-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SolscanIcon width={16} height={16} />
                    <span className="pl-5">View on SolScan</span>
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
