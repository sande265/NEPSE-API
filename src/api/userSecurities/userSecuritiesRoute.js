const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation");
const { getUserSecurities, getTodaysValue } = require('./userSecuritiesController');

router.get("/user-scrips", verifyToken, getUserSecurities);
router.get("/stats", verifyToken, getTodaysValue)


module.exports = router