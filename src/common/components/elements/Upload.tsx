import { uploadFile } from '@/modules/arweave/upload';
import { Upload } from 'antd';
import { isNil } from 'ramda';
import React from 'react';
import { toast } from 'react-toastify';
import { useWallet } from '@solana/wallet-adapter-react';

type UploadProps = {
  onChange?: (uploads: any) => any;
  className?: string;
  disabled?: boolean;
  value?: any;
  children?: React.ReactElement | boolean;
  dragger?: boolean;
};

export default function FileUpload({ children, value, onChange, dragger = false }: UploadProps) {
  const {
    wallet: userWallet,
    publicKey,
    connected,
    signAllTransactions,
    signMessage,
    signTransaction,
    connect,
  } = useWallet();
  const handleInputChange = async (upload: any) => {
    const file = upload.file;

    if (isNil(file)) {
      return;
    }

    uploadFile({
      wallet: {
        wallet: userWallet,
        publicKey,
        connected,
        connect,
        signAllTransactions,
        signTransaction,
        signMessage,
      },
      file,
      onProgress: (_status, pct) => upload.onProgress({ percent: (pct ?? 0) * 100 }),
    })
      .then((res) => {
        upload.onSuccess(res, file);
      })
      .catch((e) => {
        console.error(e);
        upload.onError(e);
        toast.error(<>{e instanceof Error ? e.message : 'Upload to Arweave failed.'}</>);
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
