import React, { DetailedHTMLProps, ImgHTMLAttributes, FC, useRef, useState } from 'react';
import { useOutsideAlerter } from '../../hooks/useOutsideAlerter';
import cx from 'classnames';
import { Close } from '../icons/Close';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';

interface NFTImageProps
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {}

const NFTImage: FC<NFTImageProps> = ({ src, onLoad, className, alt }) => {
  const [expanded, setExpanded] = useState(false);

  const expandedRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(expandedRef, () => setExpanded(false));
  return (
    <>
      <div className={`relative`}>
        <img onLoad={onLoad} src={src} className={className} alt={alt} />
        <div className={`absolute bottom-4 right-4`}>
          <button
            onClick={() => setExpanded(true)}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 bg-opacity-20 backdrop-blur-sm transition ease-in-out hover:scale-110`}
          >
            <FeatherIcon height={16} width={16} icon="maximize" />
          </button>
        </div>
      </div>
      <div
        role="dialog"
        className={cx(
          'fixed top-0 left-0 right-0 bottom-0',
          'bg-gray-800 bg-opacity-40 backdrop-blur-lg ',
          'transition-opacity duration-500 ease-in-out',
          'flex flex-col items-center justify-center',
          {
            'opacity-100': expanded,
            'opacity-0': !expanded,
            'pointer-events-auto': expanded,
            'pointer-events-none': !expanded,
            'z-50': expanded,
          }
        )}
      >
        <div
          ref={expandedRef}
          className={`relative z-50 flex aspect-auto w-full flex-col overflow-x-auto overflow-y-auto rounded-lg text-white shadow-md scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900 sm:h-auto sm:max-h-[60rem] sm:max-w-4xl`}
        >
          <div>
            <div className={`relative`}>
              <img
                onLoad={onLoad}
                src={src}
                className={`aspect-auto h-full w-full rounded-lg`}
                alt={alt}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTImage;
