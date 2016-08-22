var local_storage = [];

//function that displays records from the array
function display(users) {
    //$(".swimr_list").children().remove();
    for (var index in users){
        $(".swimr_list").append(
                '<li class="swimr_record" value="' + users[index].name + '">' + 
                    users[index].name +
                    '<div>' +
                        '<button class="btn_deleteswimr">' + 'Delete Swimmerrr' + '</button>' +
                        '<button class="btn_show_records">Show Records</button>' +
                    '</div>' +
                '</li>'
            );
    }
}

function retrieveUsers() {
    $.ajax('/users').done(function (users) {
        $(".swimr_list").children().remove();
        display(users);
    });
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
    retrieveUsers();

    //edit swimrName
    var edit_swimrName;
    $("ul").on("click", ".btn_editswimr", function(){
        var original_name = $(this).parent().text();
        $($(this).parent()).text("");
        $('<input type="text" placeholder=' + original_name + '>').prependTo($(this).parent()).focus();
    });

    //ADD user
    $(".add_record").submit(function (event) {
        event.preventDefault();
        var newname = $(".swimr_name").val();
        $(".swimr_name").val("");
        $.ajax({
            url: "/users",
            data: {
                name: newname
            },
            method: "POST"
        }).done(retrieveUsers);
    });

    //Item DELETE
    $("ul").on("click", ".btn_deleteswimr", function(event) {
        //var tempid = $($(this).parent()).parent().attr("value");
        var swimrname = $($(this).parent()).parent().attr("value");
        console.log("you clicked an item with name of " + swimrname);
        $.ajax({
            url: "/users",
            method: "DELETE",
            data: {name: swimrname}
        }).done(retrieveUsers);
    });

    //Show records for swimr
    $("ul").on("click", ".btn_show_records", function() {
        //var tempid = $($(this).parent()).parent().attr("value");
        var swimrname = $($(this).parent).val();
        $.ajax({
            url: "/user/history",
            method: "GET",
            user: swimrname
        }).done();
    });

});
