import styled from 'styled-components';
import { Form } from 'antd';

const DomainFormItem = styled(Form.Item)`
  text-align: right;
  .ant-input {
    border-radius: 0px;
    border: none;
  }
  .ant-input-suffix {
    margin: 0;
    color: rgb(102, 102, 102);
  }
  .ant-input-affix-wrapper {
    border: 1px solid #333;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  #subdomain {
    box-shadow: none;
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
