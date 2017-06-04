var express = require('express');
var app = express();
app.use(express.static(__dirname+'/'));

app.get('/',function(req,res){
    
    res.sendFile(__dirname+'/index.html');

});

app.listen(process.env.PORT||500,function(){
    console.log(process.env.mongoUrl);
    console.log('server listening');
})
