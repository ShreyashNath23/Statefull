const pool = require("../../db");

module.exports = {
  createClaims: async (req, res) => {
    // const { claimid, ply_name, email, amount } = req.body;
    try {
      const policyHolder = await pool.query(
        "SELECT * FROM policyholder WHERE email = $1 AND ply_name = $2",
        [req.body.email, req.body.ply_name]
      );

      if (policyHolder.rows.length === 0) {
        return res
          .status(400)
          .json("Invalid policyholder or policy combination");
      }

      if (policyHolder.rows[0].ply_amt < req.body.claim_amt) {
        return res.status(400).json("Claim amount exceeds policy limit");
      }

      await pool.query(
        "INSERT INTO claim (email, ply_name, claim_amt, claim_status) VALUES ($1, $2, $3, $4)",
        [
          // req.body.claimid,
          req.body.email,
          req.body.ply_name,
          req.body.claim_amt,
          req.body.claim_status,
        ]
      );
      const result = await pool.query("SELECT * FROM claim");
      return res.status(201).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  getClaims: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM claim WHERE email = $1", [
        req.body.email,
      ]);
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  updateClaim: async (req, res) => {
    try {
      const claimData = await pool.query(
        "SELECT*FROM claim WHERE email = $1 AND ply_name = $2",
        [req.body.email, req.body.ply_name]
      );
      if (
        claimData.rows.length === 0 ||
        claimData.rows[0].claim_status === "closed"
      ) {
        return res
          .status(500)
          .json("Sorry this claim does not exist or is closed");
      } else {
        const policyInfo = await pool.query(
          "SELECT * FROM policy WHERE ply_name = $1",
          [req.body.ply_name]
        );
        if (policyInfo.rows.length === 0) {
          return res.status(400).json("Policy does not exceed");
        } else {
          const policyHolder = await pool.query(
            "SELECT * FROM policyholder WHERE email = $1 AND ply_name = $2",
            [req.body.email, req.body.ply_name]
          );
          if (policyHolder.rows[0].ply_amt < req.body.claim_amt) {
            return res.status(400).json("Claim amount exceeds policy limit");
          }
          await pool.query(
            "DELETE FROM claim WHERE email = $1 AND ply_name = $2",
            [req.body.email, req.body.ply_name]
          );
          await pool.query(
            "INSERT INTO claim (email, ply_name,claim_amt, claim_status) VALUES ($1, $2, $3, $4)",
            [
              // req.body.claimid,
              req.body.email,
              req.body.ply_name,
              req.body.claim_amt,
              req.body.claim_status,
            ]
          );
          const result = await pool.query("SELECT * FROM claim");
          return res.status(201).json(result.rows);
        }
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  deleteClaim: async (req, res) => {
    // const { claimid, email, ply_name } = req.body.;
    const claimStatus = await pool.query(
      "SELECT * FROM claim WHERE email = $1 AND ply_name = $2",
      [req.body.email, req.body.ply_name]
    );
    if (
      claimStatus.rows.length !== 0 &&
      claimStatus.rows[0].status !== "pending"
    ) {
      try {
        await pool.query(
          "DELETE FROM claim WHERE email = $1 AND ply_name = $2",
          [req.body.email, req.body.ply_name]
        );
        const result = await pool.query("SELECT * FROM claim");
        return res.json(result.rows);
      } catch (err) {
        return res.status(500).json(err.message);
      }
    } else {
      return res.status(500).json("Claim is either open or does not exist");
    }
  },
};
