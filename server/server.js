require('./config/config')
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
  res.json('get Usuario')
})
app.post('/usuario', (req, res) => {
  let body = req.body
  if(body.nombre === undefined){
    res.status(400).json({
      ok:false,
      msg:'El nombre es necesario'
    })
  }else{

    res.json({body})
  }
})
app.put('/usuario/:id', (req, res) => {
  let id = req.params.id
  res.json({
    id
  })
})
app.delete('/usuario', (req, res) => {
  res.json('delete Usuario')
})

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en  http://localhost:${process.env.PORT}`)
})