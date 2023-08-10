let _, async, mongoose, BaseController;
let config, axios, request, fs;
let CaseSizeModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');

CaseSizeModel = require('../models/casesize');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'CaseSizeController',
    run: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let csList = await CaseSizeModel.find().sort({name: 1});
        v = new View(res, 'backend/case_size/index');
        v.render({
            title: 'Case Sizes',
            cs_list: csList,
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    editCS: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let csId = req.params.csId;
        let csInfo = await CaseSizeModel.findOne({cs_id: csId});
        if (csInfo != null) {
            v = new View(res, 'backend/case_size/edit');
            v.render({
                title: 'Edit Case Size',
                cs_info: csInfo,
                session: req.session,
                pg_m: true, // if true => show edit, false=>add windows.
                error: req.flash("error"),
                success: req.flash("success"),
            });
        } else {
            return res.redirect('/*');
        }
    },
    updateCS: async function (req, res) {

        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let csid = req.query.csid;
        let rq = req.body;
        let retURL = "";
        if (csid == "") {
            retURL = "/admin/case-size/insert";
        } else {
            retURL = '/admin/case-sizes/' + csid;
        }
        if (csid == "") { //Add mode
            //check previous case size...
            let prevCaseSize = await CaseSizeModel.findOne({case_size:rq.name});
            if(prevCaseSize != null){
                req.flash('error','Case Size already exit!, Please enter different size.');
                return res.redirect(retURL);
            }
            rq.cs_id = this.makeID('cs_',10);
            rq.createdAt = new Date();
            await CaseSizeModel.collection.insertOne(rq);
            req.flash('success', "New Case Size Inserted Successfully");
            return res.redirect(retURL);
        } else { // Edit mode
            let csInfo = await CaseSizeModel.findOne({cs_id:csid});
            if(csInfo != null){
                csInfo = Object.assign(csInfo,rq);
                await csInfo.save();
                req.flash('success', 'Case Size Updated Successfully');
                return res.redirect(retURL);
            }else{
                return res.redirect('/*');
            }
        }
    },

    addCS: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        v = new View(res, 'backend/case_size/edit');
        v.render({
            title: 'Add CaseSize',
            session: req.session,
            pg_m: false, // if true => show edit, false=>add windows.
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    deleteCS:async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        let csid = req.params.csId;
        let csInfo = await CaseSizeModel.findOne({cs_id: csid});
        if (csInfo != null) {
            await CaseSizeModel.collection.deleteOne({cs_id:csid});
            req.flash('success','Case Size Deleted Successfully');
        } else {
            req.flash('error','Case Size invalid');
        }
        return res.redirect('/admin/case-sizes');

    }
});
