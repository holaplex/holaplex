import sv from '@/constants/Styles'
import styled from 'styled-components';
import Button from '@/components/elements/Button';
import TextInput from '@/components/elements/TextInput';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '@/constants/StyleComponents'
// @ts-ignore
import debounce from 'debounce'
import { checkStorefrontAvailability, createStorefront } from '@/modules/storefront/actions'
import { useStorefrontContext } from '@/modules/storefront/components/Context';

const NameField = styled(TextInput)`
  margin-top: ${sv.appPadding}px;
`;

const AvalabilityMessage = styled(Text)`
  text-align: right;
  margin: ${sv.grid}px 0 ${sv.appPadding}px 0;
`;

type Props = {
  nextAction: () => void,
  backAction: () => void,
}

const StepOne = ({nextAction, backAction}: Props) => {
  const {
    dispatch,
    available,
    desiredStorefrontSubdomain
  } = useStorefrontContext();

  const updateSubdomain = async (subdomain: string) => {
    dispatch({
      type: 'UPDATE_SUBDOMAIN_NAME',
      payload: {
        desiredStorefrontSubdomain: subdomain
      },
    })

    await debounce(checkStorefrontAvailability(subdomain, dispatch), 500)
  }

  const handleNext = async (nextAction: Function) => {
    if (available) {
      await createStorefront(desiredStorefrontSubdomain, dispatch)
      nextAction()
    }
  }

  return (
    // @ts-ignore
    <RoundedContainer small>
      <H2>Let&apos;s start with your sub-domain.</H2>
      <Text>This is the address that people will use to get to your store.</Text>
      <NameField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSubdomain(e.target.value)}
        value={desiredStorefrontSubdomain}
        subDomain=".holaplex.com"
      />
      { !!desiredStorefrontSubdomain.length &&
        <AvalabilityMessage noMargin color={available ? sv.colors.success : sv.colors.danger}>
          {available ? 'domain available' : 'domain already taken :-('}
        </AvalabilityMessage>
      }
      <Actions>
        <Button
          inactive={!available}
          label="Next"
          action={() => handleNext(nextAction)}
        />
      </Actions>
    </RoundedContainer>
  )
}

export default StepOne;
