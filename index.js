/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

function validarCedula(cedula) {
  if (!/^\d{11}$/.test(cedula)) return false;
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    let digito = parseInt(cedula[i]);
    let mult = (i % 2 === 0) ? 1 : 2;
    let producto = digito * mult;
    if (producto > 9) producto = Math.floor(producto / 10) + (producto % 10);
    suma += producto;
  }

  let verificador = (10 - (suma % 10)) % 10;
  return verificador === parseInt(cedula[10]);
}

exports.validarCedula = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const cedula = req.query.cedula;
    if (!cedula) {
      return res.status(400).json({ error: "Cédula no proporcionada" });
    }

    const esValida = validarCedula(cedula);
    res.json({ cedula, valida: esValida });
  });
});
