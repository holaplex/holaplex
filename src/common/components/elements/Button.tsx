import styled, { css } from 'styled-components'
import { Button } from 'antd'
import { equals } from 'ramda'

const StyledButton = styled(Button)`{
  ${({ type }) => equals("primary", type) && css`
      &:hover, &:active, &:focus {
        background: linear-gradient(10.77deg, rgb(210, 64, 137) 8.62%, rgb(185, 45, 68) 84.54%);
      }
  `}
`

export default StyledButton