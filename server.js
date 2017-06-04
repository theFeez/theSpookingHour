var express = require('express');
var app = express();
var url = process.env.mongoUrl;
var mongoose = require('mongoose');
mongoose.connect(process.env.mongoUrl);
var PostSchema = new mongoose.Schema({
    episode: Number,
    name: String,
    text: String
});
var Post = mongoose.model('Post',PostSchema);
app.use(express.static(__dirname+'/'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/test',function(req,res){
    Post.find(function(err,posts){
        if(err){
            console.log(err);
            res.end;
        }
        else{
            res.send(posts);
        }
    });


});

app.get('/posts/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;

});

app.listen(process.env.PORT||500,function(){

    console.log('server listening');
})
