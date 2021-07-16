
import {stylesheet} from './../src/modules/theme'
import fs from 'fs'

  const css = stylesheet({
    backgroundColor: "#7763FF",
    primaryColor: "#3A41DB",
    titleFont: "Merriweather",
    textFont: "Work Sans",
    logo: {
      url: '/demo-logo.png'
    }
  })

  fs.writeFile('public/demo-theme.css', css, function (err) {
    if (err) throw err;
  });