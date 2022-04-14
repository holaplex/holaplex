import styled, { css } from 'styled-components';
import { WalletDisconnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { ButtonReset } from '@/common/styles/ButtonReset';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { TailSpin } from 'react-loader-spinner';

interface ButtonProps {
  children?: any;
  htmlType?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  secondary?: boolean;
  block?: boolean;
  size?: string;
  skeleton?: boolean;
  fixedWidth?: boolean;
  onClick?: () => any;
}

const Button = ({
  children,
  htmlType = 'button',
  disabled = false,
  loading = false,
  className = '',
  secondary = false,
  block = false,
  size = 'medium',
  skeleton = false,
  fixedWidth = false,
  onClick,
}: ButtonProps) => {
  const sizes = size === 'small' ? 'text-[85%] h-9 max-h-9 px-4' : 'h12 max-h-12 px-6';
  const colors = skeleton
    ? 'text-gray-500 bg-gray-500'
    : secondary
    ? 'text-white bg-black'
    : 'text-black bg-white';
  const display = block ? 'flex w-full' : 'inline-flex';
  const focusAndHover =
    skeleton || disabled || loading
      ? 'opacity-70'
      : `${
          secondary ? 'focus:border-[#72a4e1aa]' : 'focus:border-[#72a4e1]'
        } active:scale-[0.99] hover:opacity-100`;

  return (
    <button
      className={`${sizes} ${colors} ${display} ${focusAndHover} items-center justify-center rounded-full border-[3px] border-transparent py-1 opacity-90 transition-all ${className} ${
        fixedWidth && `w-32`
      } whitespace-nowrap border-opacity-10`}
      disabled={disabled}
      type={htmlType}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {loading && (
          <span className="absolute ">
            <TailSpin height="15" width="15" color="grey" ariaLabel="loading" />
          </span>
        )}
        <span className={loading ? 'ml-7' : ''}>{children}</span>
      </div>
    </button>
  );
};

export default Button;

const ButtonStyles = css`
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #171717;
`;

export const ButtonV3 = styled.button`
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #171717;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  /*
  &&:not([disabled]):hover {
    background-color: rgba(255, 255, 255, 0.8);
    color: #171717;
  }
  */
`;

export const SecondaryButtonV3 = styled.button`
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  background: #262626;
  display: flex;
  justify-content: center;
  align-items: center;
  &&:not([disabled]):hover {
    background-color: #666666;
    color: #ddd;
  }
`;

export const AnchorButton = styled.a`
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #171717;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  &&:not([disabled]):hover {
    background-color: rgba(255, 255, 255, 0.8);
    color: #171717;
  }
`;

export const SelectWalletButton = styled(WalletModalButton).attrs({
  children: 'Connect',
})`
  ${ButtonReset};
  border-radius: 18px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 2rem;
  padding-right: 2rem;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  color: #171717;
  background: #fff;
  display: flex;
  justify-content: center;
  &&:not([disabled]):hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export const ConnectWalletButton = styled(WalletModalButton).attrs({
  children: 'Connect',
})`
  ${ButtonReset};
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #171717;
  background: #fff;
  display: flex;
  justify-content: center;
  &&:not([disabled]):hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export const DisconnectWalletButton = styled(WalletDisconnectButton).attrs({
  children: 'Disconnect',
  endIcon: null as any,
  startIcon: null as any,
})`
  ${ButtonReset};
  background: #262626;
  box-sizing: border-box;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 500px;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
  flex: 1;
  &&:not([disabled]):hover {
    background-color: #363636;
  }
`;
