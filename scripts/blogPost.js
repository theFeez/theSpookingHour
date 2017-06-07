function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

$(document).ready(function(){
    var arr = $('.timeStamp');

    for(var i=0; i<arr.length; i++){
        var oldDate = arr[i].innerText
        console.log(oldDate);
        var newDate =oldDate.toLocaleString();
        console.log(newDate);
        arr[i].innerText=newDate;

    }



});
