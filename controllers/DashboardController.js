let _, async, mongoose, BaseController;
let config, axios, request, fs;
let UserModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');
UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');


module.exports = BaseController.extend({
    name: 'DashboardController',
    listUsers: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'admin') {
            return res.redirect('/*');
        }
        let users = await UserModel.find({role: 'user'});
        v = new View(res, 'backend/user/index');
        v.render({
            title: 'Users',
            session: req.session,
            users: users
        });
    },
    editUser: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'admin') {
            return res.redirect('/*');
        }
        let userId = req.params.userId;
        let userInfo = await UserModel.findOne({user_id: userId});
        if(userInfo != null){
            v = new View(res, 'backend/user/edit');
            v.render({
                title: 'Users',
                session: req.session,
                user_info: userInfo,
                error: req.flash("error"),
                success: req.flash("success"),
            });
        } else {
            return res.redirect('/*')
        }
    },
    deleteUser: async function (req, res) {
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'admin') {
            return res.redirect('/*');
        }
        let userId = req.params.userId;
        let userInfo = await UserModel.findOne({user_id: userId});
        if (userInfo != null) {
            await userInfo.remove();
        }
        return res.redirect('/admin/users');
    },
});
