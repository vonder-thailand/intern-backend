const express = require('express')
const app = express()
const port = 3000

app.get('/kwem', (req, res) => {
  res.send('nope');
})

app.post('/see/you/leatwe', async (req, res) => {
   res.send('akjdakdjkal')
 })

app.put('/ma', (req, res) => {
   res.json({hge:"dsa"})
})

app.delete('/jae', (req, res) => {
   await res.send('plas')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})