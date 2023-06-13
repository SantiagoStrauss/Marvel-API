const express = require("express");
const router = require("express").Router();
const pool = require("../../../database");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

router.post("/DeleteFavorite",  [
  body("comicId").notEmpty(),
  body("token").notEmpty(),
], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error en los parámetros de entrada.",
        });
      }
      // Obtener el id del cómic a eliminar
      const comicId = req.body.comicId;
      const token = req.body.token;
      try {
        jwt.verify(token, process.env.JWT_SECRET);
      }
      catch (error) {
          return res.status(401).json({
              status: 0,
              data: [],
              warnings: [error],
              info: "Token expirado, inicio de sesión requerido.",
          });
      }

      // Eliminar el cómic de la lista de favoritos del usuario
      const query1 = await pool.query("SELECT * FROM tokens WHERE token = ?", [token]);
      if (query1.length === 0) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error de autenticación. (token)",
        });
      }

      
      const userId = query1[0].id_usuario;
      const query = `
        DELETE FROM favoritos
        WHERE id_usuario = ? AND id_comic = ?
      `;
      const result = await pool.query(query, [query1[0].id_usuario, comicId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 1,
          data: [],
          warnings: [],
          info: "Error interno, fallo al eliminar el cómic de la lista de favoritos del usuario.",
        });
      }
      // Construir el objeto de respuesta
      const response = {
        status: 0,
        data: [],
        warnings: [],
        info: "Cómic eliminado de la lista de favoritos."
      };
  
      // Devolver la respuesta
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 2,
        data: [],
        warnings: [],
        info: "Error interno del servidor."
      });
    }
});

module.exports = router;