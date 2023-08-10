let _, async, mongoose, BaseController;
let config, axios, request, fs, View;
let WatchModel, UserModel, crypto;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');
crypto = require('crypto');

WatchModel = require('../models/watch');
UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'UserController',
    myListings: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let userId = req.session.user.user_id;
        let my_listings = await WatchModel.find({user_id:userId});

        v = new View(res, 'frontend/user/my-listings');
        v.render({
            title: 'My Listings',
            session: req.session,
            my_listings:my_listings
        });
    },

    accountSettings: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'frontend/user/account-setting');
        v.render({
            title: 'Account Settings',
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },

    updateUser: async function (req, res) {

        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }

        let userId = "";
        let redirectUrl = "";
        if (req.originalUrl.indexOf('/admin/users/update')>-1) {
            userId = req.params.userId;
            redirectUrl = '/admin/users/' + userId;
        } else {
            redirectUrl = '/account-settings';
            //Validation
            let email = req.body.email.trim();
            let password = req.body.password;
            let confirm_password = req.body.confirm_password;
            if(email == ""){
                req.flash('error','Empty Email Field');
                return res.redirect(redirectUrl);
            }
            if(!this.isEmail(email)){
                req.flash('error','Invalid Email Format');
                return res.redirect(redirectUrl);
            }
            if(password.length<6 && password.length>0 ){
                req.flash('error','The password must be at least 6 characters.');
                return res.redirect(redirectUrl);
            }
            if(password != confirm_password){
                req.flash('error','The password confirmation does not match');
                return res.redirect(redirectUrl);
            }
            if(req.body.avatar.length == 0){
                req.flash('error','Empty Profile Photo!');
                return res.redirect(redirectUrl);
            }
            userId = req.session.user.user_id;
        }

        if(req.body.password != req.body.confirm_password){
            req.flash('error','The password confirmation does not match');
            return res.redirect(redirectUrl);
        }
        if (req.body.password.length >0 && req.body.password.trim().length < 6) {
            req.flash('redirect', 'The password must be at least 6 characters.!');
            return res.redirect(redirectUrl);
        }
        let userInfo = await UserModel.findOne({user_id: userId});
        console.log(userId);
        if (userInfo != null) {
            userInfo.email = req.body.email;
            userInfo.fname = req.body.fname;
            userInfo.sname = req.body.sname;
            userInfo.address1 = req.body.address1;
            userInfo.address2 = req.body.address2;
            userInfo.fb_link = req.body.fb_link;
            userInfo.tw_link = req.body.tw_link;
            userInfo.inst_link = req.body.inst_link;
            if(req.originalUrl.indexOf('/admin/users/update')< 0){
                userInfo.avatar = req.body.avatar;
                req.session.user = userInfo;
                req.session.save();
            }
            if(req.body.password.length >0 || req.body.password !="" ){
                userInfo.password = crypto.createHash('md5').update(req.body.password).digest("hex");
            }
            await userInfo.save();
            req.flash('success', 'Account Information Saved successfully!');

            console.log(redirectUrl);
            return res.redirect(redirectUrl);

        } else {
            res.redirect('/auth/login');
        }
    },

    uploadAvatar: async function (req, res) {
        let upload_file, fn, ext, dest_fn, user_id, user_info;
        user_id = req.body.user_id;
        user_info = await UserModel.findOne({user_id: user_id});
        upload_file = req.files.file;
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        if (ext == 'blob') ext = 'png';
        dest_fn = this.makeID('avatar_', 10) + "." + ext;
        upload_file.mv('public/uploads/avatar/' + dest_fn, async function (err) {
            if (err) {
                console.log('File Uploading Error');
                console.log(err);
                return res.send({status: 'fail', data: 'Avatar Image Uploading Error'});
            }
            if (user_info != null) {
                user_info.avatar = '/uploads/avatar/' + dest_fn;
                user_info.save();
            }
            return res.send({status: 'success', data: '/uploads/avatar/' + dest_fn});
        });
    },
    myMessages:async function(req,res){
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'frontend/user/my-messages');
        v.render({
            title: 'My Messages',
            session: req.session
        });
    },
    myMessagesConversations: async function(req,res){
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        v = new View(res, 'frontend/user/my-messages-conversations');
        v.render({
            title: 'My Messages',
            session: req.session
        });
    }
});
