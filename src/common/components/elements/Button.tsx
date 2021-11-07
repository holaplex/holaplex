import styled, { css } from 'styled-components'
import { Button } from 'antd'
import { equals } from 'ramda'

const StyledButton = styled(Button)`{
  font-weight: 500;
  color: #000;
  &:hover {
    color: #000;
    background; rgba(255, 255, 255, 0.8);
  }
  &.ant-btn-icon-only {
    width: 52px;
  }
  ${({ type }) => equals("primary", type) && css`
    &:hover, &:active, &:focus {
      background: linear-gradient(10.77deg, rgb(210, 64, 137) 8.62%, rgb(185, 45, 68) 84.54%);
    }
    &[disabled], &[disabled]:hover {
      background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
      color: #fff;

      &:hover, &:active, &:focus {
        background: linear-gradient(10.77deg, rgb(220, 105, 163) 8.62%, rgb(210, 71, 94) 84.54%);
      }
    }
  `}
`

export default StyledButton
