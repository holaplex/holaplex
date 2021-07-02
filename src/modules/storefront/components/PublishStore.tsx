import Button from '@/components/elements/Button';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '@/constants/StyleComponents'
import { useStorefrontContext } from '@/modules/storefront/components/Context'
import { useRouter } from 'next/router'

type Props = {
  publishNow: () => void,
  publishLater: () => void,
}

const PublishStore = ({publishNow, publishLater}: Props) => {
  const router = useRouter()

  const {
    subdomain
  } = useStorefrontContext()

  return (
    // @ts-ignore
    <RoundedContainer>
      <H2>All done!</H2>
      <Text>The storefront is ready for the artist to connect to the Solana Blockchain.</Text>
      <Actions>
        <Button
          label="Visit Storefront"
          action={() => { window.open(`https://${subdomain}.holaplex.com`) }}
        />
      </Actions>
    </RoundedContainer>
  )
}

export default PublishStore;
