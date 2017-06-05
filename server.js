var express = require('express');
var app = express();
//var config = require('./config');
var url = process.env.mongoUrl;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var xss = require('xss');
mongoose.connect(process.env.mongoUrl);



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
    name:String,
    title:String,
    text:String
});

var CommentSchema = new mongoose.Schema({
    id:Number,
    time:{ type: Date, default:convertUTCDateToLocalDate(new Date())},
    postEpisode:Number,
    postName:String,
    text:String
});

var Post = mongoose.model('Post',PostSchema);
var Comment = mongoose.model('Comment',CommentSchema);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/home',function(req,res){
    Post.findOne({'episode':3,'name':'chris'}).exec(function(err,data){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            Post.findOne({'episode':3,'name':'connor'}).exec(function(error,data2){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                }
                else{
                    res.render('home',{'chrisTitle':data.title,'chrisText':readMore(data.text,90),'connorTitle':data2.title,'connorText':readMore(data2.text,90)});
                }
            })

        }
    })

})

app.get('/archive',function(req,res){
    Post.find({'name':'chris'}).sort({episode:-1}).exec(function(err,data){
        var chrisPosts = []
        for(var i in data){
            chrisPosts[i]={'episode':data[i].episode,'title':data[i].title,'text':readMore(data[i].text,90)};
        }
        Post.find({'name':'connor'}).sort({episode:-1}).exec(function(error,data2){
            var connorPosts=[];
            for(var i in data2){
                connorPosts[i]={'episode':data2[i].episode,'title':data2[i].title,'text':readMore(data2[i].text,90)}
            }
            res.render('archive',{'chrisPosts':chrisPosts,'connorPosts':connorPosts});
        })

    });

})


app.get('/posts/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;
    var fullName="";
    var comments = [];
    if(name==='chris'){
        fullName="Christopher Borges";
    }
    else if(name==='connor'){
        fullName="Connor Lloyd Falkner"
    }
    Post.findOne({'episode':episode,'name':name}).exec(function(err,postDoc){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            Comment.find({'postEpisode':episode,'postName':name}).exec(function(err,commentDocs){
                for(var i in commentDocs){
                    comments[i]={'text':xss(commentDocs[i].text)};
                }
                res.render('blogPost',{'title':postDoc.title,'name':postDoc.name,'text':postDoc.text,'fullName':fullName,'comments':comments,'episode':episode});
            })
        }
    })
});

app.post('/submitComment',function(req,res){
    var episode = req.body.postEpisode;
    var name = req.body.postName;
    var newComment = new Comment({'id':Math.floor(Math.random() * 1000000000),'postEpisode':episode,'postName':name,'text':req.body.comment});
    newComment.save(function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/posts/'+xss(episode)+'/'+xss(name));
    })

})

app.listen(process.env.PORT||500,function(){

    console.log('server listening');
})
