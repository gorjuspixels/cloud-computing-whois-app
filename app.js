import express from 'express'
import { exec } from 'child_process'
import { WhoIsRecord } from './db'
const app = express()
const PORT = process.env.PORT || 3000

// GET /whois - Route for getting whois and dig command output
app.get('/whois', (req, res) => {
  const { website } = req.query
  if (!website) return res.json({ error: 'WHO IS ________' })

  // Execute `dig` command to get domain's DNS results
  exec(`dig ${website}`, (digErr, digStdOut) => {

    // If we got an error, return it to the client
    if (digErr) { return res.json({error: digErr}) }

    // Check whois information of the domain if it is available
    exec(`whois ${website}`, (whoisErr, whoisStdOut) => {
      if (whoisErr) { return res.json({error: whoisErr}) }

      // Return dig and whois information back to the client
      res.json({result: digStdOut + '\n\n\n' + whoisStdOut})
    })
  })
})


// POST /save - Route to save website information
app.post('/save', (req, res) => {
  const { website, result } = req.query
  if (!website) return res.json({ error: 'WHO IS ________' })

  // Create new record
  const record = new WhoIsRecord({
    record: result,
    website
  })

  // Save the record in the db
  record.save((err, record) => {

    // Check for error
    if (err) return res.json({error: err})

    // Return saved record to the client
    res.json(record)
  })
})

// GET /saved - Retrieve all saved records
app.get('/saved', (req, res) => {
  WhoIsRecord.find({}, (err, records) => {
    if (err) {
      return res.json({error: err})
    }

    res.json(records)
  })
})


// Start the server
app.listen(PORT, function () {
  console.log(`Whois app listening on port ${PORT}!`);
})
