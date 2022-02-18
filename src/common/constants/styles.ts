import { isBrowser } from 'react-device-detect';
import { lighten, rgba } from 'polished';
import { CSSObject } from 'styled-components';

const text = '#222222';
const subtleText = '#666666';
const buttonText = '#FFFFFF';
const background = '#fdfdfd';

const cta = '#D24089';
const ctaHover = `${lighten(0.05, cta)}`;
const subtleCta = 'rgba(45,156,219,.2)';

const mainGradient = 'linear-gradient(165.77deg, #D24089 8.62%, #B92D44 84.54%)';
const mainGradientHover = 'linear-gradient(10.77deg, #D24089 8.62%, #B92D44 84.54%)';
const mainGradientDisabled = `linear-gradient(10.77deg, ${lighten(0.1, '#D24089')} 8.62%, ${lighten(
  0.1,
  '#B92D44'
)} 84.54%)`;

const orangeGradient = 'linear-gradient(143.77deg, #D9B351 8.62%, #CA6128 84.54%)';
const purpleGradient = 'linear-gradient(128.42deg, #841896 24.41%, #4F1364 83.01%)';
const greenGradient = 'linear-gradient(143.77deg, #84DBC8 8.62%, #55AB86 84.54%)';

const cell = '#E0E0E0';
const cellHover = '#E3E3E3';
const cellSubtle = '#EDEDED';
const cellDark = '#9A9A9A';
const lightCell = '#434B6E';

const card = '#273156';
const cardDark = '#212B4B';
const cardLight = '#323B5E';

const danger = '#B8421C';
const success = '#6CB06B';
const warning = '#CAA535';

const radius = 8;
const grid = 8;
const buttonHeight = grid * 8;
const appPadding = isBrowser ? grid * 5 : grid * 3;
const titlePadding = isBrowser ? grid * 8 : grid * 5;
const sectionPadding = isBrowser ? grid * 14 : grid * 5;
const headerHeight = isBrowser ? grid * 12 : grid * 6;

const StyleVariables = {
  colors: {
    text: text,
    subtleText: subtleText,
    buttonText: buttonText,
    background: background,
    mainGradient: mainGradient,
    mainGradientHover: mainGradientHover,
    mainGradentDisabled: mainGradientDisabled,
    orangeGradient: orangeGradient,
    purpleGradient: purpleGradient,
    greenGradient: greenGradient,
    cta: cta,
    ctaHover: ctaHover,
    subtleCta: subtleCta,
    cell: cell,
    cellHover: cellHover,
    cellSubtle: cellSubtle,
    cellDark: cellDark,
    lightCell: lightCell,
    card: card,
    cardDark: cardDark,
    cardLight: cardLight,
    danger: danger,
    success: success,
    warning: warning,
  },

  radius: radius,
  grid: grid,
  buttonHeight: buttonHeight,
  appPadding: appPadding,
  titlePadding: titlePadding,
  sectionPadding: sectionPadding,
  headerHeight: headerHeight,

  title: {
    color: text,
    fontWeight: 800,
    fontSize: 60,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  } as CSSObject,

  h1: {
    color: text,
    fontWeight: '800',
    fontSize: 48,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  },

  h2: {
    color: text,
    fontWeight: 800,
    fontSize: 40,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  } as CSSObject,

  h3: {
    color: text,
    fontWeight: 800,
    fontSize: 32,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  } as CSSObject,

  h4: {
    color: text,
    fontWeight: 700,
    fontSize: 24,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  } as CSSObject,

  bodyText: {
    color: text,
    fontSize: 18,
    lineHeight: '1.25em',
    letterSpacing: 0.2,
  } as CSSObject,

  label: {
    color: subtleText,
    fontSize: 14,
    lineHeight: '1.25em',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  } as CSSObject,

  error: {
    color: warning,
    margin: '10px 0',
  } as CSSObject,

  success: {
    color: success,
    margin: '10px 0',
  } as CSSObject,

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } as CSSObject,

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  } as CSSObject,

  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSObject,

  box: {
    boxSizing: 'border-box',
  } as CSSObject,

  borderRadius: {
    borderRadius: radius + 'px',
  } as CSSObject,

  transition: {
    transition: 'all .15s ease-out',
  } as CSSObject,

  buttonBase: {
    height: buttonHeight,
    background: cta,
    color: buttonText,
    border: 'none',
    padding: `0 ${grid * 2}px`,
    fontSize: 16,
    fontWeight: 400,
    transition: 'all .2s ease-out',
    cursor: 'pointer',
    width: 'fit-content',
    borderRadius: radius + 'px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  } as CSSObject,

  pageLayout: {
    height: '100%',
    width: '100%',
    maxWidth: 850,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: grid * 4,
  } as CSSObject,

  inputField: {
    height: buttonHeight,
    padding: `${grid * 2}px ${grid * 3}px;`,
    background: cell,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    input: {
      fontSize: grid * 3,
    },
  } as CSSObject,

  borderStyle: `1px solid rgba(255,255,255,.1)`,

  shadow: {
    boxShadow: `0 0 8px ${rgba(0, 0, 0, 0.15)}`,
  } as CSSObject,
};

export default StyleVariables;
