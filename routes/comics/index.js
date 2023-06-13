const axios = require("axios");
const express = require("express");
const md5 = require("crypto-js/md5");
const router = express.Router();
const { getComicList, getComic } = require("../../utils/marvelApiUtils");

router.get("/", async (req, res) => {
  try {
    const comics = await getComicList();
    if (comics.length === 0) {
      return res.status(404).json({
        status: 1,
        data: [],
        warnings: [],
        info: "No se encontraron cómics, error al conectar con el API de Marvel.",
      });
    }
    return res.status(200).json({
      status: 0,
      data: comics,
      warnings: [],
      info: "Listado de comics obtenido exitosamente.",
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

router.post("/getComic", async (req, res) => {
  try {
    
    const comicId = req.body.id;
    const comic = await getComic(comicId);
    
    if (comic.length === 0) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: "No se encontró el cómic, error al conectar con el API de Marvel.",
      });
    }
    return res.status(200).json({
      status: 1,
      data: comic,
      warnings: [],
      info: "Comic obtenido exitosamente.",
    });
  } catch (error) {
    console.error(error);
    console.log(req.body);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error interno del servidor.",
    });
  }
});

module.exports = router;