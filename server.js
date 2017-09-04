var express = require('express');
var app = express();
var config = require('./config');
var url = config.mongoUrl;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var xss = require('xss');
mongoose.connect(url);



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


var PostSchema = new mongoose.Schema({
    episode: Number,
    name:String,
    title:String,
    text:String
});

var CommentSchema = new mongoose.Schema({
    id:Number,
    time:{ type: Date, default:new Date()},
    postEpisode:Number,
    postName:String,
    text:String
});

var ZachSchema = new mongoose.Schema({
    episode:Number,
    text:String
},
{collection:'zachAttackPosts'});

var Post = mongoose.model('Post',PostSchema);
var Comment = mongoose.model('Comment',CommentSchema);
var Zach = mongoose.model('zachAttackPost',ZachSchema)

app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/home',function(req,res){
    Post.findOne({'episode':4.5,'name':'chris'}).exec(function(err,data){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            if(data){
                Post.findOne({'episode':4.5,'name':'connor'}).exec(function(error,data2){
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else{
                        if(data2){
                            res.render('home',{'chrisTitle':data.title,'chrisText':readMore(data.text,90),'connorTitle':data2.title,'connorText':readMore(data2.text,90)});
                        }
                        else{
                            res.sendStatus(500);
                        }

                    }
                })
            }
            else{
                res.sendStatus(404);
            }


        }
    })

})

app.get('/archive',function(req,res){
    Post.find({'name':'chris'}).sort({episode:-1}).exec(function(err,data){
        if(err||(!data)){
            res.sendStatus(500);
        }
        else{
            var chrisPosts = []
            for(var i in data){
                chrisPosts[i]={'episode':data[i].episode,'title':data[i].title,'text':readMore(data[i].text,90)};
            }
            Post.find({'name':'connor'}).sort({episode:-1}).exec(function(error,data2){
                if(err||(!data2)){
                    res.sendStatus(500);
                }
                else{
                    var connorPosts=[];
                    for(var i in data2){
                        connorPosts[i]={'episode':data2[i].episode,'title':data2[i].title,'text':readMore(data2[i].text,90)}
                    }

                }
                Post.find({}).sort({episode:-1}).exec(function(error3,data3){
                    if(error3||!data3){
                        res.sendStatus(500);
                    }
                    else{
                        var allPosts=[];
                        for(var j in data3){
                            allPosts[j]={'episode':data3[j].episode,'title':data3[j].title,'name':data3[j].name,'text':readMore(data3[j].text,90)};
                        }
                        res.render('archive',{'chrisPosts':chrisPosts,'connorPosts':connorPosts,'allPosts':allPosts});
                    }
                })

            })
        }


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
        if(err||(!postDoc)){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            Comment.find({'postEpisode':episode,'postName':name}).exec(function(err,commentDocs){
                if(err||(!commentDocs)){
                    res.sendStatus(500);
                }
                else{
                    for(var i in commentDocs){
                        comments[i]={'text':xss(commentDocs[i].text),'time':commentDocs[i].time};
                    }
                    res.render('blogPost',{'title':postDoc.title,'name':postDoc.name,'text':postDoc.text,'fullName':fullName,'comments':comments,'episode':episode});
                }

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

app.get('/episodes',function(req,res){
    res.render('episodes.ejs');
})

app.get('/zachAttack',function(req,res){
    Zach.findOne({'episode':1}).exec(function(err,doc){
        if(err||(!doc)){
            console.log('error');
            res.sendStatus(500);
        }
        else{
            
            res.render('zachAttack',{'zachPost':doc.text});
        }
    });

})

app.listen(process.env.PORT||500,function(){

    console.log('server listening');
})
