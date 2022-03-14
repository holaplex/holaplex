
import {stylesheet} from './../src/modules/theme'
import fs from 'fs'

  const css = stylesheet({
    backgroundColor: '#333333',
    primaryColor: '#F2C94C',
    titleFont: "Work Sans",
    textFont: "Work Sans",
    banner: {
      name: 'banner.png',
      type: "image/png",
      url: '/demo-banner.png',
    },
    logo: {
      name: 'demo.png',
      type: "image/png",
      url: '/demo-logo.png',
    }
  })

  fs.writeFile('public/demo-theme.css', css, function (err) {
    if (err) throw err;
  });