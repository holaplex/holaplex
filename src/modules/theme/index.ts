import { StorefrontTheme } from "@/modules/storefront/types";
// @ts-ignore
import { rgba } from 'polished';
// @ts-ignore
import Color from 'color'

const encodeFile = async (blob: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result)
    }
  });
}

export async function stylesheet({ backgroundColor, primaryColor, logo }: StorefrontTheme) {
  const encodedLogo = await encodeFile(logo)

  let contrastBackgroundColor = new Color(backgroundColor).darken(.2).hex()
  let lesserContrastBackgroundColor =  new Color(backgroundColor).darken(.1).hex()
  let textColor = '#000000'
  let subtleTextColor = rgba('#000000', .6)
  let buttonTextColor = '#000000'
  let primaryHoverColor = new Color(primaryColor).darken(.2).hex()
  let boxShadow = '0 0 16px rgba(0,0,0,.3)'

  if (new Color(backgroundColor).isDark()) {
    contrastBackgroundColor = new Color(backgroundColor).lighten(.4).hex()
    lesserContrastBackgroundColor = new Color(backgroundColor).lighten(.2).hex()
    textColor = '#FFFFFF'
    subtleTextColor = rgba('#FFFFFF', .6)
    boxShadow = '0 0 16px rgba(0,0,0,.8)'
  }

  if (new Color(primaryColor).isDark()) {
    buttonTextColor = '#FFFFFF'
  }

  const themeCss = `body {
    background-color: ${backgroundColor};
  }
  .title {
    width: 42px;
    height: 42px;
    background: url(${encodedLogo});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: fit;
  }
  .app-bar-box, .ant-card-meta, .ant-card-cover {
    box-shadow: none;
    background-color: ${contrastBackgroundColor};
    background: ${contrastBackgroundColor};
  }
  .artist-card, .artist-card:hover {
    box-shadow: none;
  }
  .ant-card-hoverable, .ant-card-hoverable:hover {
    box-shadow: none;
  }
  .artist-card .ant-card-body{
    background: ${lesserContrastBackgroundColor};
    background-color: ${lesserContrastBackgroundColor};
    box-shadow: none !important;
  }
  .app-bar-box .ant-btn {
    color: ${textColor};
  }
  .app-bar-box .ant-btn:hover {
    color: ${primaryColor};
  }
  .ant-btn-primary {
    background: ${primaryColor} !important;
    color: ${buttonTextColor} !important;
    border: 0;
    box-shadow: none;
  }
  .ant-btn-primary:hover {
    background: ${primaryHoverColor} !important;
    color: ${buttonTextColor} !important;
  }
  .divider {
    border-color: ${backgroundColor};
  }
  .ant-card-bordered, .ant-tabs-nav::before {
    border-color: ${lesserContrastBackgroundColor} !important;
  }
  .ant-card-bordered:hover {
    border-color: ${primaryColor} !important;
  }
  .ant-tabs-ink-bar {
    background: ${primaryColor};
  }
  p {
    color: ${subtleTextColor};
  }
  .ant-popover-inner {
    box-shadow: ${boxShadow};
  }
  .auction-container {
    background: ${contrastBackgroundColor};
    color: ${textColor};
  }
  h6,
  h2,
  h4,
  .art-title,
  .cd-number,
  .tab-title,
  .title,
  .app-btn,
  .ant-tabs-tab-active .tab-title,
  .artist-card-name,
  .ant-card-meta-title {
    color: ${textColor};
  }
  `

  console.log(themeCss);

  return themeCss
}
