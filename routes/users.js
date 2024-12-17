const express = require('express');
const router = express.Router();
const usersController = require('../controller/users');

router.get('/bulkUploadUsers',usersController.bulkUploadUsers);

module.exports = router