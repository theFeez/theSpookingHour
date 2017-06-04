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
app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/test/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;
    Post.find({'episode':episode,'name':name},function(err,data){
        if(err){
            console.log(err);
            res.end();
        }
        else{
            res.render('test',{post:data.text});

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
