const express = require('express')
let { verificaToken } = require('../middlewares/autenticacion')
const app = express()
let Producto = require('../models/producto')
//obtener productos
app.get('/productos', verificaToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        productos
      })
    })
  //trae todos
  //populate usuario categoria
  //paginado
})
//obtener producto por Id
app.get('/productos/:id', verificaToken, (req, res) => {
  //populate usuario categoria
  let id = req.params.id
  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID no es correcto'
          }
        })
      }
      res.json({
        ok: true,
        producto: productoDB
      })
    })
})
//buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino
  //expresion regular
  let regex = new RegExp(termino, 'i')
  Producto.find({ nombre: regex })
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        producto: productoDB
      })
    })
})
//crear un producto nuevo
app.post('/productos', verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  let body = req.body
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  })
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    })
  })
})
//Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  let id = req.params.id
  let body = req.body
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      })
    }
    productoDB.nombre = body.nombre
    productoDB.descripcion = body.descripcion
    productoDB.disponible = body.disponible
    productoDB.categoria = body.categoria
    productoDB.precioUni = body.precioUni
    productoDB.save((err, productoDBGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        producto: productoDBGuardado
      })
    })
  })
})
//Borrar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  //cambiar disponible
  let id = req.params.id
  let body = req.body
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      })
    }
    productoDB.disponible = false
    productoDB.save((err, productoDBBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        producto: productoDBBorrado,
        message: 'Producto borrado'
      })
    })
  })
})
module.exports = app
