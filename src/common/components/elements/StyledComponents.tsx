import sv from '../../constants/styles'
import styled from 'styled-components'
import { rgba } from 'polished'

const Container = styled.div`
  ${sv.bodyText};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ${sv.flexColumn};
`;

const GradientContainer = styled(Container)`
  background: linear-gradient(128.42deg, #841896 24.41%, #4F1364 83.01%);
`;

type ContentProps = {
  noPadding: boolean;
}

const Content = styled.div<ContentProps>`
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

type RoundedContainerProps = {
  small?: boolean;
}

const RoundedContainer = styled.div<RoundedContainerProps>`
  padding: ${sv.appPadding}px;
  border-radius: ${sv.grid*3}px;
  background: ${sv.colors.background};
  width: 100%;
  max-height: 100%;
  overflow: auto;
  max-width: ${props => props.small ? 760 : 1080}px;
`;

type ActionsProps = {
  noMargin?: boolean;
}

const Actions = styled.div<ActionsProps>`
  ${sv.flexRow};
  justify-content: space-between;
  margin-top: ${props => props.noMargin ? 0 : sv.appPadding}px;
`;

const ActionGroup = styled.div`
  ${sv.flexRow};
`;

type PageTitleProps = {
  invert?: boolean;
  center?: boolean;
}

const PageTitle = styled.div<PageTitleProps>`
  ${sv.title};
  color: ${props => props.invert ? sv.colors.background : sv.colors.text};
  text-align: ${props => props.center ? 'center' : 'left'};
  margin-bottom: ${sv.grid*2}px;
`
type SubTitleProps = {
  center?: boolean;
  invert?: boolean;
}

const SubTitle = styled.div<SubTitleProps>`
  ${sv.h3};
  text-align: ${props => props.center ? 'center' : 'left'};
  font-weight: 300;
  color: ${props => props.invert ? rgba(sv.colors.background, .6) : sv.colors.text};
  margin-bottom: ${sv.grid*2}px;
`

const SectionTitle = styled.div`
  ${sv.h2};
  margin-bottom: ${sv.grid}px;
`;

type LabelProps = {
  noMargin?: boolean;
}
const Label = styled.div<LabelProps>`
  ${sv.label};
  margin-bottom: ${props => props.noMargin ? 0 : sv.grid}px;
`;

type TextProps = {
  color?: string;
}
const Text = styled.div<TextProps>`
  ${sv.bodyText};
  line-height: 1.25;
  color: ${props => props.color || sv.colors.text};
`;

const H4 = styled.h4`
  ${sv.h4};
  margin: 0;
  color: ${props => props.color || sv.colors.text};
`;

const H3 = styled.h3`
  ${sv.h3};
  margin: 0;
  color: ${props => props.color || sv.colors.text};
`;

const H2 = styled.h2`
  ${sv.h2};
  margin: 0;
  color: ${props => props.color || sv.colors.text};
`;

const StandardLink = styled.a`
  text-decoration: underline;
  ${sv.bodyText};
  color: ${sv.colors.text};
  cursor: pointer;
  &:hover {
    color: ${sv.colors.ctaHover};
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
    color: ${sv.colors.ctaHover};
  }
`;

const Input = styled.input`
  background: ${sv.colors.cell};
  border: none;
  outline: none;
  padding: 16px 24px;
  height: 64px;
  text-height: 64px;
  margin: 0;
  ${sv.bodyText};
  ${sv.borderRadius};
`
type TagProps = {
  small?: boolean;
}

const Tag = styled.div<TagProps>`
  padding: ${props => props.small ? '0 4px' : '4px 8px'};
  border-radius: ${sv.grid*.5}px;
  background: ${props => props.color ? props.color : rgba(sv.colors.subtleText, .1)};
  color: ${sv.colors.subtleText};
  font-size: 14px;
  width: fit-content;
  white-space: nowrap;
  text-transform: lowercase;
`;

type CardProps = {
  inEffort?: boolean;
}

const Card = styled.div<CardProps>`
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
  GradientContainer,
  RoundedContainer,
  Content,
  SectionContent,
  SectionTitle,
  Actions,
  ActionGroup,
  PageTitle,
  SubTitle,
  Label,
  StandardLink,
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
