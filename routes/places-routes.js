const express = require("express");
const axios = require('axios');
const Httperror = require("../helper/Httperror");

const router = express.Router();

router.get("/vibesChart", async (req, res, next) => {
  try{
    const data = await axios.get('https://api.stxtools.io/tokens/SP27BB1Y2DGSXZHS7G9YHKTSH6KQ6BD3QG0AN3CR9.vibes-token/ohlc')
    
    console.log('test pick dara',data.data)
    res.json(data.data)
  }catch(e){
    console.log('error',e)
    return next(new Httperror('error', 500));
  }
});

router.get("/vibesValue", async (req, res, next) => {
  try{
    const data = await axios.get('https://api.stxtools.io/tokens/SP27BB1Y2DGSXZHS7G9YHKTSH6KQ6BD3QG0AN3CR9.vibes-token')
    console.log('test pick dara',data.data)
    res.json(data.data)
  }catch(e){
    console.log('error',e)
    return next(new Httperror('error', 500));
  }
});



module.exports = router;
