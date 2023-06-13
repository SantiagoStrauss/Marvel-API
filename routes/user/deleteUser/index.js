const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

router.post("/deleteUser", [
  body("credenciales").notEmpty(),
  body("contrasena").notEmpty(),
  body("token").notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 1,
      data: [],
      warnings: [],
      info: "Error en los parámetros de entrada.",
    });
  }

  const { credenciales, contrasena, token } = req.body;

  try {
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
    

    // Verificar que el usuario existe y que la contraseña es correcta
    const userQuery = await pool.query("SELECT * FROM usuarios WHERE telefono = ? OR correo_electronico = ?", [credenciales, credenciales]);
    if (userQuery.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Usuario no encontrado.",
      });
    }
    const user = userQuery[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Contraseña incorrecta.",
      });
    }

    // Eliminar el usuario y sus favoritos
    await pool.query("DELETE FROM favoritos WHERE id_usuario = ?", [user.id]);

    // Eliminar el token de sesión
    await pool.query("DELETE FROM tokens WHERE token = ?", [tokenData.token]);
    await pool.query("DELETE FROM usuarios WHERE id = ?", [user.id]);

    return res.status(200).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Usuario eliminado exitosamente.",
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