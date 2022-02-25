import React, { useState, FunctionComponent } from 'react';
import { Form, Row, Space, FormInstance } from 'antd';
import Button from '@/components/elements/Button';
import { FormProps } from 'antd';
import { useRouter } from 'next/router';

interface StepFormProps extends FormProps {
  children: React.ReactElement[];
  form: FormInstance;
  submitting: boolean;
}

const StepForm = ({ children, onFinish, submitting, fields, form, ...props }: StepFormProps) => {
  const [page, changePage] = useState(0);
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;
  const router = useRouter();

  const next = () => {
    changePage(Math.min(page + 1, children.length - 1));
  };

  const previous = () => {
    changePage(Math.max(page - 1, 0));
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      if (isLastPage && onFinish) {
        onFinish(fields);
      } else {
        next();
      }
    });
  };

  return (
    <div className="max-width-medium">
      <Form {...props} form={form} fields={fields} onFinish={handleSubmit}>
        {activePage}
        <Row justify="end">
          <Space size="middle">
            {
              <Button
                onClick={page > 0 ? previous : router.back}
                disabled={submitting}
                secondary={true}
              >
                {page > 0 ? 'Back' : 'Cancel'}
              </Button>
            }
            <Form.Item noStyle>
              <Button
                htmlType="submit"
                disabled={submitting || form.isFieldsValidating(fields?.map((x) => x.name) || [])}
                loading={submitting}
              >
                {isLastPage ? 'Submit' : 'Next'}
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    </div>
  );
};

export default StepForm;
