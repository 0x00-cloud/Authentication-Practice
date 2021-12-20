const {Router} = require('express');
const UserService = require('../../services/UserService');
const router = Router();
const validation = reqiured('../../middlewares/validation');


module.exports = () => {

  router.get('/login', (req, res)=>{
    return res.render('auth/login', {page: "login"});
  })


  //TODO: Implement rate limiting and block the ip after (given number of requests)

  router.post('/login', validation.validateEmail, validation.validatePassword,async(req, res, next)=>{
    try{
      const errors = [];

      const user = await UserService.findByUsername(req.body.username);

      if(!user){
        error.push("username");
        error.push("password");
        req.session.messages.push({
          text: "Invalid username or password",
          type: "danger",
        })
      }
      const isValid = await user.comparePassword(req.body.password);
      if(!isValid){
        errors.push("username");
        errors.push("password");
        req.session.message.push({
          text: "Invalid username or password";
          type: "danger"
        })
      }
      if(errors.length) {
        return res.render('auth/login', {
          page: "login",
          data: req.body,
          errors
        })
      }

      req.session.userId = user.id;
      req.session.messages.push({
        text: "You are logged in now!",
        type: "success"
      })
      return res.redirect("/")
    } catch(err){
      return next(err);
    }
  });

  router.get("/logout", (req, res, next) => {
    req.session.userId = null;
    req.session.messages.push({
      text: "you are logged out now!",
      type: "info"
    })
    return res.redirect("/");
  })
}
