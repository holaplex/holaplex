import { stylesheet } from '../src/modules/theme'
import { expect } from 'chai'
import {} from 'mocha';

describe('stylesheet', () => {
  it('generates a css sheet', () => {
    const sheet = stylesheet({ backgroundColor: "#eeeeee", primaryColor: "#4caf50", textFont: "Work Sans", titleFont: "Work Sans",
    logo: { 
      name: 'demo-logo',
      type: 'png',
      url: "/demo-logo.png" },
    banner: { 
      name: 'demo-banner',
      type: 'png',
      url: "/demo-banner.png" }
    })

    expect(sheet).to.not.be.null
  })
})
