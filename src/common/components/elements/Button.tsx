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
      color: black;
      &:hover,
      &:active,
      background: orange;
      &:focus {
        color: black;
        background: white;
      }
      &[disabled],
      &[disabled]:hover {
        background: white;
        color: black;

        &:hover,
        &:active,
        &:focus {
          background: white;
          color: black;

          &:hover,
          &:active,
          &:focus {
            background: white;
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
