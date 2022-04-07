const express = require("express");
const router = express.Router();

const { register, checkOverlap } = require("../controller/User/register");
const { login, get_walletType, pubkey_get }  = require("../controller/User/login");
const logout = require("../controller/User/logout");
const auth = require("../middleware/auth");
const authentication_account = require("../controller/User/authentication_account");
const create_eoa = require("../controller/User/create_eoa");
const faucet = require("../controller/User/faucet");

// /api/blockreview/user
router.post("/register", register);
router.post("/register/overlapcheck", checkOverlap);

router.post("/login", login);
router.post("/findwallettype", get_walletType);
router.post("/matchingpubkey", pubkey_get);
router.post("/logout", auth, logout);
router.post("/auth", auth, authentication_account);

router.get("/eoa/create", create_eoa);
router.post("/faucet", faucet);

module.exports = router;