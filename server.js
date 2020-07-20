const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.static('public'))

app.get('/', cors(), (req, res) => {
  res.sendFile('index.html')
})

app.listen(process.env.PORT || 1234, () => {
  console.log('Servidor rodando...')
})
