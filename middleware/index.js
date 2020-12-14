var campground=require('../models/campground')
var Comment=require('../models/comment') //we have to require model's campground and comment


var middlewareObj = {};

middlewareObj.checkcamproundownership = function(req, res, next) {
	if(req.isAuthenticated()) {
		campground.findById(req.params.id, function(err, foundCampground) {   //We use equals instead of (===) for comparison because one of the comparing value is a mongoose object and other is a string.
			if(foundCampground.author.id.equals(req.user._id)) { 
next();
			}
			else {
					req.flash("error", "You do not have the permission to do that!")
				res.redirect("back");
			}
	})
	}
	else {
					req.flash("error", "You need to be logged in to do that!")
				res.redirect("back");
	}
}

middlewareObj.checkCommentownership = function checkcamproundownership(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundCampground) {   //We use equals instead of (===) for comparison because one of the comparing value is a mongoose object and other is a string.
			if(foundCampground.author.id.equals(req.user._id)) { 
next();
			}
			else {
					req.flash("error", "You do not have the permission to do that!")
				res.redirect("back");
			}
	})
	}
	else {
			req.flash("error", "You need to be logged in to do that!")
				res.redirect("back");
	}
}

middlewareObj.isloggedin=function isloggedin(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!")
	res.redirect("/login");
}




module.exports=middlewareObj;