const pool = require("../../db");

module.exports = {
  createPolicy: async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      const exists = await pool.query(
        "SELECT * FROM policy WHERE ply_name = $1",
        [req.body.ply_name]
      );
      if (exists.rows.length > 0) {
        return res.status(400).json("Policy already exists");
      }

      await pool.query(
        "INSERT INTO policy (ply_name,ply_dsc) VALUES ($1, $2)",
        [req.body.ply_name, req.body.ply_dsc]
      );
      const result = await pool.query("SELECT * FROM policy");
      return res.status(201).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  getPolicy: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM policy");
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  updatePolicy: async (req, res) => {
    try {
      const policyData = await pool.query(
        "SELECT*FROM policy WHERE ply_name = $1",
        [req.body.ply_name]
      );
      if (policyData.rows.length === 0) {
        return res.status(500).json("This policy does not exist");
      } else {
        await pool.query("DELETE FROM policy WHERE ply_name = $1", [
          req.body.ply_name,
        ]);
        await pool.query(
          "INSERT INTO policy (ply_name, ply_dsc) VALUES ($1, $2)",
          [req.body.ply_name, req.body.ply_dsc]
        );
        const result = await pool.query("SELECT * FROM policy");
        return res.status(201).json(result.rows);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  deletePolicy: async (req, res) => {
    try {
      await pool.query("DELETE FROM policy WHERE ply_name = $1", [
        req.body.ply_name,
      ]);
      const result = await pool.query("SELECT * FROM policy");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};
