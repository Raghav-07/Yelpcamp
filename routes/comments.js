var express=require("express");
var router=express.Router();
var campground=require("../models/campground")
var Comment=require('../models/comment')
var middleware=require('../middleware')

//COMMENT ROUTE WITH MIDDLEWARE
router.get('/campgrounds/:id/comments/new',middleware.isloggedin, function(req,res) {
campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
	if(err) {
		console.log(err)
	}
	else {
	console.log(foundCampground);
	res.render("comments/newcomments.ejs",{campground:foundCampground})
	}
	})
})

//NEW COMMENT ROUTE
router.post('/campgrounds/:id/comments',middleware.isloggedin, function(req,res) {
var author=req.body.author;
var text=req.body.text;
var newcampground={author:author, text:text}

campground.findById(req.params.id, function(err,campground) {
if(err){
		console.log(err)
	}
	else {
Comment.create(newcampground, function(err,comment){
	if(err){
		console.log(err)
	}
	else {
		comment.author.id=req.user._id; //IMPORTANT
		comment.author.username=req.user.username; //IMPORTANT
		comment.save();
		console.log("NEW COMMENT USERNAME WIL BE"+req.user.username) //WE CAN DO THIS HERE BECAUSE OF THE MIDDLEWARE ISLOGIN
campground.comments.push(comment)
campground.save();
console.log("Created new Comment22222");
			req.flash("success", "Successfully added comment!")
res.redirect('/campgrounds/'+campground._id);
	}

});
	}
					   })
	})

//COMMENT EDIT  GET ROUTE
router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkcamproundownership,function(req,res){
	Comment.findById(req.params.comment_id, function(err,foundCampground) {
		
		res.render("commentedit.ejs", {campground_id:req.params.id, comment:foundCampground})
	})
})

//COMMENT EDIT UPDATE ROUTE
router.post('/campgrounds/:id/comments/:comment_id',middleware.checkcamproundownership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment){
		if(err) {
			console.log("errorrrrrr");
		}
		else {
			res.redirect("/campgrounds/"+req.params.id);
			console.log(req.body.commentname)
			
		}
	})

})

router.post('/campgrounds/:id/comments/:comment_id/delete',middleware.checkcamproundownership,function(req,res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err, updatedcampground){
		if(err) {
			console.log("errorrrrrr22");
		}
		else {
			res.redirect("/campgrounds");
		}
	})
})





module.exports=router;
	