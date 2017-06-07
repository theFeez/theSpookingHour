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

        var oldDate = new Date(arr[i].innerText);
        console.log(oldDate.getTimezoneOffset());
        console.log(oldDate);
        var newDate = new Date(oldDate);
        console.log(newDate);
        //arr[i].innerText=newDate;

    }



});
