

//function that displays records from the array
function displayItem(item) {
    $(".swimr_list").children().remove();
    for (index in item){
        $('.swimr_list').append(
                '<li class="swimr_record" value=' + item[index].swimrId + '>' + 
                    item[index].swimrName +
                    '<div>' +
                        '<button class="btn_deleteswimr">' + 'Delete Swimmerrr' + '</button>' +
                        '<button class="btn_show_records">Show Records</button>' +
                    '</div>' +
                    /**item.swim_history[index].itemDate + ' ' +
                    item.swim_history[index].itemName + ' ' +
                    item.swim_history[index].itemDistance + ' meters ' +
                    item.swim_history[index].itemStroke + ' ' +
                    item.swim_history[index].finishTime + ' ' +
                    item.swim_history[index].ranking +  */
                '</li>'
            );
    }
}

function retrieveItems(callbackFn) {
    $.ajax('/users').done(callbackFn());
    }

function getdisplayItems() {
    retrieveItems(displayItem);
}

//function to update swimrName
function edit_swimrName() {
    
}

//display swimrs records
function displayRecords(records){
    $(".swimr_records").children().remove();
    for (index in records){
            $(".swimr_records").append(
                '<li>' +
                records[index].itemType + ' ' +
                records[index].itemName + ' ' +
                records[index].itemStroke + ' ' +
                records[index].itemDistance + ' ' +
                records[index].finishTime + ' ' +
                records[index].ranking + ' ' +
                '</li>'
            );
    }
}

$(document).ready(function(){

    //Auto get records on page load
    $.ajax('/users').done(displayItem);

    //edit swimrName
    var edit_swimrName;
    $("ul").on("click", ".btn_editswimr", function(){
        var original_name = $(this).parent().text();
        $($(this).parent()).text("");
        $('<input type="text" placeholder=' + original_name + '>').prependTo($(this).parent()).focus();
    });

    //Form Submit
    $(".add_record").submit(function (event) {
        event.preventDefault();
        var newname = $(".swimr_name").val();
        $.ajax({
            url: "/users",
            type: "POST",
            name: newname
        }).done(displayItem);

        $(".swimr_list").children().remove();
        $(".swimr_name").val("");
    });

    //Item DELETE
    $("ul").on("click", ".btn_deleteswimr", function(event) {
        var tempid = $($(this).parent()).parent().attr("value");
        console.log("you clicked an item with id " + tempid);
        $.ajax({
            url: "/swimrdel/" + tempid,
            type: "DELETE"
        }).done(displayItem);
    });

    //Show records for swimr
    $("ul").on("click", ".btn_show_records", function() {
        var tempid = $($(this).parent()).parent().attr("value");
        $.ajax({
            url: "/getevents/" + tempid,
            type: "GET"
        }).done(displayRecords)
    })

});
