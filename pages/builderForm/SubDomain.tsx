import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import TextInput from '../../components/core/TextInput';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '../../constants/StyleComponents'

const NameField = styled(TextInput)`
  margin: ${sv.appPadding}px 0;
`;

type Props = {
  nextAction: () => void,
  backAction: () => void,
}

const StepOne = ({nextAction, backAction}: Props) => (
  <RoundedContainer small>
    <H2>Now for your sub-domain.</H2>
    <Text>This is the address that people will use to get to your store.</Text>
    <NameField subDomain=".holaplex.com" />
    <Actions>
      <Button
        label="Back"
        subtle
        marginRight
        action={backAction}
      />
      <Button
        label="Next"
        action={nextAction}
      />
    </Actions>
  </RoundedContainer>
)

export default StepOne;
