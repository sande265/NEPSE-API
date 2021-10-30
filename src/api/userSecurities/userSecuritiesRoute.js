const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation");
const { getUserSecurities } = require('./userSecuritiesController');

router.get("/user-scrips/:id", getUserSecurities);


module.exports = router