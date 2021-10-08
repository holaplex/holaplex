import styled, { css } from 'styled-components';
import { Button } from 'antd';
import { equals } from 'ramda';

const StyledButton = styled(Button)<{ noStyle?: boolean }>`
  &:hover,
  &:active,
  &:focus {
    color: #fff;
    background: rgb(129, 129, 129);
  }
  &.ant-btn-icon-only {
    width: 52px;
  }
  ${({ type }) =>
    equals('primary', type) &&
    css`
      &:hover,
      &:active,
      &:focus {
        background: linear-gradient(10.77deg, rgb(210, 64, 137) 8.62%, rgb(185, 45, 68) 84.54%);
      }
      &[disabled],
      &[disabled]:hover {
        background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
        color: #fff;

        &:hover,
        &:active,
        &:focus {
          background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
        }
      }
    `}
  ${({ type }) =>
    equals('white', type) &&
    css`
      background: #ffffff;
      color: #d24089;
      &:hover,
      &:active,
      &:focus {
        background: #ffffff;
        color: #d24089;
      }
      &[disabled],
      &[disabled]:hover {
        background: rgba(255, 255, 255, 0.5);
        color: #d24089;
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
