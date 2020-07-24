const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{ res.send("Landing!"); })

router.get("/signup",(req,res)=>{res.render('sign_up');})

router.get("/login",(req,res)=>{res.render('log_in');})

router.get("/product",(req,res)=>{res.render('enter_your_item_details');})

router.get("/service",(req,res)=>{res.render('enter_your_service_details');})

router.get('/products', (req,res) => {res.render('items_available');})

router.get('/services', (req,res) => {res.render('services_available');})

router.get('/profile', (req,res) => {res.render('profile_page');})

module.exports=router;