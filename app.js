const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/get/:id', (req, res) => {
  res.send('Hello world');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})