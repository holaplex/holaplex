import { stylesheet } from './../lib/services/theme'
import { expect } from 'chai'

describe('stylesheet', () => {
  describe('light colors', () => {
    it('shades dark', () => {
      const sheet = stylesheet({ backgroundColor: "#eeeeee", primaryColor: "#4caf50" })
    
      expect(sheet).to.be.eql(`
body {
  background-color: #eeeeee;
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: #ffffff;
  background: #ffffff;
}
.artist-card .ant-card-body{
  background: #ffffff;
  background-color: #ffffff;
}
.ant-card-bordered {
  border-color: #ffffff;
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
  color: #4caf50;
}
`
      )
    })
  })

    describe('dark colors', () => {
      it('shades light', () => {
        const sheet = stylesheet({ backgroundColor: "#000", primaryColor: "#4caf50" })
    
        expect(sheet).to.be.eql(`
body {
  background-color: #000;
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: #0000ff;
  background: #0000ff;
}
.artist-card .ant-card-body{
  background: #0000ff;
  background-color: #0000ff;
}
.ant-card-bordered {
  border-color: #0000ff;
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
  color: #4caf50;
}
`
      )
    })
  }) 
})