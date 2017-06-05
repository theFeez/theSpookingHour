var express = require('express');
var app = express();
var config = require('./config');
var url = process.env.mongoUrl;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var xss = require('xss');
mongoose.connect(config.mongoUrl);



app.use(express.static(__dirname+'/'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}));

function readMore(string, maxWords) {
    var strippedString = "<p>" + string + "</p>".trim();
    var array = strippedString.split(" ");
    var string = array.splice(0, maxWords).join(" ");

    if(array.length > maxWords) {
        string += "...";
    }

        return string ;
}

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

var PostSchema = new mongoose.Schema({
    episode: Number,
    chrisTitle: String,
    chrisText: String,
    connorTitle: String,
    connorText: String
});

var CommentSchema = new mongoose.Schema({
    id:Number,
    time:{ type: Date, default:convertUTCDateToLocalDate(new Date())},
    text:String
});

var Post = mongoose.model('Post',PostSchema);
var Comment = mongoose.model('Comment',CommentSchema);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/index.html');
});
app.get('/home',function(req,res){
    Post.findOne({'episode':3}).exec(function(err,data){
        if(err){
            console.log(err);
            res.end();
        }
        else{
            res.render('home',{'chrisTitle':data.chrisTitle,'chrisText':readMore(data.chrisText,90),'connorTitle':data.connorTitle,'connorText':readMore(data.connorText,90)});
        }
    })

})

app.get('/archive',function(req,res){
    Post.find().sort({episode:-1}).exec(function(err,data){
        var docs = []
        for(var i in data){

            docs[i]={'episode':data[i].episode,'chrisTitle':data[i].chrisTitle,'chrisText':readMore(data[i].chrisText,90),'connorTitle':data[i].connorTitle,'connorText':readMore(data[i].connorText,90)};
        }
        res.render('archive',{posts:docs});
    });

})


app.get('/posts/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;
    var comments = [];
    Comment.find().exec(function(err,data){
        for(var i in data){
            comments[i]={'text':xss(data[i].text)};
        }
        if(name==='chris'){
            Post.findOne({'episode':episode}).exec(function(err,data){
                if(err){
                    console.log(err);
                    res.end();
                }
                res.render('blogPost',{'title':data.chrisTitle,'name':name,'text':data.chrisText,'fullName':'Christopher Borges','comments':comments});
            });
        }
        else{
            Post.findOne({'episode':episode}).exec(function(err,data){
                if(err){
                    console.log(err);
                    res.end();
                }
                res.render('blogPost',{'title':data.connorTitle,'name':name,'text':data.connorText,'fullName':'Connor Lloyd Falkner'});
            });
        }
    });




});

app.post('/submitComment',function(req,res){
    console.log(req.body);
    var newComment = new Comment({'id':Math.floor(Math.random() * 1000000000),'text':req.body.comment});
    newComment.save(function(err){
        if(err){
            console.log(err);
        }
        res.end();
    })

})

app.listen(process.env.PORT||500,function(){

    console.log('server listening');
})
