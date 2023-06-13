const axios = require("axios");
const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { getHash,getComicList } = require("../../../utils/marvelApiUtils");


router.post("/favorites", [body("token").notEmpty()], async (req, res) => {
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
    }
    catch (error) {
        return res.status(401).json({
            status: 0,
            data: [],
            warnings: [],
            info: "Token expirado, inicio de sesión requerido.",
        });
    }

    // Obtener la lista de cómics favoritos del usuario
    const comicIds = await pool.query("SELECT id_comic FROM favoritos WHERE id_usuario = ?", [userId]);
    console.log(comicIds);
    if (comicIds.length === 0) {
      return res.status(404).json({
        status: 1,
        data: [],
        warnings: [],
        info: "El usuario no tiene cómics favoritos o ha ocurrido un error interno al obtenerlos.",
      });
    }
    let comics= await getComicList();
    // utiliza comicIds para filtrar los cómics favoritos del usuario
    comics = comics.filter((comic) => {
      return comicIds.some((comicId) => {
        return comicId.id_comic === comic.id;
      });
    });
    
    
    // Devolver la respuesta
    res.status(200).json({
      status: 1,
      data: comics,
      warnings: [],
      info: "Lista de cómics favoritos del usuario."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error interno del servidor: " + error.message
    });
  }
});

module.exports = router;