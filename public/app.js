

var current_swimr;

var temp_storage;
var event_del_name;

//New User template maker function
function newUser(newname) {
    var user_template = $('.hidden_wrap .user_template').clone();
    var name_elem = user_template.find('.user_name');
    var name_elem = user_template.find('.btn_show_records');
    name_elem.text(newname);
    return user_template;
}

//function that displays records from the temp storage
function display(users) {
    //$(".swimr_list_data").children().remove();
    for (var index in users){
        //newUser(users[index].name);
        var made_newuser = newUser(users[index].name);
        $(".swimr_list_data").prepend(made_newuser);

        /*$(".swimr_list_data").append(
                '<li class="swimr_record" value="' + users[index].name + '">' + 
                    users[index].name +
                    '<div>' +
                        '<button class="btn_deleteswimr">' + 'Delete Swimmer' + '</button>' +
                        '<button class="btn_show_records">Select Swimmer</button>' +
                    '</div>' +
                '</li>'
            );*/
    }
    //var made_newuser = newUser(users);
    //$(".swimr_list_data").append(made_newuser);
}

//ajax call to get all users
function retrieveUsers() {
    $.ajax('/users').done(function (users) {
        $(".swimr_list_data").children().remove();
        console.log(users);
        display(users);
        //newUser(users);
        //var made_newuser = newUser(users);
        //$(".swimr_list_data").append(made_newuser);
        //display(users);
        //assign results array to temp_storage variable
        temp_storage = users;
        console.log(temp_storage);
    });
}


//display event records
function displayRecords(records) {
    $(".records_table").children().remove();
    for (var i = 0; i < records.length; i++) {
        if (records[i].name === current_swimr) {
            var tempnum = i;
            var temp_history = records[tempnum].swim_history;
            for (var e = 0; e < records[tempnum].swim_history.length; e++) {
                var showEvents = function (e, temp_history) {
                    console.log("I am " + e);
                    var swim_template = $('.hidden_wrap .event_values').clone();
                    //var swim_template = $('.hidden_wrap .records_template').clone();
                    var date_elem = swim_template.find('.event_date');
                    date_elem.html(temp_history[e].eventDate);
                    var name_elem = swim_template.find('.event_name');
                    name_elem.html(temp_history[e].eventName);
                    var distance_elem = swim_template.find('.event_distance');
                    distance_elem.html(temp_history[e].eventDistance);
                    var stroke_elem = swim_template.find('.event_stroke');
                    stroke_elem.html(temp_history[e].eventStroke);
                    var time_elem = swim_template.find('.event_time');
                    time_elem.html(temp_history[e].eventTime);
                    var rank_elm = swim_template.find('.event_rank');
                    rank_elm.html(temp_history[e].eventRank);

                    /*$('.event_date').html(temp_history[e].eventDate);
                    $('.event_name').html(temp_history[e].eventName);
                    $('.event_distance').html(temp_history[e].eventDistance);
                    $('.event_stroke').html(temp_history[e].eventStroke);
                    $('.event_time').html(temp_history[e].eventTime);
                    $('.event_rank').html(temp_history[e].eventRank);*/
                    

                    return swim_template;
                }
                var hist_record = showEvents(e, temp_history);
                $(".records_table").append(hist_record);
            }
        }
    }
    /** run stackable table plugin */
    $(".event_table").stacktable();

}




