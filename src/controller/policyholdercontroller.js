const pool = require("../../db");

module.exports = {
  createPolicyHolder: async (req, res) => {
    // const { policyholderid, policyid, name, amount } = req.body.;
    console.log("Received Data:", req.body);

    try {
      // Check policy exists
      const policyExists = await pool.query(
        "SELECT * FROM policy WHERE ply_name = $1",
        [req.body.ply_name]
      );
      //
      if (policyExists.rows.length === 0) {
        return res.status(400).json("Policy does not exist");
      }

      await pool.query(
        "INSERT INTO policyholder (ply_hld_name, email, ply_name, ply_amt) VALUES ($1, $2, $3, $4)",
        [
          req.body.ply_hld_name,
          req.body.email,
          req.body.ply_name,
          req.body.ply_amt,
        ]
      );
      const result = await pool.query("SELECT * FROM policyholder");
      return res.status(201).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  getPolicyHolder: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM policyholder");
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  updatePolicy: async (req, res) => {
    // const { policyholderid, ply_name, name, amount } = req.body;
    try {
      const holderInfo = await pool.query(
        "SELECT*FROM policyholder WHERE email = $1 AND ply_name = $2",
        [req.body.email, req.body.ply_name]
      );
      if (holderInfo.rows.length === 0) {
        return res.status(400).json("This policy holder does not exist");
      } else {
        if (holderInfo.rows[0].ply_name !== req.body.ply_name) {
          res
            .status(500)
            .json("Sorry this policy holder do not have this policy");
        } else {
          await pool.query(
            "DELETE FROM policyholder WHERE email = $1 AND ply_name = $2",
            [req.body.email, req.body.ply_name]
          );
          await pool.query(
            "INSERT INTO policyholder (ply_hld_name, email, ply_name, ply_amt) VALUES ($1 , $2, $3, $4)",
            [
              req.body.ply_hld_name,
              req.body.email,
              req.body.ply_name,
              req.body.ply_amt,
            ]
          );
        }
        const result = await pool.query("SELECT * FROM policyholder");
        return res.status(201).json(result.rows);
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  deletePolicyHolder: async (req, res) => {
    // const { policyholderid, ply_name } = req.body;
    const holderInfo = await pool.query(
      "SELECT*FROM policyholder WHERE email = $1 AND ply_name = $2",
      [req.body.email, req.body.ply_name]
    );
    if (holderInfo.rows.length === 0) {
      return res.status(400).json("This policy holder does not exist");
    }
    try {
      await pool.query(
        "DELETE FROM policyholder WHERE email = $1 AND ply_name = $2",
        [req.body.email, req.body.ply_name]
      );
      const result = await pool.query("SELECT * FROM policyholder");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};
