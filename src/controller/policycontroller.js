const pool = require("../../db");

module.exports = {
  createPolicy: async (req, res) => {
    // const { policyid, des, amount } = req.body.;
    try {
      const exists = await pool.query(
        "SELECT * FROM policies WHERE policyid = $1",
        [req.body.policyid]
      );
      if (exists.rows.length > 0) {
        return res.status(400).json("Policy ID already exists");
      }

      await pool.query("INSERT INTO policies VALUES ($1, $2, $3)", [
        req.body.policyid,
        req.body.des,
        req.body.amount,
      ]);
      const result = await pool.query("SELECT * FROM policies");
      res.status(201).json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  getPolicy: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM policies");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  updatePolicy: async (req, res) => {
    // const { policyid, des, amount } = req.body;
    try {
      const policyData = await pool.query(
        "SELECT*FROM policies WHERE policyid = $1",
        [req.body.policyid]
      );
      if (policyData.rows.length === 0) {
        res.status(500).json("This policy does not exist");
      } else {
        await pool.query("DELETE FROM policies WHERE policyid = $1", [
          req.body.policyid,
        ]);
        await pool.query("INSERT INTO policies VALUES ($1, $2, $3)", [
          req.body.policyid,
          req.body.des,
          req.body.amount,
        ]);
        const result = await pool.query("SELECT * FROM policies");
        res.status(201).json(result.rows);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deletePolicy: async (req, res) => {
    const { policyid } = req.body;
    try {
      await pool.query("DELETE FROM policies WHERE policyid = $1", [
        req.body.policyid,
      ]);
      const result = await pool.query("SELECT * FROM policies");
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
};
