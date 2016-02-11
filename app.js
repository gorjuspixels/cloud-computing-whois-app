import express from 'express'
import { exec } from 'child_process'
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {

  exec(`dig ${req.query.website}`, (err, stdout, stderr) => {
    if (err) { return res.json({error: err}) }

    exec(`whois ${req.query.website}`, (err1, stdout1, stderr1) => {
      if (err) { return res.json({error: err}) }
      res.json({result: stdout + '\n\n\n' + stdout1})
    })

  })

})

app.listen(PORT, function () {
  console.log(`Whois app listening on port ${PORT}!`);
})
