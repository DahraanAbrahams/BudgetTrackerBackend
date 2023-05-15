const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/authentication');

const { getAllUsers,
        getSingleUser,
        showCurrentUser,
        updateUser,
        updateUserPassword
} = require('../controllers/userController');
const testUser = require('../middleware/testUser');


router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, testUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, testUser, updateUserPassword)

router.route('/:id').get(authenticateUser, getSingleUser);


module.exports = router;
