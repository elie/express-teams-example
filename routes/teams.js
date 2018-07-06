const express = require("express");
const router = express.Router();
const db = require("../db/index");

// http localhost:3000/teams
router.get("", async function(req, res, next) {
  try {
    const data = await db.query("SELECT * FROM teams");
    return res.json(data.rows);
  } catch (err) {
    return next(err);
  }
});

// http POST localhost:3000/teams name=whatever
router.post("", async function(req, res, next) {
  const data = await db.query(
    "INSERT INTO teams (name) VALUES ($1) RETURNING *",
    [req.body.name]
  );
  return res.json(data.rows[0]);
});

// http PATCH localhost:3000/teams/1 name=updated
// PATCH /teams/:id ----> updates a team
router.patch("/:id", async function(req, res, next) {
  const data = await db.query(
    "UPDATE teams SET name=$1 WHERE id=$2 RETURNING *",
    [req.body.name, req.params.id]
  );
  return res.json(data.rows[0]);
});

// http DELETE localhost:3000/teams/1
// DELETE /teams/:id  ----> deletes a team
router.delete("/:id", async function(req, res, next) {
  await db.query("DELETE FROM teams WHERE id=$1", [req.params.id]);
  return res.json({ message: "Deleted" });
});

// GET /teams/2
router.get("/:id", async function(req, res, next) {
  // GET the team by it's ID
  const teamData = await db.query("SELECT * FROM teams WHERE id=$1", [
    req.params.id
  ]);

  const players = await db.query("SELECT * FROM players WHERE team_id=$1", [
    req.params.id
  ]);

  teamData.rows[0].players = players.rows;
  return res.json(teamData.rows[0]);
});

// BONUS - GET /teams/:id
// this responds with an object that looks like this:

/*
    {
        id: 1,
        name: "warriors"
        players: [{
            id: 1,
            name: "Draymond Green"
        },{
            id: 2,
            name: "Klay Thompson"
        }]
    }
    */

module.exports = router;
