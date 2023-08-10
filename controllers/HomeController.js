let _, async, mongoose, BaseController, View;
let config, axios, request,fs;

let UserModel,WatchModel,
    BrandModel,CaseSizeModel;

async = require("async");
mongoose = require('mongoose');
axios = require('axios');
config = require('../config/index')();
fs = require('fs');

UserModel = require('../models/user');
BrandModel = require('../models/brand');
CaseSizeModel = require('../models/casesize');
WatchModel = require('../models/watch');

BaseController = require('./BaseController');
View = require('../views/base');

request = require('request');

module.exports = BaseController.extend({
    name: 'HomeController',
    run:async function(req,res){

        this.config();///Make Demo Database...

        let v;
        let watchList = await WatchModel.find({is_sold:false}).limit(6); // we must consider about expire time.
        v = new View(res, 'frontend/home/index');
        v.render({
            title: 'Welcome to BezelHeads',
            watch_list:watchList,
            session:req.session
        });
    },
    getWatchList: async function (req, res) {
        let v;
        let watchList = [];
        let genders = req.query.gd || "";
        let brands = req.query.br || "";
        let caseSizes = req.query.cs || "";
        let caseMateriails = req.query.cm || "";
        let movements = req.query.mv || "";
        let fromPrice = req.query.from || 0;
        let toPrice = req.query.to || Infinity;

        let ctgBrands = await BrandModel.find();
        let ctgCaseSizes = await CaseSizeModel.find().sort({name:1});

        let q = req.query.q;
        if(typeof q == 'undefined'){
            genders = genders.split('-');
            brands = brands.split('-');
            caseSizes = caseSizes.split('-');
            caseMateriails = caseMateriails.split('-');
            movements = movements.split('-');
            let sql = [];
            if(genders.length>0 && genders[0] != "") sql.push( {gender:{$in:genders}});
            if(brands.length>0 && brands[0] != "") {
                console.log(brands);
                sql.push( {brand:{$in:brands}});
            }
            if(caseSizes.length>0 && caseSizes[0] != "") sql.push( {case_size:{$in:caseSizes}});
            if(caseMateriails.length>0 && caseMateriails[0] != "") sql.push( {case_material:{$in:caseMateriails}});
            if(movements.length>0 && movements[0] != "") sql.push( {movement:{$in:movements}});

            if(sql.length>0) {
                watchList = await WatchModel.find({
                    $and:sql,price: {
                        $gte:Number(fromPrice),
                        $lt:Number(toPrice)
                    }
                });
            }else{
                watchList = await WatchModel.find({
                    price: {
                        $gte:Number(fromPrice),
                        $lt:Number(toPrice)
                    }
                });
            }

            v = new View(res, 'frontend/home/filter');
            v.render({
                title: 'Watch Listings',
                watch_list:watchList,
                session:req.session,
                bds:ctgBrands,
                csizes:ctgCaseSizes
            });
        }else{
            watchList = await this.applySearch(req.query.q);
            v = new View(res, 'frontend/home/filter');
            v.render({
                title: 'Watch Listings',
                watch_list:watchList,
                session:req.session,
                bds:ctgBrands,
                csizes:ctgCaseSizes
            });
        }
    },

    applySearch:async function (keyword){
        let q = keyword.toLowerCase();
        let watchList = await WatchModel.find();
        let retArr = [];
        for(let i = 0; i<watchList.length; i++){
            let watchInfo = watchList[i];
            if( watchList[i].gender.toLowerCase().indexOf(q)>-1 ||
                watchList[i].brand.toLowerCase().indexOf(q)>-1 ||
                watchList[i].model.toLowerCase().indexOf(q)>-1 ||
                watchList[i].case_size.toLowerCase().indexOf(q)>-1 ||
                watchList[i].movement.toLowerCase().indexOf(q)>-1 ||
                watchList[i].case_material.toLowerCase().indexOf(q)>-1 ||
                watchList[i].strap_material.toLowerCase().indexOf(q)>-1 ||
                watchList[i].description.toLowerCase().indexOf(q)>-1
            ){
                retArr.push(watchInfo);
            }
        }
        return retArr;
    },

    getWatchDetail:async function (req,res) {
        let v;
        let sku = req.params.sku;
        if(typeof sku == "undefined"){
            return res.redirect('/');
        }
        let watchInfo = await WatchModel.findOne({sku:sku});
        if(watchInfo!=null){
            v = new View(res, 'frontend/detail/index');
            v.render({
                title: 'Watch Listings',
                watch_info:watchInfo,
                session:req.session,
            });
        }else{
            return res.redirect('/');
        }
    },
    addWatch:async function (req,res) {
        let v;
        if(!this.isLogin(req)){
            return res.redirect('/auth/login');
        }
        let ctgBrands = await BrandModel.find();
        let ctgCaseSizes = await CaseSizeModel.find().sort({name:1});
        v = new View(res, 'frontend/detail/add');
        v.render({
            title: 'List an Item',
            session:req.session,
            bds:ctgBrands,
            csizes:ctgCaseSizes
        });
    },
    addListingPromote:function(req,res){
        let v;
        if(!this.isLogin(req)){
            return res.redirect('/auth/login');
        }
        v = new View(res, 'frontend/detail/add-listing-promote');
        v.render({
            title: 'List an Item - Promote',
            session:req.session,
        });
    },

    insertWatch:async function (req,res) {
        //File upload
        if(!this.isLogin(req)){
            return res.redirect('/auth/login');
        }
        let reqBody = req.body;
        reqBody.user_id = req.session.user.user_id;
        reqBody.is_sold = false;
        reqBody.is_cert = (reqBody.is_cert == 'true');
        reqBody.is_box = (reqBody.is_box == 'true');
        reqBody.promote = "";
        reqBody.watch_id = this.makeID("",10);
        reqBody.sku = reqBody.watch_id;
        reqBody.title = "";
        reqBody.createdAt = new Date();
        reqBody.price  = Number(reqBody.price);
        await WatchModel.collection.insertOne(reqBody);
        return res.json({status:'success',data:"Saved New Watch Item"});
    }
    ,
    uploadWatchImage:async function (req,res) {
        if(!this.isLogin(req)){
            return res.json({status: 'fail', data: 'Login Session Expired'});
        }
        let filePaths = [];
        let upload_file = req.files.file;
        let fn = upload_file.name;
        let ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        if (ext == 'blob') ext = 'png';
        let dest_fn = this.makeID('watch_', 10) + "." + ext;
        upload_file.mv('public/uploads/watch/' + dest_fn, async function (err) {
            if (err) {
                console.log('File Uploading Error');
                return res.json({status: 'fail', data: 'Watch Image Uploading Error'});
            }
            filePaths.push("uploads/watch/" + dest_fn);
            return res.json({status:'success',data:filePaths});
        });
    },
    config:async function(){
        ///Add Admin
        let i = 0;
        let self = this;
        let adminInfo = await UserModel.findOne({role:'admin'});
        if(adminInfo == null){
            await UserModel.collection.insertOne({
                "user_id" : "user_BuUbruAfUe",
                "email" : "admin@admin.com",
                "password" : "02a05c6e278d3e19afaca4f3f7cf47d9", /// Password is "qqqqqqq"
                "fname" : "",
                "sname" : "",
                "address1" : "",
                "address2" : "",
                "createdAt" : new Date("2018-12-28T16:08:51.667Z"),
                "role" : "admin",
                "avatar" : "uploads/watch/watch_T8TYd9xver.jpg",
                "fb_link" : "",
                "inst_link" : "",
                "tw_link" : ""
            });
        }
        //Add Brands
        let Brands = await BrandModel.find();
        if(Brands.length == 0 ){
            for(let i = 0; i<config.brands.length; i++){
                await BrandModel.collection.insertOne({
                   brand_id:self.makeID('brand_',10),
                   name:config.brands[i],
                   description:config.brands[i],
                   createdAt:new Date()
                });
            }
        }
        //Add Case Sizes
        let caseSizes = await CaseSizeModel.find();
        if(caseSizes.length == 0){
            for(i = 0; i<config.case_sizes.length;i++){
                await CaseSizeModel.collection.insertOne({
                    cs_id:self.makeID('cs_',10),
                    name:config.case_sizes[i],
                    description:config.case_sizes[i],
                    createdAt:new Date()
                })
            }
        }
    }
});
