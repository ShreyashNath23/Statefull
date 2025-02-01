const express = require("express");
const router = express.Router();
const policyholdercontroller = require("../controller/policyholdercontroller");

router.post("/", policyholdercontroller.createPolicyHolder);
router.get("/", policyholdercontroller.getPolicyHolder);
// router.post("/update",);
router.post("/delete", policyholdercontroller.deletePolicyHolder);

module.exports = router;
