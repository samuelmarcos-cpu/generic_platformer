const express = require('express')
const cors = require('cors')
const mailgun = require('mailgun-js')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.get('/', cors(), (req, res) => {
  res.sendFile('index.html')
})

app.post('/comment', cors(), (req, res) => {
  const { comment: text } = req.body

  const auth = {
    domain: process.env.MAILGUN_DOMAIN,
    apiKey: process.env.MAILGUN_API_KEY
  }
  const mg = mailgun(auth)

  const data = {
    from: process.env.MAIL,
    to: process.env.MAIL,
    subject: 'Hello',
    text
  }
  mg.messages().send(data, function (error, body) {
    console.log(body)
    if (error) {
      console.log('Error Occurs: ', error)
      res.status(500).end()
    } else {
      console.log('Email sent!')
      res.status(200).end()
    }
  })
})

app.listen(process.env.PORT || 1234, () => {
  console.log('Servidor rodando...')
})
