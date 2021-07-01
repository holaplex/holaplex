import { StorefrontTheme } from "@/modules/storefront/types";
// @ts-ignore
import Color from 'color'

const THEME_DEFAULTS = {
  backgroundColor: "#ffffff",
  primaryColor: "#000000"
}
export function stylesheet(theme: StorefrontTheme) {
  const {
    backgroundColor,
    primaryColor,
  } = {...THEME_DEFAULTS, ...theme}

  let contrastBackgroundColor = new Color(backgroundColor).darken(.4).hex()
  let lesserContrastBackgroundColor =  new Color(backgroundColor).darken(.2).hex()

  if (new Color(backgroundColor).isDark()) {
    contrastBackgroundColor = new Color(backgroundColor).lighten(.4).hex()
    lesserContrastBackgroundColor = new Color(backgroundColor).lighten(.2).hex()
  }

  return `body {
  background-color: ${backgroundColor};
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: ${contrastBackgroundColor};
  background: ${contrastBackgroundColor};
}
.artist-card .ant-card-body{
  background: ${lesserContrastBackgroundColor};
  background-color: ${lesserContrastBackgroundColor};
}
.ant-card-bordered {
  border-color: ${lesserContrastBackgroundColor};
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
}
` 
  }