
import {stylesheet} from './../src/modules/theme'
import fs from 'fs'

fs.readFile('hacks/demo-logo.png', (err, logo) => {
  stylesheet({
    backgroundColor: "#7763FF",
    primaryColor: "#3A41DB",
    titleFont: "Merriweather",
    textFont: "Work Sans",
    logo: `data:image/png/;base64,${logo.toString('base64')}`,
  }).then(r => {
    fs.writeFile('public/demo-theme.css', r, function (err) {
      if (err) throw err;
    });
  })
  .catch(e => console.error(e))
})
