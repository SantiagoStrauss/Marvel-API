const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isEmail } = require("validator");
router.post("/login", [
  body("credenciales").notEmpty(),//credenciales
  body("contrasena").notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error en los parámetros de entrada.",
    });
  }

  const { credenciales, contrasena } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE correo_electronico = ? OR telefono = ?", [credenciales, credenciales]);
    if (result.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Error de autenticación. usurio no encontrado.",
      });
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Error de autenticación.",
      });
    }
    let token= await pool.query("SELECT * FROM tokens WHERE id_usuario = ?", user.id);
    if (token.length > 0) {
      token=token[0];
      const result = await pool.query("DELETE FROM tokens WHERE id = ?", token.id);
      if (result.affectedRows === 0) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: [],
          info: "Error interno del servidor (token).",
        });
      }
    }
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5h" });
    const query= await pool.query("INSERT INTO tokens (token, id_usuario) VALUES (?, ?)", [token, user.id]);
  
    if (query.affectedRows === 0) {
      return res.status(500).json({
        status: 2,
        data: [],
        warnings: [],
        info: "Error interno del servidor.",
      });
    }    
    
    return res.status(200).json({
      status: 1,
      data: [{ "token":token }],
      warnings: [],
      info: "Usuario autenticado exitosamente.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error interno del servidor.",
    });
  }
});
  
module.exports = router;