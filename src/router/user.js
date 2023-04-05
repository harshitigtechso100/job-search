const express = require("express");
const router = express.Router();

const {user} = require("../controllers/index");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
})
router.get('/:userId/:token', (req,res) =>{
  res.status(200).render('resatpassword')
})


router.post("/signup", user.userSignup)
router.post("/signin", user.userSignin)
router.get("/logout", user.userLogout)
router.post('/forgot',user.forgotPassword)
router.post('/:userId/:token', user.resetpassword)

module.exports = router
