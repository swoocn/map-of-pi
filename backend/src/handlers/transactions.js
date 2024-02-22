const express = require('express');
const { route } = require('./users');
const isAuthenticated = require("../authMiddleware/isAuthenticated");
const { getUserTransactions } = require('../controllers/transactionController');


const router = express.Router()

router.post("/",isAuthenticated,getUserTransactions)






module.exports=router