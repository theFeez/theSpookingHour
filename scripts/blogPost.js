$(document).ready(function(){
    var arr = $('.timeStamp');

    for(var i=0; i<arr.length; i++){
        var oldDate = new Date(arr[i].innerText);
        var newDate = new Date(oldDate);
        arr[i].innerText=newDate;
    }
});
