import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import TextInput from '../../components/core/TextInput';
import {
  Text,
  H2,
  Actions
} from '../../constants/StyleComponents'

const NameField = styled(TextInput)`
  margin: ${sv.appPadding}px 0;
`;

type Props = {
  nextAction: () => void,
}

const StepOne = ({nextAction}: Props) => (<>
  <H2>Let’s start by naming your store.</H2>
  <Text>This is the name the people will see inside your store and also on our registry of stores.</Text>
  <NameField placeholder="e.g. Cat NFT Warehouse" />
  <Actions>
    <Button
      label="Cancel"
      subtle
      marginRight
      action={() => console.log('go back')}
    />
    <Button
      label="Next"
      action={nextAction}
    />
  </Actions>
</>)

export default StepOne;
