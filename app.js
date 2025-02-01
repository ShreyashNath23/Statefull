const express = require("express");
const app = express();
app.use(express.json()); //why??


const policyroute = require("./src/routes/policyroute");
const policyholderroute = require("./src/routes/policyholderroute");
const claimroute = require("./src/routes/claimroute");

app.get("/", (req, res) => {
  res.send(console.log("Welcome to the server"));
});

app.use("/policy", policyroute);
app.use("/policyholder", policyholderroute);
app.use("/claim", claimroute);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
