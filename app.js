var express=require("express")
var app=express()
var bodyparser=require("body-parser");
var flash=require("connect-flash")
var mongoose=require("mongoose")
var expresssanitizer=require("express-sanitizer")
var passport=require("passport")
var bodyparser=require("body-parser")
var localstrategy=require("passport-local")
var passportlocalmongoose=require("passport-local-mongoose")
var user=require("./models/user")
var campground=require("./models/campground")
var Comment=require("./models/comment") 

var commentroutes= require("./routes/comments")
var campgroundroutes= require("./routes/campground")
var authroutes= require("./routes/index")


//mongoose.connect(process.env.DATABASEURL , {
mongoose.connect("mongodb+srv://Raghav:mano2006@cluster0.7abzt.mongodb.net/<dbname>?retryWrites=true&w=majority" , {
  useNewUrlParser: true,	
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(express.static(__dirname + "/public")); 
app.use(flash())



//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret: "my brother likes husky dog a lot",
		resave: false,
		saveUninitialized: false
		}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); //reading the data and encoding and put it to session
passport.deserializeUser(user.deserializeUser()); //decoding

app.use(function(req, res, next){ //vvvvvvvvvv imppppppp
   res.locals.currentuser = req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
   next();
});


	

app.use(bodyparser.urlencoded({extended: true}));
app.use(expresssanitizer());
app.use(express.static("appcss"));



app.use(commentroutes);
app.use(campgroundroutes);
app.use(authroutes);




app.listen(process.env.PORT || 2500, process.env.IP, function(){
	console.log("server has statred")
});


