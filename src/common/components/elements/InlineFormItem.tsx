import { FormItemProps, Form } from 'antd'
import styled from 'styled-components'

interface InlineFormItemProps extends FormItemProps {
  noBackground?: boolean;
}

const StyledFormItem = styled(Form.Item) <InlineFormItemProps>`
  &.ant-form-item {
    background: ${({ noBackground }) => noBackground ? "none" : "#e0e0e0"};
    border-radius: 12px;
    padding: 0 0 0 15px;
  }

  .ant-form-item-label {
    text-align: left;
  }

  .ant-input-focused {
    border: none;
  }
`

const InlineFormItem = (props: InlineFormItemProps) => {
  return (
    <StyledFormItem {...props} />
  )
}

export default InlineFormItem