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
        var oldDate = new Date(arr[i].innerText)
        var newDate = convertUTCDateToLocalDate(oldDate);
        arr[i].innerText=newDate;

    }



});
