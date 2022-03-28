import React from 'react';
import { Modal, Typography } from 'antd';
const { Paragraph } = Typography;

type HowToARModalProps = {
  show: boolean;
  onCancel: (event: any) => void;
};

const HowToArModal = ({ show, onCancel }: HowToARModalProps) => (
  <Modal
    title="Oh no! You need Arweave tokens!"
    closable={true}
    footer={[]}
    onCancel={onCancel}
    visible={show}
  >
    <Paragraph>
      Arweave (AR) token is available on Binance. If you are unable to access Binance please reach
      out to MaxJ on the
      <a href="https://discord.com/invite/holaplex" target="_blank" rel="noreferrer">
        &nbsp;Holaplex Discord server.
      </a>
    </Paragraph>
  </Modal>
);
export default HowToArModal;
