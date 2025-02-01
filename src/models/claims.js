class claims {
  constructor(claimid, policyid, policyholderid, amount) {
    this.claimid = claimid;
    this.policyid = policyid;
    this.policyholderid = policyholderid;
    this.amount = amount;
  }
}

module.exports = claims;
