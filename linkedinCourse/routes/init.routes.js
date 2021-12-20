const {Router} = require('express');
const cors = require('cors');
const authRouter = require("./auth");
const apiRouter= require('./api');
const playgroundRouter = require("./playground");


const router = Router();


// this module returns a function and this allows you to pass params down to the routing chain

module.exports = (params) => {
    // @desc    index page
    // @route   GET `/`
    // @access  public
    router.get('/', (req, res)=>{
      res.render('index', {page: "index"});
    })

    // @desc    myaccount page
    // @route   GET `/myaccount`
    // @access  public
    router.get('/myaccount', (req, res)=>{
      res.render('myaccount', {page: "myaccount"});
    })

    // This delegates everything uner/ auth to the respective routing module and pass the paramd down the routing chain

    router.use('/auth', authRouter(params));
    router.use('/playground', playgroundRouter(params))

    router.use('/api', cors(), apiRouter(params));
    return router;
}