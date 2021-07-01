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
    logoUrl,
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
.title {
  width: 42px;
  height: 42px;
  background: url(${logoUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
<<<<<<< HEAD
  }
=======
  }

  function shadeColor(color: string, percent: number) {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);
  
    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;
  
    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  
  
    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  
    return "#"+RR+GG+BB;
  }
>>>>>>> 8d078afe40bee1f71970dda98ac81bfe0d2d899e
