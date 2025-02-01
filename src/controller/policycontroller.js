const Policy = require("../models/policy");
const { policy } = require("../data/data");

module.exports = {
  createPolicy: async (req, res) => {
    if (policy.has(req.body.policyid)) {
      return res
        .status(400)
        .json("Policy with this id already exist, please enter new Id");
    }
    const newpolicy = new Policy(
      req.body.policyid //first parameter
      // req.body.policyholderid, //second parameter
      // req.body.amount //third parameter
    );
    policy.set(req.body.policyid, newpolicy);
    res.status(201).json(Array.from(policy.values()));
  },
  getPolicy: (req, res) => {
    res.json(Array.from(policy.values()));
  },
  deletePolicy: (req, res) => {
    if (policy.has(req.body.policyid)) {
      policy.delete(req.body.policyid);
      res.status(201).json(Array.from(policy.values()));
    } else {
      res
        .status(401)
        .json("Sorry, you do not have access to delete this policy");
    }
  },
};
