const express = require('express');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//load the user from the database if there is a userId inside the session
app.use(async (req, res, next)=>{
  if(!req.session.userId) return next();
  const user = await UserService.findById(req.session.userId);
  if(!user){
    req.session.userId = null;
    return next();
  }
  //the user object
  req.user = user;
  res.locals.user = user;
})