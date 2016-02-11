import mongoose from 'mongoose'
mongoose.connect('mongodb://localhost/whois')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('Established connection to the database')
})

export const WhoIsRecord = mongoose.model('WhoIsRecord', {
  website: String,
  record: String
})
