var mongoose=require("mongoose");
var campground=require("./yelpcamp/campground")

function seeddb() {
campground.remove({}, function(err) {
	if(err){
		console.log(err)
	}
	else {
		console.log("campground removed")
	}
})
}

module.exports=seeddb;