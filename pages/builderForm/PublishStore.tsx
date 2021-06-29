import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '../../constants/StyleComponents'

type Props = {
  publishNow: () => void,
  publishLater: () => void,
}

const PublishStore = ({publishNow, publishLater}: Props) => (
  // @ts-ignore
  <RoundedContainer>
    <H2>That’s it, you’re all done!</H2>
    <Text>Once you click publish you will be redirected to your store. After that you can click on the menu in the upper right to access the settings for your store.</Text>
    <Actions>
      <Button
        label="Publish Later"
        subtle
        marginRight
        action={publishLater}
      />
      <Button
        label="Publish Your Store"
        action={publishNow}
      />
    </Actions>
  </RoundedContainer>
)

export default PublishStore;
