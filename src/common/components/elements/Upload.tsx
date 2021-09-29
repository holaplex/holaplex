import { Upload } from 'antd';
import { isNil } from 'ramda';
import React, { useRef } from 'react';

type UploadProps = {
  onChange?: (uploads: any) => any;
  className?: string;
  disabled?: boolean;
  value?: any;
  children?: React.ReactElement | boolean;
};

export default function FileUpload({ children, value, onChange }: UploadProps) {
  const fileUrlRef = useRef<string | undefined>(undefined);

  const handleInputChange = async (upload: any) => {
    const file = upload.file;

    if (isNil(file)) {
      return;
    }

    if (!isNil(fileUrlRef.current)) {
      URL.revokeObjectURL(fileUrlRef.current);
    }

    fileUrlRef.current = URL.createObjectURL(file);
    upload.onSuccess({ file: file, url: fileUrlRef.current }, file);
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
