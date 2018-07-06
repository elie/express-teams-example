const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db/index");
// GET /teams/:team_id/players
router.get("", async function(req, res, next) {
  // GET all of the players on a specific team
  const data = await db.query("SELECT * FROM players WHERE team_id=$1", [
    req.params.team_id
  ]);
  return res.json(data.rows);
});

// POST /teams/:team_id/players
router.post("", async function(req, res, next) {
  const data = await db.query(
    "INSERT INTO players (name, team_id) VALUES ($1,$2) RETURNING *",
    [req.body.name, req.params.team_id]
  );
  return res.json(data.rows[0]);
});

// PATCH /teams/:team_id/players/:id
router.patch("/:id", async function(req, res, next) {
  const data = await db.query(
    "UPDATE players SET name=$1 WHERE id=$2 RETURNING *",
    [req.body.name, req.params.id]
  );
  return res.json(data.rows[0]);
});

// DELETE /teams/:team_id/players/:id
router.delete("/:id", async function(req, res, next) {
  await db.query("DELETE FROM players WHERE id=$1", [req.params.id]);
  return res.json({ message: "Deleted" });
});

module.exports = router;
