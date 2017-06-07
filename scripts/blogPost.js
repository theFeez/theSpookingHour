function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

$(document).ready(function(){
    var date = convertUTCDateToLocalDate($('#timeStamp'));
    $('#timeStamp').text=date.toISOString():
});
