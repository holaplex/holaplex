import { FormItemProps, Form } from 'antd';
import styled from 'styled-components';

interface InlineFormItemProps extends FormItemProps {
  noBackground?: boolean;
}

const StyledFormItem = styled(Form.Item)<InlineFormItemProps>`
  &.ant-form-item {
    background: ${({ noBackground }) => (noBackground ? 'none' : '#e0e0e0')};
    border-radius: 12px;
    padding: 0 0 0 15px;
  }

  .ant-form-item-label {
    text-align: left;
  }

  .ant-input {
    border: none;
    &:focus {
      box-shadow: none;
    }
  }

  &.ant-form-item-with-help {
    margin-bottom: 24px;
  }

  &.ant-form-item-has-error :not(.ant-input-disabled).ant-input:focus,
  &.ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper:focus,
  &.ant-form-item-has-error :not(.ant-input-disabled).ant-input-focused,
  &.ant-form-item-has-error
    :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused {
    border: none;
    box-shadow: none;
  }
`;

const InlineFormItem = (props: InlineFormItemProps) => {
  return <StyledFormItem {...props} />;
};

export default InlineFormItem;
