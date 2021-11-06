const { createUser, getUserById, getUsers, updateUser, deleteUser, getLoggedUser, verifyUser, resendVerification } = require('./userController');
const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation");
const { generateToken } = require('./userModel');

router.post("/register", createUser);
router.get("/users", verifyToken, getUsers);
router.get('/me', verifyToken, getLoggedUser);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser)
router.get("/verify", verifyUser)
router.get("/new-request", resendVerification)


module.exports = router