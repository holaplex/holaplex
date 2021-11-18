import styled, { css } from 'styled-components';
import { Button } from 'antd';
import { equals } from 'ramda';

const StyledButton = styled(({ noStyle, ...rest }) => <Button {...rest} />)<{ noStyle?: boolean }>`
  font-weight: 500;
  color: #000;
  &:hover,
  &:active,
  &:focus {
    color: #000;
    background: rgba(255, 255, 255, 0.8);
  }
  &.ant-btn-icon-only {
    width: 52px;
  }
  ${({ type }) =>
    equals('primary', type) &&
    css`
      color: white;
      &:hover,
      &:active,
      &:focus {
        color: #fff;
        background: linear-gradient(10.77deg, rgb(210, 64, 137) 8.62%, rgb(185, 45, 68) 84.54%);
      }
      &[disabled],
      &[disabled]:hover {
        background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
        color: #fff;

        &:hover,
        &:active,
        &:focus {
          color: #fff;
          background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
          color: #fff;

          &:hover,
          &:active,
          &:focus {
            background: linear-gradient(
              10.77deg,
              rgb(220, 105, 163) 8.62%,
              rgb(210, 71, 94) 84.54%
            );
          }
        }
      }
    `}

  ${({ noStyle }) =>
    noStyle &&
    css`
      background: none;
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: normal;
    `}
`;

export default StyledButton;
