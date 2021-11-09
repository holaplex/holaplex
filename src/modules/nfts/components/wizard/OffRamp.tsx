import styled from "styled-components";
import NavContainer from "@/modules/nfts/components/wizard/NavContainer";
import { StepWizardChildProps } from "react-step-wizard";
import { Divider, Input, PageHeader, FormInstance, Row } from "antd";
import { FormValues, MintDispatch } from "pages/nfts/new";
import { FormListFieldData } from "antd/lib/form/FormList";
import { NftPreviewGrid } from "@/common/components/elements/NftPreviewGrid";
import Paragraph from "antd/lib/typography/Paragraph";
import Button from "@/common/components/elements/Button";

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  clearForm: () => void;
}

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 500px;
  margin: 0 46px;
`;

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43px;
  color: #fff;
  padding-top: 10px;
  padding-left: 0;
`;

const FormWrapper = styled.div`
  width: 413px;

  .ant-form-item-label {
    font-weight: 900;
  }

  .ant-form-item-control-input-content {
    input,
    textarea {
      border-radius: 4px;
    }
    input {
      height: 50px;
    }
  }
`;

export default function OffRampScreen({ goToStep, clearForm, images }: Props) {
  const nrOfNfts = images.length;

  return (
    <NavContainer
      title={`🎉 You’ve minted ${nrOfNfts} NFTs!`}
      goToStep={goToStep}
      clearForm={clearForm}
      altClearText="Mint more NFTs"
    >
      <Row>
        <FormWrapper>
          <Header>
            Congratulations! You&apos;ve minted {nrOfNfts} NFT
            {nrOfNfts && "s"}
          </Header>
          <Paragraph
            style={{
              color: "#fff",
              opacity: 0.6,
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            They are available in your wallet. Now you can list them on your
            Holaplex store.
          </Paragraph>
          <Button type="primary">List on your Holaplex store</Button>
        </FormWrapper>
        <StyledDivider type="vertical" />
        <NftPreviewGrid images={images} />
      </Row>
    </NavContainer>
  );
}