$(document).ready(function () {





    //Auto get records on page load
    retrieveUsers();





    //CREATE user on click
    $(".add_user").submit(function (event) {
        event.preventDefault();
        var newname = $(".swimr_name").val();
        $(".swimr_name").val("");
        var made_newuser = newUser(newname);
        //hide add user form
        $(".add_user_wrap").css("display", "none");
        $(".swimr_list_data").append(made_newuser);

        //ajax call
        $.ajax({
            url: "/users",
            data: {
                name: newname
            },
            method: "POST"
        }).done(retrieveUsers);
        current_swimr = newname;
        displayRecords(temp_storage);
        $(".swimrs_wrap").css("display", "block");
    });

    $(".btn_user_close").click(function(event) {
        $(".add_user_wrap").css("display", "none");
        $(".swimrs_wrap").css("display", "block");
    });

    //Confirm User DELETE
    $("div").on("click", ".btn_show_del_user", function() {
        $(".btn_show_del_user").css("display", "none");
        $(".confirm_del_user").css("display", "inline-block");
    });

    //Cancel User DELETE
    $("div").on("click", ".btn_cancel", function() {
        $(".confirm_del_user").css("display", "none");
        $(".btn_show_del_user").css("display", "inline-block");
    });

    //Swimmer/User DELETE
    $("div").on("click", ".btn_del_user", function (event) {
        //var tempid = $($(this).parent()).parent().attr("value");
        var swimrname = current_swimr;
        console.log("you clicked delete for " + swimrname);
        $.ajax({
            url: "/users",
            method: "DELETE",
            data: { name: swimrname }
        }).done(retrieveUsers);
        $(".records_wrap").css("display", "none");
        $(".btn_swimr_menu").css("display", "none");
        $(".swimrs_wrap").css("display", "block");
    });

    

    //Push new swim record to temp storage
    function pushtostorage(temprecords, newrecord) {
        for (var i = 0; i < temprecords.length; i++) {
            if (temprecords[i].name === current_swimr) {
                var tempnum = i;
                //console.log(records[i].name);
                temprecords[i].swim_history.unshift(newrecord);
            }
        }
    }

    //Temp storage Swim record object constructor
    function SwimRecord(eventName, eventDate, eventStroke, eventDistance, eventTime, eventRank) {
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.eventStroke = eventStroke;
        this.eventDistance = eventDistance;
        this.eventTime = eventTime;
        this.eventRank = eventRank;
    }


    //Add new swim record event
    $(".add_record_data").submit(function(event) {
        event.preventDefault();
        //console.log($("select.event_stroke").val());
        tempswimrecord = new SwimRecord($(".event_name").val(), $(".event_date").val(), $("select.event_stroke").val(), $(".event_distance").val(), $(".event_time").val(), $(".event_rank").val());
        //console.log(tempswimrecord);
        pushtostorage(temp_storage, tempswimrecord);
        displayRecords(temp_storage);
        $.ajax({
            url: "/user/history",
            method: "POST",
            data: {
                name: current_swimr,
                eventName: $(".event_name").val(),
                eventDate: $(".event_date").val(),
                eventStroke: $("select.event_stroke").val(),
                eventDistance: $(".event_distance").val(),
                eventTime: $(".event_time").val(),
                eventRank: $(".event_rank").val()
            }
        });
        console.log("you tried to add a record");
        //reset forms
        $(".event_name").val("");
        $(".event_date").val("");
        $("select.event_stroke").val("");
        $(".event_distance").val("");
        $(".event_time").val("");
        $(".event_rank").val("");
        //Hide forms
        $(".add_record_wrap").css("display", "none");
        //Show swim records again
        $(".records_wrap").css("display", "block");
    });

    function delete_temp_event(temp_storage, event_del_name){
        for (var i = 0; i < temp_storage.length; i++) {
        if (temp_storage[i].name === current_swimr) {
            var tempnum = i;
            //console.log(temp_storage[i].name);
            for (var e = 0; e < temp_storage[tempnum].swim_history.length; e++) {
                //console.log(temp_storage[tempnum].swim_history[e]);
                //console.log(temp_storage[tempnum].swim_history[e].eventName);
                //console.log(event_del_name);
                if (event_del_name == temp_storage[tempnum].swim_history[e].eventName) {
                    //var history_position = e;
                    console.log(temp_storage[tempnum].swim_history[e]);
                    temp_storage[tempnum].swim_history.splice(e, 1);
                    console.log("spliced");
                }
            }
        }
        }
    }

    //Show records for swimr
    $("section").on("click", ".btn_show_records", function () {
        //show add event button
        $(".swimrs_wrap").css("display", "none");
        $(".add_record_data").css("display", "block");
        current_swimr = $(this).text();
        $(".btn_swimr_menu").html("<i class='fa fa-chevron-left' aria-hidden='true'></i> &nbsp &nbsp &nbsp"  + current_swimr);
        $(".btn_swimr_menu").css("display", "inline");
        $(".records_wrap").css("display", "block");
        //current_swimr = $($(this).parent()).parent().attr("value");
        //var swimrname = $($(this).parent()).parent().attr("value");
        console.log(current_swimr);
        displayRecords(temp_storage);
    });

    //Click swimr name to go back to menu
    $(".btn_swimr_menu").on("click", function() {
        $(".confirm_del_user").css("display", "none");
        $(".btn_show_del_user").css("display", "inline-block");
        $(".swimrs_wrap").css("display", "block");
        $(".records_wrap").css("display", "none");
        $(".btn_swimr_menu").css("display", "none");
        //make sure add user form is hidden
        $(".add_user_wrap").css("display", "none");
        //hide new event form
        $(".add_record_wrap").css("display", "none");
    })

    //Click to show add user form
    $(".btn_add_user").on("click", function() {
        $(".add_user_wrap").css("display", "block");
        $(".swimrs_wrap").css("display", "none");
    });

    //Click to cancel/close add event form
    $(".btn_event_close").on("click", function() {
        $(".add_record_wrap").css("display", "none");
        $(".records_wrap").css("display", "block");
    });


    //open new event form
    $(".btn_show_create_form").on("click", function() {
        $(".confirm_del_user").css("display", "none");
        $(".btn_show_del_user").css("display", "inline-block");
        $(".records_wrap").css("display", "none");
        $(".add_record_wrap").css("display", "inline-block");
    });

    //Delete swim record event for swimr
    $("tbody").on("click", ".btn_remove_event", function(event) {
        $(".confirm_del_user").css("display", "none");
        $(".btn_show_del_user").css("display", "inline-block");
        //console.log("You clicked for delete " + $(this).parent().parent().text());
        console.log($(this).parent().parent().find(".event_name").text());
        //event_del_name = $(this).parent().attr("value");
        event_del_name = $(this).parent().parent().find(".event_name").text();
        delete_temp_event(temp_storage, event_del_name);
        $.ajax({
            url: "/user/history",
            method: "DELETE",
            data: {
                name: current_swimr,
                eventName: event_del_name
            }
        }).done(retrieveUsers);
        displayRecords(temp_storage);
        console.log("you deleted a swim record");
    });

    


});
