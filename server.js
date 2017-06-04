var express = require('express');
var app = express();
var url = process.env.mongoUrl;
var mongoose = require('mongoose');
mongoose.connect(process.env.mongoUrl);
var PostSchema = new mongoose.Schema({
    episode: Number,
    chrisTitle: String,
    chrisText: String,
    connorTitle: String,
    connorText: String
});
var Post = mongoose.model('Post',PostSchema);
app.use(express.static(__dirname+'/'));
app.set('view engine', 'ejs');

function readMore(string, maxWords) {
    var strippedString = "<p>" + string + "</p>".trim();
    var array = strippedString.split(" ");
    var string = array.splice(0, maxWords).join(" ");

    if(array.length > maxWords) {
        string += "...";
    }

        return string ;
}

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/test/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;
    Post.find({'episode':episode},function(err,data){
        if(err){
            console.log(err);
            res.end();
        }
        else{
            console.log(data);

            res.render('test',{post:data[0].text});

        }
    });


});

app.get('/archive',function(req,res){
    Post.find().sort({episode:-1}).exec(function(err,data){
        var docs = []
        for(var i in data){

            docs[i]={'episode':data[i].episode,'chrisTitle':data[i].chrisTitle,'chrisText':readMore(data[i].chrisText,90),'connorTitle':data[i].connorTitle,'connorText':readMore(data[i].connorText,90)};
        }
        res.render('blog',{posts:docs});
    });

})


app.get('/posts/:episode/:name',function(req,res){
    var episode = req.params.episode;
    var name = req.params.name;
    Post.findOne({'episode':episode,'name':name}).exec(function(err,data){
        res.render('blogPost',{})
    });
    res.end();

});

app.listen(process.env.PORT||500,function(){

    console.log('server listening');
})
