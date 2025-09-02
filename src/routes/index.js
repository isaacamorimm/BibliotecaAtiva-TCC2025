import express from "express";

const router = express.Router();

router.get("/home", (req, res) => {
  const role = req.query.role || "guest";
  res.render("home", { titulo: "Biblioteca Ativa Online 📚", role });
});

export default router;
