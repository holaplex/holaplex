import React, { useState, FunctionComponent } from 'react'
import { Form } from 'react-final-form'
import styled from 'styled-components'
import { Storefront } from '@/modules/storefront/types'
import Button from '@/components/elements/Button';
import { Actions, ActionGroup } from '@/constants/StyleComponents'

const BackButton = styled(Button)`
  margin: 0 20px 0 0;
`;

const ErrorMessage = styled.div`
  color: red;
`;
type WizardFormProps = {
  onSubmit: (storefront: Storefront) => any,
  initialValues: Storefront,
  children: React.ReactNodeArray 
}
const Wizard: FunctionComponent<WizardFormProps> = ({ onSubmit, initialValues, children }) => {
  const [page, changePage] = useState(0)
  const [values, updateValues] = useState(initialValues || {})
  const activePage = React.Children.toArray(children)[page]
  const isLastPage = page === React.Children.count(children) - 1

  const next = (values: Storefront) => {
    changePage(Math.min(page + 1, children.length - 1))
    updateValues(values)
  }

  const previous = () => {
    changePage(Math.max(page - 1, 0)) 
  }

  const validate = async (values: Storefront) => {
    const activePage = React.Children.toArray(children)[
      page
    ]

    if(activePage.props.validate) {
      const errors = await activePage.props.validate(values)
      return errors
    }
    
    return {}
  }

  const handleSubmit = (values: Storefront) => {
    if (isLastPage) {
      return onSubmit(values)
    } else {
      next(values)
    }
  }

  return (
    <Form
      initialValues={values}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, submitting, pristine, valid, errors }) => {
        return (
          <form onSubmit={handleSubmit}>
            {activePage}
            <Actions>
              <ActionGroup>
                {errors && <ErrorMessage>{Object.entries(errors).map(([_, value]) => value)}</ErrorMessage>}
              </ActionGroup>
              <ActionGroup>
                {page > 0 && (
                  <BackButton
                    subtle
                    disabled={false}
                    label="Back"
                    onClick={previous}
                  />
                )}
                <Button
                  label={isLastPage ? "Submit": "Next"}
                  onClick={handleSubmit}
                  disabled={!isLastPage && (submitting || pristine || !valid)}
                />
              </ActionGroup>
            </Actions>
          </form>
        )
      }}
    </Form>
  )
}

export default Wizard