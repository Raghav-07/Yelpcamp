var express=require("express");
var router=express.Router();
var campground=require("../models/campground")
var middleware=require('../middleware')


router.get('/campgrounds',function(req,res){
campground.find({}, function(err, allcampgrounds){
	if(err) {
		console.log(err)
	} 
	else {
		res.render("index.ejs",{campgrounds:allcampgrounds});	
	}
})
})



router.get("/campgrounds", function(req,res) {
	res.render("campgrounds.ejs",{campgrounds:campgrounds, currentuser:req.user});
})


// CREATE NEW CAMPGROUND
router.post('/campgrounds',middleware.isloggedin,function(req,res) {
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.url;
	var description=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newcampground={name:name, price:price, image:image, description:description, author:author}
campground.create(newcampground, function(err, newcampground){
		if(err) {
	console.log("something went wromg");
}
	else {
		console.log("success");
		res.redirect("/campgrounds")
	}
});
})

router.get('/campgrounds/new', middleware.isloggedin,function(req,res) {
res.render("new.ejs");
})


router.get('/campgrounds/:id', function(req,res) {
	
		campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
	if(err) {
		console.log(err)
	}
	else {
	console.log(foundCampground);
	res.render("show.ejs",{campground:foundCampground})
	}
	})
	


})

//EDIT ROUTE
router.get('/campgrounds/:id/edit',middleware.checkcamproundownership, function(req,res) {
		//WE ARE GOIN TO CHECK 1. IS A USER LOGGED GOIN?
	// 2. IS THE LOGGED IN USER, THE ACTUAL USER WHO CREATED THE CAMPGROUND
	//3. IF YES THE BELOW CODE IS EXECUTED ELSE PLEASE GET LOST
		campground.findById(req.params.id, function(err, foundCampground) {
res.render("edit.ejs",{campground: foundCampground})
	})
})



//UPDATE ROUTE
router.post('/campgrounds/:id',middleware.checkcamproundownership,function(req,res) {

	campground.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedcampground){
		if(err) {
			console.log("errorrrrrr");
		}
		else {
			res.redirect("/campgrounds");
			console.log(req.body.campground);
				req.flash("success", "Successfully updated the campground!")

		}
	})
})

//DELETE ROUTE
router.post('/campgrounds/:id/delete',middleware.checkcamproundownership,function(req,res) {
	campground.findByIdAndRemove(req.params.id, function(err, updatedcampground){
		if(err) {
			console.log("errorrrrrr22");
		}
		else {
							req.flash("success", "Successfully deleted the campground!")
			res.redirect("/campgrounds");
		}
	})
})


module.exports=router;