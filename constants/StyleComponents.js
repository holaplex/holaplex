import sv from './Styles'
import styled from 'styled-components';
import { rgba } from 'polished';

const Container = styled.div`
  ${sv.bodyText};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ${sv.flexColumn};
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: hidden;
  padding: 0 ${props => props.noPadding ? 0 : sv.appPadding}px;
  ${sv.box};
`;

const SectionContent = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${sv.appPadding}px;
  ${sv.box};
`;

const Actions = styled.div`
  ${sv.flexRow};
  justify-content: flex-end;
`;

const PageTitle = styled.div`
  ${sv.title};
  text-align: ${props => props.center ? 'center' : 'left'};
  margin-bottom: ${sv.grid*2}px;
`

const SubTitle = styled.div`
  ${sv.h3};
  text-align: ${props => props.center ? 'center' : 'left'};
  font-weight: 300;
  color: ${sv.colors.subtleText};
  margin-bottom: ${sv.grid*2}px;
`

const SectionTitle = styled.div`
  ${sv.h2};
  margin-bottom: ${sv.grid}px;
`;

const Label = styled.div`
  ${sv.label};
  margin-bottom: ${props => props.noMargin ? 0 : sv.grid}px;
`;

const Text = styled.div`
  ${sv.bodyText};
  line-height: 1.25;
  color: ${props => props.color || sv.colors.text};
`;

const H4 = styled.h4`
  ${sv.h4};
  margin: 0;
`;

const H3 = styled.h3`
  ${sv.h3};
  margin: 0;
`;

const H2 = styled.h2`
  ${sv.h2};
  margin: 0;
`;

const Link = styled.a`
  text-decoration: underline;
  ${sv.bodyText};
  color: ${sv.colors.text};
  cursor: pointer;
  &:hover {
    color: ${sv.colors.hoverCta};
  }
`;

const AddLink = styled.div`
  ${sv.flexRow};
  ${sv.label};
  width: fit-content;
  transition: color .15s ease-out;
  cursor: pointer;
  color: ${sv.colors.subtleText};
  svg {
    transition: color .15s ease-out;
    margin-right: ${sv.grid*.5}px;
    color: ${sv.colors.subtleText};
  }
  &:hover {
    color: ${sv.colors.cta};
    svg {
      color: ${sv.colors.cta}
    }
  }
`;

const ExternalLink = styled.a`
  text-decoration: none;
  ${sv.bodyText};
  color: ${sv.colors.cta};
  cursor: pointer;
  &:hover {
    color: ${sv.colors.hoverCta};
  }
`;

const Input = styled.input`
  background: ${sv.colors.cellDark};
  border: none;
  outline: none;
  padding: ${sv.grid}px;
  margin: 0;
  ${sv.bodyText};
  ${sv.borderRadius};
`

const Tag = styled.div`
  padding: ${props => props.small ? '0 4px' : '4px 8px'};
  border-radius: ${sv.grid*.5}px;
  background: ${props => props.color ? props.color : rgba(sv.colors.subtleText, .1)};
  color: ${sv.colors.subtleText};
  font-size: 14px;
  width: fit-content;
  white-space: nowrap;
  text-transform: lowercase;
`;

const Card = styled.div`
  transition: background .15s ease-out;
  padding: ${sv.grid*2}px;
  background: ${sv.colors.card};
  box-shadow: ${props => props.inEffort ? '' : `0 0 8px ${rgba(0,0,0,.15)}`};
  ${sv.borderRadius};
  margin-bottom: ${sv.grid}px;
  width: 100%;
  ${sv.box};
  cursor: pointer;
  &:hover {
    background: ${sv.colors.cellHover};
  }
`;

export {
  Container,
  Content,
  SectionContent,
  SectionTitle,
  Actions,
  PageTitle,
  SubTitle,
  Label,
  Link,
  Text,
  AddLink,
  ExternalLink,
  H4,
  H2,
  H3,
  Input,
  Tag,
  Card,
}
