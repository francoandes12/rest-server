require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err
    console.log('base de datos online')
  }
)

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en  http://localhost:${process.env.PORT}`)
})
