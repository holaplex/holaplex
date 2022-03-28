import { Menu } from '@headlessui/react';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { ExplorerIcon } from '../icons/Explorer';
import { SolscanIcon } from '../icons/Solscan';

function MoreDropdown({ address }: { address: string }) {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={cx(
              'flex h-10 w-10 items-center justify-center rounded-full',
              open ? 'bg-white' : ''
            )}
          >
            <FeatherIcon icon="more-horizontal" className={open ? 'stroke-black' : ''} />
          </Menu.Button>
          {open && (
            <Menu.Items
              static
              as="ul"
              className=" absolute right-5 top-12 z-10 w-56 rounded border border-white bg-black p-4"
            >
              <Menu.Item as="li">
                <button onClick={() => {}} className="flex items-center">
                  <FeatherIcon icon="copy" />
                  <span className="pl-5">Copy link to NFT</span>
                </button>
              </Menu.Item>
              <Menu.Item as="li">
                <a
                  href={`https://explorer.solana.com/address/${address}`}
                  className="flex items-center"
                >
                  <ExplorerIcon />
                  <span className="pl-5">View on Explorer</span>
                </a>
              </Menu.Item>
              <Menu.Item as="li">
                <a href={`https://solscan.io/account/${address}`} className="flex items-center">
                  <SolscanIcon />
                  <span className="pl-5">View on SolScan</span>
                </a>
              </Menu.Item>
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
}

export default MoreDropdown;
