let _, async, mongoose, BaseController;
let config, axios, request, fs, View;
let WatchModel,BrandModel,CaseSizeModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');

WatchModel = require('../models/watch');
BrandModel = require('../models/brand');
CaseSizeModel = require('../models/casesize');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'WatchController',
    run: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let watchList = await WatchModel.find().sort({createdAt: 1});
        v = new View(res, 'backend/watch/index');
        v.render({
            title: 'Listings',
            watch_list: watchList,
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    editWatch: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let watchId = req.params.watchId;
        let watchInfo = await WatchModel.findOne({watch_id: watchId});

        let ctgBrands = await BrandModel.find();
        let ctgCaseSizes = await CaseSizeModel.find().sort({name:1});

        if (watchInfo != null) {
            v = new View(res, 'backend/watch/edit');
            v.render({
                title: 'Edit Listing',
                watch_info: watchInfo,
                session: req.session,
                pg_m: true, // if true => show edit, false=>add windows.
                bds:ctgBrands,
                csizes:ctgCaseSizes,
                error: req.flash("error"),
                success: req.flash("success"),
            });
        } else {
            return res.redirect('/*');
        }
    },
    updateWatch: async function (req, res) {

        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let wid = req.query.wid;
        let retURL = "";
        if (wid == "") {
            retURL = "/admin/listing/insert";
        } else {
            retURL = '/admin/listings/' + wid;
        }
        let rq = req.body;
        if (Number(rq.price) <= 0) {
            req.flash('error', 'Price Invalid');
            return res.redirect(retURL)
        }
        if (rq.model.trim() == "") {
            req.flash('error', 'Model Empty');
            return res.redirect(retURL)
        }

        if (rq.thumbnails.trim() == "") {
            req.flash('error', 'Photo List Invalid');
            return res.redirect(retURL)
        }

        if (rq.case_material.trim() == "") {
            req.flash('error', 'Case Material Empty');
            return res.redirect(retURL)
        }
        if (rq.strap_material.trim() == "") {
            req.flash('error', 'Strap Material Empty');
            return res.redirect(retURL)
        }
        if (rq.age.trim() == "") {
            req.flash('error', 'Age Empty');
            return res.redirect(retURL)
        }
        if (rq.contact_name.trim() == "") {
            req.flash('error', 'Contact Name Invalid');
            return res.redirect(retURL)
        }
        if (rq.contact_email.trim() == "" || !this.isEmail(rq.contact_email.trim())) {
            req.flash('error', 'Contact Email Empty');
            return res.redirect(retURL)
        }
        if (rq.contact_phone.trim() == "") {
            req.flash('error', 'Contact Phone Empty');
            return res.redirect(retURL)
        }
        if (rq.location.trim() == "") {
            req.flash('error', 'Contact Location Invalid');
            return res.redirect(retURL)
        }

        if (wid == "") { //Add mode
            rq.user_id = req.session.user.user_id;
            rq.watch_id = this.makeID('', 10);
            rq.sku = rq.watch_id;
            rq.is_sold = (rq.is_sold == 'Yes');
            rq.createdAt = new Date();
            await WatchModel.collection.insertOne(rq);
            req.flash('success', "New Listing Inserted Successfully");
            return res.redirect(retURL);

        } else { // Edit mode
            rq.thumbnails = rq.thumbnails.split(',');
            let watchInfo = await WatchModel.findOne({watch_id: wid});
            rq.is_sold = (rq.is_sold == 'Yes');
            watchInfo = Object.assign(watchInfo, rq);
            await watchInfo.save();
            req.flash('success', 'Listing Updated Successfully');
            return res.redirect(retURL);
        }
    },

    addWatch: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        v = new View(res, 'backend/watch/edit');
        let ctgBrands = await BrandModel.find();
        let ctgCaseSizes = await CaseSizeModel.find().sort({name:1});
        v.render({
            title: 'Add Listing',
            session: req.session,
            pg_m: false, // if true => show edit, false=>add windows.
            bds:ctgBrands,
            csizes:ctgCaseSizes,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    deleteWatch: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        let wid = req.params.watchId;
        let wInfo = await WatchModel.findOne({watch_id: wid});
        if (wInfo != null) {
            await WatchModel.collection.deleteOne({watch_id:wid});
            req.flash('success','Listing Deleted Successfully');
        } else {
            req.flash('error','Listing invalid');
        }
        return res.redirect('/admin/listings');

    },
    bulkWatchDelete:async function(req,res){
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let watchIds = req.query.wids.split(',');
        for(let i = 0; i<watchIds.length; i++){
            let watchInfo = await WatchModel.findOne({watch_id:watchIds[i],user_id:req.session.user.user_id});
            if(watchInfo != null){
                await WatchModel.collection.deleteOne({watch_id:watchIds[i]});
            }
        }
        return res.redirect('/my-listings');
    },
    bulkMarkSold: async function(req,res){
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        let watchIds = req.query.wids.split(',');
        for(let i = 0; i<watchIds.length; i++){
            let watchInfo = await WatchModel.findOne({watch_id:watchIds[i],user_id:req.session.user.user_id});
            if(watchInfo != null){
                watchInfo.is_sold = true;
                await watchInfo.save();
            }
        }
        return res.redirect('/my-listings');
    },
});
