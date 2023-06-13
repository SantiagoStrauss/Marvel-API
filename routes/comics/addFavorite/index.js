const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const {getComic} = require("../../../utils/marvelApiUtils");


router.post("/favorite",[
  body("comicId").notEmpty(),
  body("token").notEmpty(),
] ,async (req, res) => {
    try {
      // Verificar que el token sea válido
      const token = req.body.token;
      const query = await pool.query("SELECT * FROM tokens WHERE token = ?", [token]);
      if (query.length === 0) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error de autenticación.",
        });
      }
  
      // Validar que el token no haya expirado
      const tokenData = query[0];
      try {
        jwt.verify(tokenData.token, process.env.JWT_SECRET);
      }
      catch (error) {
          return res.status(401).json({
              status: 0,
              data: [],
              warnings: [],
              info: "Token expirado, inicio de sesión requerido.",
          });
      }
      const comicId = req.body.comicId;
      let comics = await getComic(comicId);
      
      
      // Obtener el id del cómic a agregar
      
      const comic = await pool.query("SELECT * FROM favoritos WHERE id_comic = ?", [comicId]);
      if (comic.length !== 0) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: "El cómic ya está en la lista de favoritos.",
        });
      }
      // Agregar el cómic a la lista de favoritos del usuario
      const userId = tokenData.id_usuario;
      const query2 = `
        INSERT INTO favoritos (id_usuario, id_comic)
        VALUES (?, ?)
      `;
      const result = await pool.query(query2, [userId, comicId]);
  
      // Construir el objeto de respuesta
      const response = {
        status: 1,
        data: [],
        warnings: [],
        info: "Cómic agregado a la lista de favoritos."
      };
  
      // Devolver la respuesta
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_BAD_REQUEST") {
        return res.status(404).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Cómic no encontrado. Verifique el id del cómic."
        });
      }

      res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Error interno del servidor: " + error.message
      });
    }
});

module.exports = router;    