let _, async, mongoose, BaseController;
let config, axios, request, fs, crypto;
let UserModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
crypto = require('crypto');
config = require('../config/index')();
fs = require('fs');
UserModel = require('../models/user');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'AuthController',
    login: async function (req, res) {
        let v;
        v = new View(res, 'auth/login');
        v.render({
            title: 'Sign In',
            session:req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    register: async function (req, res) {
        let v;

        if (this.isLogin(req)) {
            return res.redirect('/');
        }

        v = new View(res, 'auth/register');
        v.render({
            title: 'Sign Up',
            session:req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        })
    },
    loginUser : async function(req,res) {
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let email = req.body.email.trim();
        let password = crypto.createHash('md5').update(req.body.password).digest("hex");
        let userInfo = await UserModel.findOne({email:email,password:password});
        if(userInfo == null){
            req.flash('error','Incorrect email or password.');
            return res.redirect('/auth/login');
        }
        req.session.login = true;
        req.session.user = userInfo;
        return res.redirect('/');

    },
    createUser: async function (req, res) {
        //check validation
        if (this.isLogin(req)) {
            return res.redirect('/');
        }
        let password = req.body.password;
        let email = req.body.email;
        let confirm_password = req.body.confirm_password;

        let pw_data = this.checkPasswordValidation(password, confirm_password);
        if (!pw_data.st) {
            req.flash('error', pw_data.msg);
            return res.redirect('/auth/register');
        }

        let prevUserByEmail = await UserModel.findOne({email: email});
        if (prevUserByEmail != null) {
            req.flash('error', 'The Email has already been taken');
            return res.redirect('/auth/register');
        }

        password = crypto.createHash('md5').update(password).digest("hex");

        let that = this;
        await UserModel.collection.insertOne({
            user_id:that.makeID('user_', 10),
            email:email.trim(),
            password:password,
            fname:req.body.fname,
            sname:req.body.sname,
            address1:req.body.address1,
            address2:req.body.address2,
            createdAt:new Date(),
            role:'user'
        });

        req.flash('success','Registered successfully');
        return res.redirect('/auth/login');
    },
    logout: async function(req,res) {
        req.session.login = false;
        req.session.user = null;
        req.session.save();
        return res.redirect('/');
    },
    checkPasswordValidation: function (pwd, confirm_pwd) {
        let ret = {
            st: false,
            msg: ""
        };
        if (pwd.trim().length < 6) {
            ret.msg = "The password must be at least 6 characters.";
            return ret;
        }
        if (pwd != confirm_pwd) {
            ret.msg = "The password confirmation does not match";
            return ret;
        }
        ret.st = true;
        return ret;

    }
});
