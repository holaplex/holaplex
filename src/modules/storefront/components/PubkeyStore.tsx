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
import { savePubkey } from '@/modules/storefront/actions'
import { useStorefrontContext } from '@/modules/storefront/components/Context';

type Props = {
  nextAction: () => void,
  backAction: () => void,
}

const PubkeyField = styled(TextInput)`
  margin-top: ${sv.appPadding}px;
`;

const PubkeyStore = ({nextAction, backAction}: Props) => {
  const {
    dispatch,
    pubkey,
    subdomain,
  } = useStorefrontContext();

  const updatePubkey = (pubkey: string) => {
    dispatch({
      type: 'UPDATE_PUBKEY',
      payload: {
        pubkey,
      },
    })
  }

  const handleNext = async (nextAction: Function) => {
    if (pubkey != '') {
      await savePubkey(subdomain, pubkey, dispatch)
      nextAction()
    }
  }

  return (
    // @ts-ignore
    <RoundedContainer small>
      <H2>Next register your pubkey.</H2>
      <Text>This is the pubkey of the storefront owner.</Text>
      <PubkeyField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePubkey(e.target.value)}
        value={pubkey}
      />
      <Actions>
        <Button
          label="Next"
          action={() => handleNext(nextAction)}
        />
      </Actions>
    </RoundedContainer>
  )
}

export default PubkeyStore;
