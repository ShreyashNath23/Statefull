const policyHolder = require("../models/policyholder");
const { policy } = require("../data/data");
const { policyholder } = require("../data/data");

module.exports = {
  createPolicyHolder: async (req, res) => {
    if (!policy.has(req.body.policyid)) {
      return res.status(400).json("This Policy does not exist");
    }
    const newPolicyHolder = new policyHolder(
      req.body.policyholderid,
      req.body.policyid,
      req.body.name,
      req.body.amount
    );
    policyholder.set(req.body.policyholderid, newPolicyHolder);
    res.status(201).json(Array.from(policyholder.values()));
  },
  getPolicyHolder: (req, res) => {
    res.json(Array.from(policyholder.values()));
  },
  // updatePolicyHolder: async (req, res) => {
  //   //Check karo ki policyholder for specific policy exist or not
  //   if (
  //     policyholder.has(req.body.policyholderid) &&
  //     policyholder.has(req.body.policyid)
  //   ) {
  //     policyholder.delete(req.body.policyholderid);
  //     res.json(Array.from(policyholder.values()));
  //   } else {
  //     res.status(400), json("Sorry, you can not update this policy");
  //   }
  // },
  deletePolicyHolder: async (req, res) => {
    if (policyholder.has(req.body.policyholderid)) {
      const policyHolderInfo = policyholder.get(req.body.policyholderid);
      const policyInfo = policyHolderInfo.policyid;
      if (policyInfo === req.body.policyid) {
        policyholder.delete(req.body.policyholderid);
        res.status(200).json(Array.from(policyholder.values()));
      } else {
        res.status(400), json("Sorry, you can not have the access delete this");
      }
    } else {
      res.status(400), json("Sorry, you can not have the access delete this");
    }
  },
};
