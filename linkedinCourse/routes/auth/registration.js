const {Router} = require('express')

// eslint-disable-next-line no-unused vars
const UserService = require('../../services/UserService');
const validation = reqiured('../../middlewares/validation');


const router = Router();


module.exports = () => {
    // @desc    registration page
    // @route   GET `/auth/registration`
    // @access  public

    router.get('/register', (req, res)=>{
      res.render('auth/registration', {page: "registration"});
    })

    // @desc    sign up
    // @route   POST `/auth/register`
    // @access  public

    router.post('/register',
      // some of middlewares to validate the user inputs
      validation.validateUsername,
      validation.validateEmail,
      validation.validatePassword,
      validation.validatePasswordMatch,

    async(req, res, next)=>{
      try{
        const validateErrors = validation.validateResult(req);
        const errors = [];
        if(!validationErrors.isEmpty()){
          validationErrors.errors.forEach(error =>{
            error.push(error.param);
            req.session.messages.push({
              text: error.msg,
              type: "danger"
            })
          })
        } else {
          const existEmail = await UserService.findByEmail(req.body.email);
          const exitUsername = await UserService.findByUsername(req.body.username);
          if(existEmail || existUsername){
            error.push("email");
            error.push("username");
            req.session.messages.push({
              text: "the given email address or the username exist already",
              type: "danger",
            })
          }
        }
        if(errors.length){
          return res.render("auth/registration", {
            page: "registration",
            data: req.body,
            errors
          })
        }


        const {username, password, email} = req.body;
        await UserService.createUser(username, email, password);
        req.session.messages.push({
          text: "Your Account was created",
          type: "success",
        });

        return res.redirect("/auth/login");
      } catch (err) {
        return next(err);
      }
    }
    )
}