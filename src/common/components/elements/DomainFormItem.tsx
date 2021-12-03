import styled from 'styled-components';
import { Form } from 'antd';

const DomainFormItem = styled(Form.Item)`
  text-align: right;
  font-size: 24px;
  .ant-input {
    font-size: 24px;
    border-radius: 0px;
    border: none;
  }
  .ant-input-suffix {
    margin: 0;
    color: rgb(102, 102, 102);
  }
  .ant-form-item-explain {
    text-align: left;
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

export default DomainFormItem;
