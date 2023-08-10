let express, router, config;
let home_controller, user_controller,
    error_controller, auth_controller,
    dashboard_controller, watch_controller,
    brand_controller,cs_controller;

express = require('express');
router = express.Router();
config = require('./config/index')();

home_controller = require('./controllers/HomeController');
user_controller = require('./controllers/UserController');
error_controller = require('./controllers/ErrorController');
auth_controller = require('./controllers/AuthController');
dashboard_controller = require('./controllers/DashboardController');
watch_controller = require('./controllers/WatchController');
brand_controller = require('./controllers/BrandController');
cs_controller = require('./controllers/CaseSizeController');

/**
 * Frontend Routers
 */
router.get('/', function (req, res) {
    home_controller.run(req, res);
});

router.get('/listings', function (req, res) {
    home_controller.getWatchList(req, res);
});

router.get('/listings-individual/:sku', function (req, res) {
    home_controller.getWatchDetail(req, res);
});


router.get('/add-listing', function (req, res) {
    home_controller.addWatch(req, res);
});

router.get('/add-listing-promote', function (req, res) {
    home_controller.addListingPromote(req, res);
});

router.get('/add-listing-promote', function (req, res) {
    home_controller.addListingPromote(req, res);
});

router.get('/add-listing-promote', function (req, res) {
    home_controller.addListingPromote(req, res);
});
router.post('/add-listing', function (req, res) {
    home_controller.insertWatch(req, res);
});

router.post('/watch/image-upload', function (req, res) {
    home_controller.uploadWatchImage(req, res);
});

/******************************************************************
 *                  User Controller                               /
 ******************************************************************/
router.get('/my-listings', function (req, res) {
    user_controller.myListings(req, res);
});

router.get('/account-settings', function (req, res) {
    user_controller.accountSettings(req, res);
});

router.get('/my-messages', function (req, res) {
    user_controller.myMessages(req, res);
});

router.get('/my-messages-conversation', function (req, res) {
    user_controller.myMessagesConversations(req, res);
});

/******************************************************************
 *                  Auth Controller                               /
 ******************************************************************/
router.get('/auth/login', function (req, res) {
    auth_controller.login(req, res);
});

router.get('/auth/register', function (req, res) {
    auth_controller.register(req, res);
});

router.get('/auth/logout', function (req, res) {
    auth_controller.logout(req, res);
});


router.post('/auth/register', function (req, res) {
    auth_controller.createUser(req, res);
});

router.post('/auth/login', function (req, res) {
    auth_controller.loginUser(req, res);
});
/******************************************************************
 *                  Dashboard Controller                           /
 ******************************************************************/
router.get('/admin/users', function (req, res) {
    dashboard_controller.listUsers(req, res);
});

router.get('/admin/users/:userId', function (req, res) {
    dashboard_controller.editUser(req, res);
});

router.get('/admin/users/delete/:userId', function (req, res) {
    dashboard_controller.deleteUser(req, res);
});

router.post('/admin/users/update/:userId', function (req, res) {
    user_controller.updateUser(req, res);
});

router.post('/users/update/:userId', function (req, res) {
    user_controller.updateUser(req, res);
});

router.post('/users/upload_avatar', function (req, res) {
    user_controller.uploadAvatar(req, res);
});

router.get('/admin/listings', function (req, res) {
    watch_controller.run(req, res);
});

router.get('/admin/listings/:watchId', function (req, res) {
    watch_controller.editWatch(req, res);
});

router.get('/admin/listing/insert', function (req, res) {
    watch_controller.addWatch(req, res);
});

router.get('/admin/listing/delete/:watchId', function (req, res) {
    watch_controller.deleteWatch(req, res);
});

router.post('/admin/listings/update',function (req,res) {
   watch_controller.updateWatch(req,res);
});

router.get('/listings/bulk-delete',function (req,res) {
    watch_controller.bulkWatchDelete(req,res);
});
router.get('/listings/bulk-mark-sold',function (req,res) {
    watch_controller.bulkMarkSold(req,res);
});

router.get('/admin/brands',function (req,res) {
    brand_controller.run(req,res);
});
router.get('/admin/brands/:brandId', function (req, res) {
    brand_controller.editBrand(req, res);
});

router.get('/admin/brand/insert', function (req, res) {
    brand_controller.addBrand(req, res);
});

router.get('/admin/brand/delete/:brandId', function (req, res) {
    brand_controller.deleteBrand(req, res);
});
router.post('/admin/brand/update',function (req,res) {
    brand_controller.updateBrand(req,res);
});

router.get('/admin/case-sizes',function (req,res) {
    cs_controller.run(req,res);
});
router.get('/admin/case-sizes/:csId', function (req, res) {
    cs_controller.editCS(req, res);
});

router.get('/admin/case-size/insert', function (req, res) {
    cs_controller.addCS(req, res);
});

router.get('/admin/case-size/delete/:csId', function (req, res) {
    cs_controller.deleteCS(req, res);
});
router.post('/admin/case-size/update',function (req,res) {
    cs_controller.updateCS(req,res);
});


router.get('*', function (req, res) {
    error_controller.show_404(req, res);
});

module.exports = router;
