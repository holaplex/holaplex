import Modal, { ModalFuncProps } from 'antd/lib/modal/Modal';

import { Layout, Space } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';
const { Header, Content } = Layout;

const HolaLink = styled(Paragraph)`
  cursor: pointer;
  background: linear-gradient(143.77deg, #d24089 8.62%, #b92d44 84.54%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
export default function PartnerWithUsModal(props: ModalFuncProps) {
  return (
    <Modal
      width={668}
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      footer={null}
      style={{
        position: 'absolute',
      }}
    >
      <Header>Partner with us</Header>

      <Content>
        Our mission is to empower creators and collectors by building a suite of integrated tools to
        mint, discover, and sell NFTs.
      </Content>
      <HolaLink>Learn More</HolaLink>
    </Modal>
  );
}
