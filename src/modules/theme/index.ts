import { StorefrontTheme } from "@/modules/storefront/types";
// @ts-ignore
import { rgba } from 'polished';
// @ts-ignore
import Color from 'color'
import { pipe, map, replace, join } from 'ramda'

const joinFonts = pipe(map(replace(/\s+/g, '+')), join("&family="))


export function variables({ backgroundColor, primaryColor, textFont, titleFont, logo }: StorefrontTheme): string {
  let contrastBackgroundColor = new Color(backgroundColor).darken(.1).hex()
  let lesserContrastBackgroundColor =  new Color(backgroundColor).darken(.05).hex()
  let textColor = '#000000'
  let subtleTextColor = rgba('#000000', .6)
  let buttonTextColor = '#000000'
  let primaryHoverColor = new Color(primaryColor).darken(.2).hex()
  let boxShadow = '0 0 16px rgba(0,0,0,.3)'

  if (new Color(backgroundColor).isDark()) {
    contrastBackgroundColor = new Color(backgroundColor).lighten(.2).hex()
    lesserContrastBackgroundColor = new Color(backgroundColor).lighten(.1).hex()
    textColor = '#FFFFFF'
    subtleTextColor = rgba('#FFFFFF', .6)
    boxShadow = '0 0 16px rgba(0,0,0,.8)'
  }

  if (new Color(primaryColor).isDark()) {
    buttonTextColor = '#FFFFFF'
  }

  const themeVariables = `@import url('https://fonts.googleapis.com/css2?family=${joinFonts([titleFont, textFont])}&display=swap');
@body-background: ${backgroundColor};
@text-color: ${textColor};
@component-background: ${backgroundColor};
  `

  return themeVariables
}
