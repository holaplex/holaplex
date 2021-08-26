import React from 'react';
import { Modal } from 'antd';
type Props = {
  isModalVisible: boolean;
}

const HowToArModal = (
  props: Props
  ) => (
		<Modal 
      title=""
      closable={false}
      footer={[]}
      visible={props.isModalVisible as boolean}>
			<h1> Oh no! You need Arweave tokens!</h1>
				<p>
					Arweave (AR) token is available on Binance. 
					If you are unable to access Binance please reach out to MaxJ on the 
					<a href="https://discord.gg/uwmpEmPs">
          &nbsp;Holaplex Discord server. 
					</a>
				</p>
		</Modal>
);
export default HowToArModal