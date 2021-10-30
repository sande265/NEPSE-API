const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation");
const { createSecurity, getSecurities, getSecurity, updateSecurity, deleteSecurity, createCompanies } = require('./securitiesController');

router.post("/securities", verifyToken, createSecurity);
router.post("/companies", verifyToken, createCompanies);
router.get("/securities", verifyToken, getSecurities);
router.get("/security/:id", verifyToken, getSecurity);
router.patch("/security/:id", verifyToken, updateSecurity);
router.delete("/security/:id", verifyToken, deleteSecurity)


module.exports = router