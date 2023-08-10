let _, async, mongoose, BaseController;
let config, axios, request, fs;
let BrandModel, View;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');

BrandModel = require('../models/brand');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'BrandController',
    run: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let brandList = await BrandModel.find().sort({createdAt: 1});
        v = new View(res, 'backend/brand/index');
        v.render({
            title: 'Brands',
            brand_list: brandList,
            session: req.session,
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    editBrand: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let brandId = req.params.brandId;
        let brandInfo = await BrandModel.findOne({brand_id: brandId});
        if (brandInfo != null) {
            v = new View(res, 'backend/brand/edit');
            v.render({
                title: 'Edit Brand',
                brand_info: brandInfo,
                session: req.session,
                pg_m: true, // if true => show edit, false=>add windows.
                error: req.flash("error"),
                success: req.flash("success"),
            });
        } else {
            return res.redirect('/*');
        }
    },
    updateBrand: async function (req, res) {

        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'user') {
            return res.redirect('/*');
        }
        let bid = req.query.bid;
        let rq = req.body;
        let retURL = "";
        if (bid == "") {
            retURL = "/admin/brand/insert";
        } else {
            retURL = '/admin/brands/' + bid;
        }
        if (bid == "") { //Add mode
            //check previous brand
            let prevBrand = await BrandModel.findOne({name:rq.name});
            if(prevBrand != null){
                req.flash('error','Brand Name already exist!');
                return res.redirect(retURL);
            }
            rq.brand_id = this.makeID('brand_',10);
            rq.createdAt = new Date();
            await BrandModel.collection.insertOne(rq);
            req.flash('success', "New Brand Inserted Successfully");
            return res.redirect(retURL);
        } else { // Edit mode
            let brandInfo = await BrandModel.findOne({brand_id:bid});
            if(brandInfo != null){
                brandInfo = Object.assign(brandInfo,rq);
                await brandInfo.save();
                req.flash('success', 'Brand Updated Successfully');
                return res.redirect(retURL);
            }else{
                return res.redirect('/*');
            }
        }
    },

    addBrand: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        v = new View(res, 'backend/brand/edit');
        v.render({
            title: 'Add Brand',
            session: req.session,
            pg_m: false, // if true => show edit, false=>add windows.
            error: req.flash("error"),
            success: req.flash("success"),
        });
    },
    deleteBrand: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            return res.redirect('/auth/login');
        }
        if (req.session.role == 'user') {
            return res.redirect('/*');
        }
        let wid = req.params.brandId;
        let wInfo = await BrandModel.findOne({brand_id: wid});
        if (wInfo != null) {
            await BrandModel.collection.deleteOne({brand_id:wid});
            req.flash('success','Brand Deleted Successfully');
        } else {
            req.flash('error','Brand invalid');
        }
        return res.redirect('/admin/brands');

    }
});
