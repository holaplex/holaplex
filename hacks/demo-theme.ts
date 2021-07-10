
import {stylesheet} from './../src/modules/theme'
import fs from 'fs'

stylesheet({"backgroundColor": "#6EA1E7", "primaryColor": "#68F665"}).then(r => {
  fs.writeFile('public/demo_theme.css', r, function (err) {
                        if (err) throw err;
                        });
})
.catch(e => console.error(e))
