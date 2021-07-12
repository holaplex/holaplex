
import {stylesheet} from './../src/modules/theme'
import fs from 'fs'

fs.readFile('hacks/demo-logo.png', (err, logo) => {
  stylesheet({
    backgroundColor: "#6EA1E7", 
    primaryColor: "#68F665",
    titleFont: "Work Sans",
    textFont: "Work Sans",
    logo: `data:image/png/;base64,${logo.toString('base64')}`,
  }).then(r => {
    fs.writeFile('public/demo-theme.css', r, function (err) {
      if (err) throw err;
    });
  })
  .catch(e => console.error(e))
})

