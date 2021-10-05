import { uploadFile } from '@/modules/arweave/upload';
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
};

export default function FileUpload({ children, value, onChange }: UploadProps) {
  const { solana } = useContext(WalletContext);

  const handleInputChange = async (upload: any) => {
    const file = upload.file;

    if (isNil(file)) {
      return;
    }

    uploadFile({
      solana,
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

  return (
    <Upload
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
    </Upload>
  );
}
