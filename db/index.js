const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://localhost/teams-db"
});

client.connect();

module.exports = client;
