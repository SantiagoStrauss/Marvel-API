const axios = require("axios");
const express = require("express");
const md5 = require("crypto-js/md5");
const router = express.Router();
const { getCharacter,getComicList } = require("../../utils/marvelApiUtils");
const { mode } = require("crypto-js");

//router personajes
router.get("/", async (req, res) => {
    try {
        const characters = await getCharacter();
        if (characters.length === 0) {
        return res.status(404).json({
            status: 1,
            data: [],
            warnings: [],
            info: "No se encontraron personajes, error al conectar con el API de Marvel.",
        });
        }
        return res.status(200).json({
        status: 0,
        data: characters,
        warnings: [],
        info: "Listado de personajes obtenido exitosamente.",
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

//router get personaje
router.get("/getCharacter", async (req, res) => {
    try {
        const characterId = req.body.id;
        const character = await getCharacter(characterId);
        if (character.length === 0) {
        return res.status(404).json({
            status: 0,
            data: [],
            warnings: [],
            info: "No se encontró el personaje, error al conectar con el API de Marvel.",
        });
        }
        return res.status(200).json({
        status: 1,
        data: character,
        warnings: [],
        info: "Personaje obtenido exitosamente.",
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