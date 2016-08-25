

var current_swimr;

var temp_storage;
var event_del_name;

//New User template maker function
function newUser(newname) {
    var user_template = $('.hidden .user_template').clone();
    var name_elem = user_template.find('.user_name');
    var name_elem = user_template.find('.btn_show_records');
    name_elem.text(newname);
    return user_template;
}

//function that displays records from the temp storage
function display(users) {
    //$(".swimr_list").children().remove();
    for (var index in users){
        //newUser(users[index].name);
        var made_newuser = newUser(users[index].name);
        $(".swimr_list").append(made_newuser);

        /*$(".swimr_list").append(
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
    //$(".swimr_list").append(made_newuser);
}

//ajax call to get all users
function retrieveUsers() {
    $.ajax('/users').done(function (users) {
        $(".swimr_list").children().remove();
        console.log(users);
        display(users);
        //newUser(users);
        //var made_newuser = newUser(users);
        //$(".swimr_list").append(made_newuser);
        //display(users);
        //assign results array to temp_storage variable
        temp_storage = users;
        console.log(temp_storage);
    });
}


//display event records
function displayRecords(records) {
    $(".oldswimr_records").children().remove();
    $(".records_results").children().remove();
    for (var i = 0; i < records.length; i++) {
        if (records[i].name === current_swimr) {
            var tempnum = i;
            var temp_history = records[tempnum].swim_history;
            for (var e = 0; e < records[tempnum].swim_history.length; e++) {
                var showEvents = function (e, temp_history) {
                    console.log("I am " + e);
                    var swim_template = $('.hidden .records_template').clone();

                    var date_elem = swim_template.find('.event_date');
                    date_elem.text(temp_history[e].eventDate);
                    var name_elem = swim_template.find('.event_name');
                    name_elem.text(temp_history[e].eventName);
                    var name_attr = swim_template.find()
                    var distance_elem = swim_template.find('.event_distance');
                    distance_elem.text(temp_history[e].eventDistance);
                    var stroke_elem = swim_template.find('.event_stroke');
                    stroke_elem.text(temp_history[e].eventStroke);
                    var time_elem = swim_template.find('.event_time');
                    time_elem.text(temp_history[e].eventTime);
                    var rank_elm = swim_template.find('.event_rank');
                    rank_elm.text(temp_history[e].eventRank);

                    return swim_template;
                }
                var hist_record = showEvents(e, temp_history);
                $(".records_results").append(hist_record);
            }
        }
    }
}




$(document).ready(function () {

    //Auto get records on page load
    retrieveUsers();

/*    //CREATE user
    $(".add_user").submit(function (event) {
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
        

    });*/



    //CREATE user on click
    $(".add_user").submit(function (event) {
        event.preventDefault();
        var newname = $(".swimr_name").val();
        $(".swimr_name").val("");
        
        var made_newuser = newUser(newname);
        $(".swimr_list").append(made_newuser);

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
    });

    //Swimmer/User DELETE
    $("ul").on("click", ".btn_deleteswimr", function (event) {
        //var tempid = $($(this).parent()).parent().attr("value");
        var swimrname = $($(this).parent()).parent().attr("value");
        console.log("you clicked an item with name of " + swimrname);
        $.ajax({
            url: "/users",
            method: "DELETE",
            data: { name: swimrname }
        }).done(retrieveUsers);
    });

    //Show records for swimr
    $("ul").on("click", ".btn_show_records", function () {
        $(".add_record").css("display", "block");
        current_swimr = $(this).text();
        //current_swimr = $($(this).parent()).parent().attr("value");
        //var swimrname = $($(this).parent()).parent().attr("value");
        console.log(current_swimr);
        displayRecords(temp_storage);
    });




    //Push new record to temp storage
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


    //Add new swim record event for swimr
    $(".add_record").submit(function(event) {
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

    //Delete swim record event for swimr
    $("div").on("click", ".btn_remove_event", function(event) {
        console.log("You clicked for delete " + $(this).parent().text());
        console.log($(this).parent().find(".event_name").text());
        //event_del_name = $(this).parent().attr("value");
        event_del_name = $(this).parent().find(".event_name").text();
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
