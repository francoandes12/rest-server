const express = require('express')
const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
const app = express()
// default options
app.use(fileUpload())
app.put('/upload/:tipo/:id', function (req, res) {
  let tipo = req.params.tipo
  let id = req.params.id
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'no se ha seleccionado ningun archivo'
      }
    })
  }
  //validar tipos
  let tiposValidos = ['productos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'los tipos permitidos son: ' + tiposValidos.join(', ')
      }
    })
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length - 1]

  //extensiones permitidas
  let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif']
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          'las extensiones permitidas son: ' + extensionesValidas.join(', '),
        extension
      }
    })
  }
  //cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      })
    //aqui imagen cargada
    if (tipo === 'usuarios') {
      imagenUsuario(res, id, nombreArchivo)
    } else {
      imagenProducto(res, id, nombreArchivo)
    }
  })
})
const imagenUsuario = (res, id, nombreArchivo) => {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!usuarioDB) {
      borraArchivo(nombreArchivo, 'usuarios')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'el usuario no existe'
        }
      })
    }
    borraArchivo(usuarioDB.img, 'usuarios')
    usuarioDB.img = nombreArchivo
    usuarioDB.save((err, usuarioDBGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        usuario: usuarioDBGuardado
      })
    })
  })
}
const imagenProducto = (res, id, nombreArchivo) => {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      borraArchivo(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'el producto no existe'
        }
      })
    }
    borraArchivo(productoDB.img, 'productos')
    productoDB.img = nombreArchivo
    productoDB.save((err, productoDBGuardado) => {
      if (err) {
        return res.status(400).json({
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
}
const borraArchivo = (nombreImagen, tipo) => {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  )
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen)
  }
}
module.exports = app
