const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isEmail } = require("validator");

router.post("/register", [
    body("nombre").notEmpty(),
    body("identificacion").notEmpty(),
    body("telefono").notEmpty(),
    body("correo_electronico").isEmail(),
    body("contrasena").notEmpty(),
  ], async (req, res,) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 1,
        data: [],
        warnings: [],
        info: "Error en los parámetros de entrada.",
      });
    }
  
    const { nombre, identificacion,telefono, correo_electronico, contrasena } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM usuarios WHERE correo_electronico = ? OR telefono = ?", [correo_electronico, telefono]);
      if (user.length > 0) {
        return res.status(409).json({
          status: 1,
          data: [],
          warnings: [],
          info: "El correo electrónico o el teléfono ya se encuentran registrados.",
        });
      }
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const newUser = {
        nombre,
        identificacion,
        telefono,
        correo_electronico,
        contrasena: hashedPassword,
      };
      const result = await pool.query("INSERT INTO usuarios SET ?", newUser);
      return res.status(200).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Usuario registrado exitosamente.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 2,
        data: [],
        warnings: [],
        info: "Error interno del servidor.",
      });
    }
  });

module.exports = router;