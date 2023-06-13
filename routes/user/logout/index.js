
const express = require("express");
const router = express.Router();
const pool = require("../../../database");

router.post("/logout", async (req, res) => {
    const token  = req.body.token;
    console.log(req.body);
    try {
      const result = await pool.query("DELETE FROM tokens WHERE token = ?", [token]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 1,
          data: [],
          warnings: [],
          info: "Token no encontrado.",
        });
      }
      return res.status(200).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Token eliminado exitosamente.",
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