const axios = require("axios");
const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");


router.post("/isFavorite", [body("token").notEmpty(), body("comicId").notEmpty()], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error en los parámetros de entrada",
        });
      }
      const token = req.body.token;
      const comicId = req.body.comicId;
      // Verificar que el token sea válido
      const query = await pool.query("SELECT * FROM tokens WHERE token = ?", [token]);
      if (query.length === 0) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error de autenticación.",
        });
      }
      const userId = query[0].id_usuario;
      console.log(userId);
      if (query.length === 0) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error de autenticación.",
        });
      }
  
      // Validar que el token no haya expirado
      try {
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Token expirado, inicio de sesión requerido.",
        });
      }
  
      // Verificar si el cómic es favorito del usuario
      const result = await pool.query("SELECT * FROM favoritos WHERE id_usuario = ? AND id_comic = ?", [userId, comicId]);
      if (result.length === 0) {
        return res.status(200).json({
          status: 1,
          data: [{
            isFavorite: false,
          }],
          warnings: [],
          info: "El cómic no es favorito del usuario.",
        });
      }
      return res.status(200).json({
        status: 1,
        data: [{
            isFavorite: true,
        }],
        warnings: [],
        info: "El cómic es favorito del usuario.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Error interno del servidor: " + error.message,
      });
    }
  });

module.exports = router; 
