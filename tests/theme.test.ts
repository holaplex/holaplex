import { stylesheet } from '../src/modules/theme'
//@ts-ignore
import { expect } from 'chai'

describe('stylesheet', () => {
  describe('light colors', () => {
    it('shades dark', () => {
      const sheet = stylesheet({ backgroundColor: "#eeeeee", primaryColor: "#4caf50", logoUrl: "https://acme.holaplex.com/acme/abc.jpg" })

      expect(sheet).to.be.eql(`body {
  background-color: #eeeeee;
}
.title {
  width: 42px;
  height: 42px;
  background: url(https://acme.holaplex.com/acme/abc.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: #8F8F8F;
  background: #8F8F8F;
}
.artist-card .ant-card-body{
  background: #BEBEBE;
  background-color: #BEBEBE;
}
.ant-card-bordered {
  border-color: #BEBEBE;
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
        const sheet = stylesheet({ backgroundColor: "#080808", primaryColor: "#4caf50", logoUrl: "https://acme.holaplex.com/acme/abc.jpg" })
    
        expect(sheet).to.be.eql(`body {
  background-color: #080808;
}
.title {
  width: 42px;
  height: 42px;
  background: url(https://acme.holaplex.com/acme/abc.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: #0B0B0B;
  background: #0B0B0B;
}
.artist-card .ant-card-body{
  background: #0A0A0A;
  background-color: #0A0A0A;
}
.ant-card-bordered {
  border-color: #0A0A0A;
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

  describe('no theme', () => {
    it('applies default theme', () => {
      const sheet = stylesheet({})
  
      expect(sheet).to.be.eql(`body {
  background-color: #ffffff;
}
.title {
  width: 42px;
  height: 42px;
  background: url(undefined);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.app-bar-box, .ant-card-meta, .ant-card-cover {
  background-color: #999999;
  background: #999999;
}
.artist-card .ant-card-body{
  background: #CCCCCC;
  background-color: #CCCCCC;
}
.ant-card-bordered {
  border-color: #CCCCCC;
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
  color: #000000;
}
`
      )
    })
  })
})
