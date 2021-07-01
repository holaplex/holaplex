import Button from '@/components/elements/Button';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '@/constants/StyleComponents'

type Props = {
  publishNow: () => void,
  publishLater: () => void,
}

const PublishStore = ({publishNow, publishLater}: Props) => (
  // @ts-ignore
  <RoundedContainer>
    <H2>Almost done!</H2>
    <Text>The storefront is themed but there is no pubkey associated to it yet. Reach out to our team to activate the storefront.</Text>
    <Actions>
      <Button
        label="Back to Home"
        action={publishNow}
      />
    </Actions>
  </RoundedContainer>
)

export default PublishStore;
