import { StorefrontTheme } from "@/modules/storefront/types";
// @ts-ignore
import { rgba } from 'polished';
// @ts-ignore
import Color from 'color'
import { pipe, map, replace, join } from 'ramda'

const joinFonts = pipe(map(replace(/\s+/g, '+')), join("&family="))

export function stylesheet({ backgroundColor, primaryColor, textFont, titleFont, logo }: StorefrontTheme): string {
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

  const themeCss = `@import url('https://fonts.googleapis.com/css2?family=${joinFonts([titleFont, textFont])}&display=swap');
  *, #root {
    font-family: '${textFont}', sans-serif;
  }
  body {
    background-color: ${backgroundColor};
    color: ${textColor};
  }
  h1, h2, h3, h4, h5, h6, .waiting-title, .ant-list-item-meta-description, .ant-popover-inner, .ant-popover-inner-content {
    color: ${textColor} !important;
  }
  .ant-progress-text {
    color: ${textColor};
  }
  .ant-btn {
    color: ${textColor} !important;
    border-color: ${contrastBackgroundColor};
    box-shadow: none;
  }
  input::placeholder, .usd {
    color: ${subtleTextColor};
  }
  .amount-container {
    background: none !important;
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
    background: url(${logo.url});
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
    border: 1px solid ${contrastBackgroundColor} !important;
    background: ${lesserContrastBackgroundColor};
    color: ${textColor};
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
  .ant-select-item {
    color: ${textColor};
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: ${primaryColor};
    color: ${buttonTextColor};
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: none;
    border: none;
  }

  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow {
    border-top-color: ${contrastBackgroundColor};
    border-left-color: ${contrastBackgroundColor};
  }

  .artist-card, .artist-card:hover, .metaplex-button:hover {
    box-shadow: none;
  }
  .ant-card-hoverable, .ant-card-hoverable:hover .metaplex-button:hover {
    box-shadow: none !important;
  }
  .artist-card .ant-card-body{
    background: ${lesserContrastBackgroundColor};
    background-color: ${lesserContrastBackgroundColor};
    box-shadow: none !important;
  }
  .app-bar-box .ant-btn, .action-field .field-title {
    color: ${textColor};
  }
  .action-field .field-info, .radio-subtitle {
    color: ${subtleTextColor};
  }
  .ant-radio-checked .ant-radio-inner, .ant-radio-checked:hover .ant-radio-inner, .ant-radio .ant-radio-inner, .ant-radio:hover .ant-radio-inner {
    border-color: ${primaryColor} !important;
  }
  .ant-radio-checked .ant-radio-inner::after, .ant-radio-checked:hover .ant-radio-inner::after {
    background-color: ${primaryColor};
  }
  .app-bar-box .ant-btn {
    margin-right: 8px;
  }
  .app-bar-box .ant-btn:hover {
    color: ${primaryColor};
    border: none;
  }
  .app-right {
    padding: 0 8px;
  }
  .ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover {
    border-color: ${subtleTextColor};
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
  .ant-btn-primary:hover, .ant-btn:hover, .action-btn:hover, .metaplex-button:hover, .overlay-btn:hover, .ant-btn:focus {
    background: ${primaryHoverColor} !important;
    color: ${buttonTextColor} !important;
    border-color: ${primaryColor};

  }
  .type-btn-description {
    color: ${subtleTextColor};
  }
  .divider {
    margin: 0 14px;
    border-color: ${backgroundColor};
  }
  .ant-card {
    color: ${textColor};
    border-color: ${contrastBackgroundColor};
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
  .ant-popover {
    margin-top: 28px;
  }
  .ant-popover-content {
    box-shadow: ${boxShadow};
  }
  .ant-popover-inner {
    box-shadow: none;
  }
  .ant-popover-title {
    color: ${textColor};
    border-color: ${lesserContrastBackgroundColor};
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
    background: ${contrastBackgroundColor};
    box-shadow: none !important;
    box-shadow: ${boxShadow} !important;
  }
  .ant-modal-header, .ant-modal-footer {
    background: none;
    border-color: ${lesserContrastBackgroundColor};
    color: ${textColor};
  }
  .ant-modal-title, .ant-modal-close-icon {
    color: ${textColor};
  }
  .ant-modal-body {
    background: ${contrastBackgroundColor} !important;
    color: ${textColor};
    box-shadow: none !important;
  }
  .ant-input-number, .ant-picker {
    background: ${lesserContrastBackgroundColor} !important;
  }
  .ant-picker-panel-container {
    background: ${contrastBackgroundColor};
    border-radius: 8px;
  }
  .ant-picker-cell {
    color: ${subtleTextColor};
  }
  .ant-picker-cell-in-view {
    color: ${textColor};
  }
  .ant-picker-cell-disabled .ant-picker-cell-inner {
    color: ${subtleTextColor};
  }
  .ant-picker-cell-disabled::before {
    background: ${lesserContrastBackgroundColor};
  }
  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    background: ${primaryColor};
    border: none;
    color: ${textColor};
  }
  .ant-picker-header, .ant-picker-footer, .ant-picker-time-panel-column {
    border-color: ${lesserContrastBackgroundColor} !important;
    color: ${textColor};
  }
  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background: ${primaryColor};
    color: ${buttonTextColor};
  }
  .ant-picker-header > button {
    color: ${subtleTextColor};
  }
  .ant-picker-header > button:hover {
    color: ${textColor};
  }
  .ant-picker-cell:hover .ant-picker-cell-inner {
    background: ${primaryColor} !important;
    color: ${buttonTextColor} !important;
  }
  .ant-picker-panel-container .ant-picker-panel {
    border: none;
  }
  .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background: ${primaryColor};
    color: ${buttonTextColor};
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
    color: ${textColor} !important;
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
  .ant-table-wrapper {
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
  }
  .ant-table {
    color: ${textColor};
    background: ${contrastBackgroundColor};
  }
  .ant-table-thead > tr > th  {
    background: ${lesserContrastBackgroundColor};
    color: ${textColor};
  }
  .ant-table-tbody > tr > td, .ant-table-tbody > tr.ant-table-row:hover > td {
    border-color: ${lesserContrastBackgroundColor};
    background: ${contrastBackgroundColor};
  }
  .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background: ${contrastBackgroundColor};
  }
  .ant-switch {
    background: ${lesserContrastBackgroundColor};
    box-shadow: none;
  }
  .ant-switch .ant-switch-inner {
    color: ${textColor};
  }
  .ant-switch-checked {
    background: ${primaryColor};
  }
  .ant-switch-checked .ant-switch-inner{
    color: ${buttonTextColor} !important;
  }
  .ant-pagination-item {
    border-color: ${contrastBackgroundColor};
  }
  .ant-pagination-item-active {
    border-color: ${primaryColor};
  }
  .ant-pagination-item-active:focus-visible, .ant-pagination-item-active:hover {
    background: ${primaryColor};
    border-color: ${primaryColor};
  }
  .ant-pagination-item-active:focus-visible a, .ant-pagination-item-active:hover a {
    color: ${buttonTextColor} !important;
  }
  .add-creator-button {
    margin-right: 8px;
  }
  .ant-upload-list {
    color: ${textColor};
  }
  .ant-upload.ant-upload-drag {
    background: ${lesserContrastBackgroundColor};
    border-color: ${contrastBackgroundColor};
  }
  .ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover, .ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover {
    border-color: ${primaryColor};
  }
  .ant-upload-list-item-info .anticon-loading .anticon, .ant-upload-list-item-info .ant-upload-text-icon .anticon {
    color: ${textColor};
  }
  .ant-upload-list-item-info {
    padding: 8px 4px;
  }
  .ant-upload-list-item:hover .ant-upload-list-item-info {
    background: ${lesserContrastBackgroundColor};
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
