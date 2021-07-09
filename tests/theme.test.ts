import { stylesheet } from '../src/modules/theme'
//@ts-ignore
import { expect } from 'chai'

describe('stylesheet', () => {
  describe('light colors', () => {
    it('shades dark', () => {
      const sheet = stylesheet({ backgroundColor: "#eeeeee", primaryColor: "#4caf50"})

      expect(sheet).to.not.be.null
    })
  })
})
