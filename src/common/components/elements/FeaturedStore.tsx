import React, {useState} from 'react'
import styled from 'styled-components'
import FeatherIcon from 'feather-icons-react'

type ContainerProps = {
  expand?: boolean,
}
const Container = styled.div<ContainerProps>`
  background: #222;
  position: relative;
  border-radius: 8px;
  overflow: visible;
  transition: all .2s ease-out;
  cursor: pointer;
  z-index: ${({expand}) => expand ? '100' : '1'};
  .expand-icon {display: none;}
  &:hover {
    transform: scale(1.01);
    .expand-icon {display: flex;}
  }
`;

type ImgContainerProps = {
  isLandscape?: boolean,
  expand?: boolean,
}
const ImgContainer = styled.div<ImgContainerProps>`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: visible;
  border-radius: 8px 8px 0 0;
  .inner {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content:  center;
    overflow: ${({expand}) => expand ? 'visible' : 'hidden'};
    border-radius: 8px 8px 0 0;
    img {
      position: absolute;
      width: ${({isLandscape}) => isLandscape ? 'auto' : '100%'};
      height: ${({isLandscape}) => isLandscape ? '100%' : 'auto'};
      box-shadow: ${({expand}) => expand ? '0 0 12px rgba(0,0,0,.5)' : 'none'};
      border-radius: 2px;
    }
  }

`;

const ExpandIcon = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  color: #000;
  background: #fff;
  z-index: 101;
  height: 18px;
  width: 18px;
  align-items: center;
  justify-content: center;
  opacity: 1;
  border-radius: 4px;
  &:hover {
    opacity: .5;
  }
`;

const Info = styled.div`
  padding: 16px;
  display: flex;
  color: #fff;
  font-size: 12px;
`;

const Name = styled.div`
  margin-right: auto;
  color: rgba(255,255,255,.6);
`;

const Twitter = styled.div`
  display: flex;
  color: rgba(255,255,255,.6);
`;

type Props = {
  image?: string,
  name?: string,
  twitter?: string
}

export default function FeaturedStore({image, name, twitter}: Props) {

  const [isLandscape, setIsLandscape] = useState(false)
  const [isSquare, setIsSquare] = useState(false)
  const [showExpanded, setShowExpanded] = useState(false)

  const onImgLoad = (e:any) => {
    setIsLandscape(e.target.offsetWidth > e.target.offsetHeight)
    setIsSquare(e.target.offsetWidth == e.target.offsetHeight)
  }

  return (
    <Container expand={showExpanded}>
      <ImgContainer
        isLandscape={isLandscape}
        expand={showExpanded}
      >
        <div className="inner">
          <img onLoad={onImgLoad} src={image} />
        </div>

        {!isSquare &&
          <ExpandIcon
            className="expand-icon"
            onMouseEnter={() => setShowExpanded(true)}
            onMouseLeave={() => setShowExpanded(false)}
          >
            <FeatherIcon icon="maximize" size={12} />
          </ExpandIcon>
        }
      </ImgContainer>
      <Info>
        <Name>{name}</Name>
      </Info>
    </Container>
  );
}
