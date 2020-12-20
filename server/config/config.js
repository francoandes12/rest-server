/* PUERTO */
process.env.PORT = process.env.PORT || 3000

/* ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
let urlDb
/* BASE DE DATOS */
if (process.env.NODE_ENV === 'dev') {
  urlDb = 'mongodb://localhost:27017/cafe'
} else {
  urlDb = process.env.MONGO_URI
}
process.env.URLDB = urlDb
//Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30
//SEED De autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'
