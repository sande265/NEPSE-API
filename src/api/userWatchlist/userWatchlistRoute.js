const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation");
const { createWatchlist, getAllWatchlists, getWatchlist, updateWatchList, deleteWatchlist } = require('./userWatchlistController');

router.post("/configs", verifyToken, createWatchlist);
router.get("/configs", verifyToken, getAllWatchlists);
router.get("/config/:id", verifyToken, getWatchlist);
router.patch("/config/:id", verifyToken, updateWatchList);
router.delete("/config/:id", verifyToken, deleteWatchlist)


module.exports = router