var express=require("express");
var router=express.Router();
var passport=require("passport")
var user=require("../models/user")

router.get('/',function(req,res){
	res.render("landing.ejs");
})
//AUTH ROUTES
//========================

router.get("/register",function(req,res) {
	res.render("register.ejs")
})

router.post("/register",function(req,res) {
user.register(new user({username: req.body.username}), req.body.password,function(err, user){
	if(err) {
return res.render("register.ejs", {error: err.message})		
		console.log(err)
	}
	else {
		passport.authenticate("local")(req,res, function(){
		req.flash("success", "Welcome to Yelpcamp "+ user.username)
			res.redirect("/campgrounds");
		});
	}
})
})
//SHOW LOGIN FORM
router.get("/login",function(req,res){
	res.render("login.ejs");
})

router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res) {

});

router.get("/logout", function(req, res){
	req.logout(); //SESSION IS GETTING DESTROYED
req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports=router;