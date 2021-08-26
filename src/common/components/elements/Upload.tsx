import { Upload } from 'antd'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { isNil, set } from 'ramda'
import { initArweave } from '@/modules/arweave'
import { WalletContext } from '@/modules/wallet'

type UploadProps = {
  onChange?: (uploads: any) => any,
  className?: string,
  disabled?: boolean,
  value?: any,
  children?: React.ReactElement | boolean,
}

export default function FileUpload({
  children,
  value,
  onChange,
}: UploadProps) {
  const {
    arweaveBalance,
    displayArweaveRoadblock
  } = useContext(WalletContext)
  const handleInputChange = async (upload: any) => {
    const arweave = initArweave()
    const file = upload.file

    if (isNil(file)) {
      return
    }

    if (arweaveBalance === NaN || arweaveBalance <= 0) {
      displayArweaveRoadblock(true)
      return
    }

    const { api } = arweave.getConfig()

    const data = await file.arrayBuffer()
    const transaction = await arweave.createTransaction({ data })

    transaction.addTag("Content-Type", file.type)
    transaction.addTag("File-Name", file.name)

    await arweave.transactions.sign(transaction)

    let uploader = await arweave.transactions.getUploader(transaction)

    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      upload.onProgress({ percent: upload.ptcComplete })
    }

    const url = `${api.protocol}://${api.host}:${api.port}/${transaction.id}`

    const response = { name: file.name, type: file.type, url, uid: transaction.id }

    upload.onSuccess(response, file)
  }


  return (
    <Upload
      customRequest={handleInputChange}
      maxCount={1}
      onChange={({ fileList }: any) => { 
        if (isNil(onChange)) { 
          return
        }

        onChange(fileList)
      }}
      fileList={value}
    >
      {children}
    </Upload>
  )

}