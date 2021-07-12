import { StorefrontTheme } from "@/modules/storefront/types";
// @ts-ignore
import { rgba } from 'polished';
// @ts-ignore
import Color from 'color'
import { pipe, map, replace, join } from 'ramda'

export async function base64EncodeFile(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result)
    }
  });
}

const joinFonts = pipe(map(replace(/\s+/g, '+')), join("&family="))

export async function stylesheet({ backgroundColor, primaryColor, logo, titleFont, textFont }: StorefrontTheme) {
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

  const themeCss = `@import url('https://fonts.googleapis.com/css2?family=${joinFonts([titleFont, textFont])}&display=swap');
  *, #root {
    font-family: '${textFont}', sans-serif;
  }
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
  }
  h1, h2, h3, h4, h5, h6, .waiting-title, .ant-list-item-meta-description, .ant-popover-inner, .ant-popover-inner-content {
    color: ${textColor};
  }
  input::placeholder {
    color: ${subtleTextColor};
  }
  .ant-slider-track, .ant-slider-rail {
    height: 10px;
    border-radius: 5px;
    background: ${lesserContrastBackgroundColor};
  }
  .ant-slider-step {
    background: ${contrastBackgroundColor};
    border-radius: 5px;
  }
  .title {
    width: 42px;
    height: 42px;
    background: url(${logo});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .ant-input, .input, .ant-input-number {
    border-color: ${contrastBackgroundColor};
    background: ${lesserContrastBackgroundColor};
    color: ${subtleTextColor};
  }

  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover, .ant-input-affix-wrapper:hover {
    border-color: none;
  }
  .ant-input:focus, .ant-input-focused, .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused  {
    border-color: ${primaryColor};
    box-shadow: none;
  }
  .ant-input::placeholder {
    color: ${subtleTextColor};
  }
  .ant-input-affix-wrapper, .ant-select {
    border: 1px solid ${contrastBackgroundColor};
    background: ${lesserContrastBackgroundColor};
    border-radius: 8px;
  }
  .ant-input-affix-wrapper .input {
    border-color: transparent;
    background: none;
  }
  .app-bar-box, .ant-card-meta, .ant-card-cover, .metaplex-button, .ant-popover-inner {
    box-shadow: none;
    background-color: ${contrastBackgroundColor};
    background: ${contrastBackgroundColor};
  }

  .ant-select-dropdown {
    background-color: ${contrastBackgroundColor};
    color: ${textColor};
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: ${primaryColor};
    color: ${textColor};
  }

  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow {
    border-top-color: ${contrastBackgroundColor};
    border-left-color: ${contrastBackgroundColor};  
  }

  .artist-card, .artist-card:hover, .metaplex-button:hover {
    box-shadow: none;
  }
  .ant-card-hoverable, .ant-card-hoverable:hover. .metaplex-button:hover {
    box-shadow: none;
  }
  .artist-card .ant-card-body{
    background: ${lesserContrastBackgroundColor};
    background-color: ${lesserContrastBackgroundColor};
    box-shadow: none !important;
  }
  .app-bar-box .ant-btn, .action-field .field-title {
    color: ${textColor};
  }
  .app-bar-box .ant-btn:hover {
    color: ${primaryColor};
    border: none;
  }
  .ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover {
    border-color: ${subtleTextColor};
  }
  .ant-btn {
    border-color: ${contrastBackgroundColor};
  }
  .ant-btn-lg {
    background: ${lesserContrastBackgroundColor} !important;
    color: ${textColor};
  }
  .ant-btn-lg:hover {
    background: ${contrastBackgroundColor} !important;
  }
  .ant-btn-primary, .action-btn, .metaplex-button, .overlay-btn {
    background: ${primaryColor} !important;
    color: ${buttonTextColor} !important;
    border: 0;
    box-shadow: none;
  }
  .ant-btn-primary:hover, .ant-btn:hover, .action-btn:hover, .metaplex-button:hover, .overlay-btn:hover {
    background: ${primaryHoverColor} !important;
    color: ${buttonTextColor} !important;
  }
  .type-btn-description {
    color: ${subtleTextColor};
  }
  .divider {
    border-color: ${backgroundColor};
  }
  .ant-card {
    background: none;
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
  a {
    color: ${primaryColor} !important;
  }
  a:hover {
    color: ${primaryHoverColor} !important;
  }
  p {
    color: ${subtleTextColor} !important;
  }
  .ant-popover-inner {
    box-shadow: none;
  }
  .auction-container {
    background: ${contrastBackgroundColor};
    color: ${textColor};
  }
  .tag, .edition-badge {
    background: ${lesserContrastBackgroundColor} !important;
    color: ${textColor};
  }
  .ant-modal-content {
    box-shadow: none !important;
  }
  .ant-modal-body {
    background: ${contrastBackgroundColor} !important;
    color: ${textColor};
    box-shadow: ${boxShadow} !important;
  }
  .ant-input-number {
    background: ${lesserContrastBackgroundColor} !important;
  }
  .modal-title, .ant-statistic-content {
    color: ${textColor} !important;
  }
  .cd-label, .ant-statistic-title, .info-header {
    color: ${subtleTextColor} !important;
  }
  .call-to-action h2 {
    color: ${textColor};
  }
  .ant-steps-vertical {
    overflow-x: visible !important;
  }
  .ant-steps-item-title {
    line-height: 24px !important;
  }
  .ant-steps-item-wait .ant-steps-item-title {
    color: ${subtleTextColor} !important;
  }
  .ant-steps-item-process .ant-steps-item-title {
    color: ${textColor} !important;
  }
  .ant-steps-item-tail::after {
    background: ${lesserContrastBackgroundColor} !important;
  }
  .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
    background: ${lesserContrastBackgroundColor} !important;
  }
  .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot, .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
    background: ${primaryColor};
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
    font-family: '${titleFont}', sans-serif;
    color: ${textColor};
  }
  `

  return themeCss
}
