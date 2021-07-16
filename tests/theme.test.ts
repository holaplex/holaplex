import { stylesheet } from '../src/modules/theme'
//@ts-ignore
import { expect } from 'chai'

describe('stylesheet', () => {
  it('generates a css sheet', () => {
    const sheet = stylesheet({ backgroundColor: "#eeeeee", primaryColor: "#4caf50", textFont: "Work Sans", titleFont: "Work Sans", logo: { url: "/demo-logo.png" } })

    expect(sheet).to.not.be.null
  })
})
