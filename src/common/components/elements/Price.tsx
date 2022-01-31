import styled from 'styled-components';

type PriceProps = {
  size: number;
  price: number;
};

type InlineProps = {
  size: number;
};

const StyledSvg = styled.svg<InlineProps>`
  width: calc(${({ size }) => size}px * 0.85);
  height: calc(${({ size }) => size}px * 0.85);
  margin-right: calc(${({ size }) => size}px / 3);
`;

const StyledPriceNumber = styled.span<InlineProps>`
  font-size: ${({ size }) => size}px;
`;

const Price = (props: PriceProps) => {
  return (
    <div className="flex items-center">
      <StyledSvg
        viewBox="0 0 146 146"
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinejoin: 'round',
          strokeMiterlimit: 2,
        }}
        size={props.size}
      >
        <path
          d="M360.905 273.786c.711 0 1.319.252 1.825.756a2.48 2.48 0 0 1 .759 1.822 2.48 2.48 0 0 1-.759 1.823 2.493 2.493 0 0 1-1.825.756 2.488 2.488 0 0 1-1.82-.756 2.48 2.48 0 0 1-.758-1.823c0-.714.252-1.323.755-1.825a2.49 2.49 0 0 1 1.823-.753Zm0 4.717c.586 0 1.089-.21 1.508-.63.42-.42.63-.923.63-1.509a2.06 2.06 0 0 0-.627-1.511 2.058 2.058 0 0 0-1.511-.627c-.582 0-1.083.21-1.503.63-.42.42-.63.923-.63 1.508 0 .586.21 1.089.63 1.509.42.42.921.63 1.503.63Zm0-3.422c.355 0 .659.126.911.378s.378.554.378.905c0 .356-.126.659-.378.909s-.556.375-.911.375c-.352 0-.654-.126-.906-.378a1.236 1.236 0 0 1-.378-.906c0-.351.126-.653.378-.905s.554-.378.906-.378Zm0 2.121a.818.818 0 0 0 .597-.243.804.804 0 0 0 .246-.595.803.803 0 0 0-.246-.594.818.818 0 0 0-.597-.243.812.812 0 0 0-.592.243.803.803 0 0 0-.246.594c0 .235.082.433.246.595a.812.812 0 0 0 .592.243Z"
          style={{
            fillRule: 'nonzero',
            fill: 'currentcolor',
          }}
          transform="translate(-10120.482 -7732.751) scale(28.2437)"
        />
      </StyledSvg>
      <StyledPriceNumber size={props.size}>{props.price}</StyledPriceNumber>
    </div>
  );
};

export default Price;
