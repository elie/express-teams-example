const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /skills
router.get("/", async function(req, res, next) {
  try {
    const data = await db.query("SELECT * FROM skills");
    return res.json(data.rows);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function(req, res, next) {
  try {
    const data = await db.query(
      "INSERT INTO skills (title) VALUES ($1) RETURNING *",
      [req.body.title]
    );
    return res.json(data.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function(req, res, next) {
  try {
    const data = await db.query(
      "UPDATE skills SET title=$1 WHERE id=$2 RETURNING *",
      [req.body.title, req.params.id]
    );
    return res.json(data.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next) {
  try {
    await db.query("DELETE FROM skills WHERE id=$1", [req.params.id]);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

// GET /skills/:id

router.get("/:id", async function(req, res, next) {
  try {
    const skillData = await db.query("SELECT * FROM skills WHERE id=$1", [
      req.params.id
    ]);

    const playerNames = await db.query(
      `
        SELECT players.name FROM players 
            JOIN players_skills ON players.id=players_skills.player_id
            JOIN skills ON skills.id=players_skills.skill_id
        WHERE skills.id=$1
    `,
      [req.params.id]
    );

    const names = playerNames.rows.map(val => val.name);
    skillData.rows[0].players = names;
    return res.json(skillData.rows[0]);
  } catch (err) {
    return next(err);
  }
});

// make sure you export the router!
module.exports = router;
