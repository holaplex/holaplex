import shadeColor from './shadeColor'
import saveFile from './saveFile'

export default async function updateThemeCss(
    theme: object,
    subdomain: string,
    pubkey: string,
  ) {
  const {
    backgroundColor,
    primaryColor,
  } = theme
  const templateString = `
    body {
      background-color: ${backgroundColor};
    }

    .app-bar-box, .ant-card-meta, .ant-card-cover {
      background-color: ${shadeColor(backgroundColor, 40)};
      background: ${shadeColor(backgroundColor, 40)};
    }
    .artist-card .ant-card-body{
      background: ${shadeColor(backgroundColor, 20)};
      background-color: ${shadeColor(backgroundColor, 20)};
    }
    .ant-card-bordered {
      border-color: ${shadeColor(backgroundColor, 20)};
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
      color: ${primaryColor};
    }` 
  
    return saveFile(templateString, subdomain, pubkey)
}