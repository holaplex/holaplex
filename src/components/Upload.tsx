import { uploadFile } from '@/modules/arweave/upload';
import ipfsSDK from '@/modules/ipfs/client';
import { WalletContext } from '@/modules/wallet';
import { Upload } from 'antd';
import { isNil } from 'ramda';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

type UploadProps = {
  onChange?: (uploads: any) => any;
  className?: string;
  disabled?: boolean;
  value?: any;
  children?: React.ReactElement | boolean;
  dragger?: boolean;
};

export default function FileUpload ({ children, value, onChange, dragger = false }: UploadProps) {
  const { solana } = useContext(WalletContext);

  const handleInputChange = async (upload: any) => {
    const file = upload.file;

    if (isNil(file)) {
      return;
    }

    ipfsSDK
      .uploadFile(file)
      .then(res => {
        let resp = res
        resp['url'] = resp['uri']
        upload.onSuccess(resp, file);
      })
      .catch(e => {
        console.error(e);
        upload.onError(e);
        toast.error(<>{e instanceof Error ? e.message : 'Upload to ipfs failed.'}</>);
      });
  };

  const Component = dragger ? Upload.Dragger : Upload;

  return (
    <Component
      customRequest={handleInputChange}
      maxCount={1}
      onChange={({ fileList }: any) => {
        if (isNil(onChange)) {
          return;
        }

        onChange(fileList);
      }}
      fileList={value}
    >
      {children}
    </Component>
  );
}
