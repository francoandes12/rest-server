const express = require('express')
let {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autenticacion')
let app = express()
let Categoria = require('../models/categoria')

//mostrar todas las categorias

app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        categorias,
      })
    })
})
//mostrar una categoria por Id
app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto',
        },
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    })
  })
})
//crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
  // regresa la nueva categoria
  // req.usuario._id
  let body = req.body

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  })
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    })
  })
})

//actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id
  let body = req.body
  let descripcionCategoria = {
    descripcion: body.descripcion,
  }
  Categoria.findByIdAndUpdate(
    id,
    descripcionCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        categoria: categoriaDB,
      })
    }
  )
})
//borrar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id
  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe',
        },
      })
    }
    res.json({
      ok: true,
      message: ' Categoria borrada',
    })
  })
})

module.exports = app
