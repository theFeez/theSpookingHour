var express = require('express');
var app = express();
app.use(express.static(__dirname+'/'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
    console.log(process.env.mongoUrl);
});

app.listen(process.env.PORT||500,function(){
    console.log('server listening');
})
