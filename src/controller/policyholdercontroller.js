const pool = require("../../db");

module.exports = {
  createPolicyHolder: async (req, res) => {
    // const { policyholderid, policyid, name, amount } = req.body.;
    try {
      // Check policy exists
      const policyExists = await pool.query(
        "SELECT * FROM policies WHERE policyid = $1",
        [req.body.policyid]
      );
      //
      if (
        policyExists.rows.length === 0 ||
        policyExists.rows[0].amount < req.body.amount
      ) {
        return res
          .status(400)
          .json(
            "Policy does not exist or amount exceeds the maximum amount allowed under the policy"
          );
      }

      await pool.query("INSERT INTO policyholder VALUES ($1, $2, $3, $4)", [
        req.body.policyholderid,
        req.body.policyid,
        req.body.name,
        req.body.amount,
      ]);
      const result = await pool.query("SELECT * FROM policyholder");
      res.status(201).json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  getPolicyHolder: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM policyholder");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  updatePolicy: async (req, res) => {
    // const { policyholderid, policyid, name, amount } = req.body;
    try {
      const holderInfo = await pool.query(
        "SELECT*FROM policyholder WHERE policyholderid = $1 AND policyid = $2",
        [req.body.policyholderid, req.body.policyid]
      );
      if (holderInfo.rows.length === 0) {
        res.status(400).json("This policy holder does not exist");
      } else {
        if (holderInfo.rows[0].policyid !== req.body.policyid) {
          res
            .status(500)
            .json("Sorry this policy holder do not have this policy");
        } else {
          const policyInfo = await pool.query(
            "SELECT * FROM policies WHERE policyid = $1",
            [req.body.policyid]
          );
          if (policyInfo.rows[0].amount < req.body.amount) {
            return res.status(400).json("Policy amount is exceeding");
          } else {
            await pool.query(
              "DELETE FROM policyholder WHERE policyholderid = $1 AND policyid = $2",
              [req.body.policyholderid, req.body.policyid]
            );
            await pool.query("INSERT INTO policyholder VALUES ($1,$2,$3,$4)", [
              req.body.policyholderid,
              req.body.policyid,
              req.body.name,
              req.body.amount,
            ]);
          }
        }
        const result = await pool.query("SELECT * FROM policyholder");
        res.status(201).json(result.rows);
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  deletePolicyHolder: async (req, res) => {
    // const { policyholderid, policyid } = req.body;
    try {
      await pool.query(
        "DELETE FROM policyholder WHERE policyholderid = $1 AND policyid = $2",
        [req.body.policyholderid, req.body.policyid]
      );
      const result = await pool.query("SELECT * FROM policyholder");
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
};
