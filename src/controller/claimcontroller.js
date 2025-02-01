const Claims = require("../models/claims");
const { policy } = require("../data/data");
const { policyholder } = require("../data/data");
const { claims } = require("../data/data");

module.exports = {
  createClaims: async (req, res) => {
    if (policyholder.has(req.body.policyholderid)) {
      const policyHolderInfo = policyholder.get(req.body.policyholderid);
      const policyInfo = req.body.policyid;
      const amountInfo = req.body.amount;
      if (policyInfo != policyHolderInfo.policyid) {
        return res.status(400).json("Sorry you do not have this policy");
      } else if (amountInfo > policyHolderInfo.amount) {
        return res
          .status(400)
          .json("Sorry requested amount is greater than insaurance amount");
      }
    } else {
      return res
        .status(400)
        .json("Sorry you do not have permission to delete this claim");
    }
    
    const newClaim = new Claims(
      req.body.claimid,
      req.body.policyid,
      req.body.policyholderid,
      req.body.amount
    );
    // console.log(newClaim);
    claims.set(req.body.claimid, newClaim);
    res.status(201).json(Array.from(claims.values()));
  },
  getClaims: (req, res) => {
    res.json(Array.from(claims.values()));
  },
  deleteClaim: (req, res) => {
    //Check karo if specific claim exist or not
    if (claims.has(req.body.claimid)) {
      //Check karo if that claim belong to right holder
      const claiminfo = claims.get(req.body.claimid);
      const claimholder = claiminfo.policyholderid;
      const claimpolicy = claiminfo.policyid;
      if (
        claimholder === req.body.policyholderid &&
        claimpolicy === req.body.policyid
      ) {
        claims.delete(req.body.claimid);
        res.json(Array.from(claims.values()));
      } else {
        return res
          .status(400)
          .json("Sorry you do not have permission to delete this claim");
      }
    } else {
      return res
        .status(400)
        .json("Sorry you do not have permission to delete this claim");
    }
  },
};
