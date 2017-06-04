var express = require('express');
var app = express();
app.use(express.static(__dirname+'/'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
    console.log("hi")
    console.log(process.env.mongoUrl);
    console.log("bye");
});

app.listen(process.env.PORT||500,function(){
    console.log('server listening');
})
