/* PUERTO */
process.env.PORT = process.env.PORT || 3000

/* ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
let urlDb
/* BASE DE DATOS */
if (process.env.NODE_ENV === 'dev') {
  urlDb = 'mongodb://localhost:27017/cafe'
} else {
  urlDb = 'mongodb+srv://franco:1207@chat-andes.vvqwb.mongodb.net/cafe'
}
process.env.URLDB = urlDb
