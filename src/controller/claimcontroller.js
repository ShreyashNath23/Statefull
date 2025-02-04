const pool = require("../../db");

module.exports = {
  createClaims: async (req, res) => {
    // const { claimid, policyid, policyholderid, amount } = req.body;
    try {
      const policyHolder = await pool.query(
        "SELECT * FROM policyholder WHERE policyholderid = $1 AND policyid = $2",
        [req.body.policyholderid, req.body.policyid]
      );

      if (policyHolder.rows.length === 0) {
        return res
          .status(400)
          .json("Invalid policyholder or policy combination");
      }

      if (policyHolder.rows[0].amount < req.body.amount) {
        return res.status(400).json("Claim amount exceeds policy limit");
      }

      await pool.query("INSERT INTO claims VALUES ($1, $2, $3, $4, $5)", [
        req.body.claimid,
        req.body.policyholderid,
        req.body.policyid,
        req.body.amount,
        req.body.status,
      ]);
      const result = await pool.query("SELECT * FROM claims");
      res.status(201).json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  getClaims: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM claims");
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  updateClaim: async (req, res) => {
    try {
      const claimData = await pool.query(
        "SELECT*FROM claims WHERE claimid = $1",
        [req.body.claimid]
      );
      if (
        claimData.rows.length === 0 ||
        claimData.rows[0].status === "closed"
      ) {
        return res.status(500).json("Sorry this claim does not exist or is closed");
      } else {
        const policyInfo = await pool.query(
          "SELECT * FROM policies WHERE policyid = $1",
          [req.body.policyid]
        );
        if (policyInfo.rows[0].amount < req.body.amount) {
          return res.status(400).json("Policy amount is exceeding");
        } else {
          await pool.query("DELETE FROM claims WHERE claimid = $1", [
            req.body.claimid,
          ]);
          await pool.query("INSERT INTO claims VALUES ($1, $2, $3, $4, $5)", [
            req.body.claimid,
            req.body.policyholderid,
            req.body.policyid,
            req.body.amount,
            req.body.status,
          ]);
        }
      }
      const result = await pool.query("SELECT * FROM claims");
      return res.status(201).json(result.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  deleteClaim: async (req, res) => {
    // const { claimid, policyholderid, policyid } = req.body.;
    const claimStatus = await pool.query(
      "SELECT * FROM claims WHERE claimid = $1",
      [req.body.claimid]
    );
    if (
      claimStatus.rows.length !== 0 &&
      claimStatus.rows[0].status !== "pending"
    ) {
      try {
        await pool.query(
          "DELETE FROM claims WHERE claimid = $1 AND policyholderid = $2 AND policyid = $3",
          [req.body.claimid, req.body.policyholderid, req.body.policyid]
        );
        const result = await pool.query("SELECT * FROM claims");
        return res.json(result.rows);
      } catch (err) {
        return res.status(500).json(err.message);
      }
    } else {
      return res.status(500).json("Claim is either open or does not exist");
    }
  },
};
