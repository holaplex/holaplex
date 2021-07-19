
import React, { useState, FunctionComponent } from 'react'
import { Form, Row, Space, FormInstance } from 'antd'
import Button from '@/components/elements/Button';
import { FormProps } from 'antd'
import { isNil } from 'ramda'

interface StepFormProps extends FormProps {
  children: React.ReactElement[]
  form: FormInstance
}

const StepForm = ({ children, onFinish, fields, form, ...props }: StepFormProps) => {
  const [page, changePage] = useState(0)
  const activePage = React.Children.toArray(children)[page]
  const isLastPage = page === React.Children.count(children) - 1

  const next = () => {
    changePage(Math.min(page + 1, children.length - 1))
  }

  const previous = () => {
    changePage(Math.max(page - 1, 0))
  }


  const handleSubmit = () => {
    if (isLastPage && onFinish) {
      onFinish(fields)
    } else {
      next()
    }
  }

  return (
    <Form
      {...props}
      form={form}
      fields={fields}
      onFinish={handleSubmit}
    >
      {activePage}
      <Row justify="end">
        <Space>
          {page > 0 && (
            <Button
              size="large"
              onClick={previous}
            >
              Back
            </Button>
          )}
          <Form.Item noStyle>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
            >
              {isLastPage ? "Submit" : "Next"}
            </Button>
          </Form.Item>
        </Space>
      </Row>
    </Form>
  )
}

export default StepForm