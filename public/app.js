

var current_swimr;

var temp_storage;
var event_del_name;


//function that displays records from the temp storage
function display(users) {
    //$(".swimr_list").children().remove();
    for (var index in users){
        $(".swimr_list").append(
                '<li class="swimr_record" value="' + users[index].name + '">' + 
                    users[index].name +
                    '<div>' +
                        '<button class="btn_deleteswimr">' + 'Delete Swimmer' + '</button>' +
                        '<button class="btn_show_records">Select Swimmer</button>' +
                    '</div>' +
                '</li>'
            );
    }
}

function retrieveUsers() {
    $.ajax('/users').done(function (users) {
        $(".swimr_list").children().remove();
        display(users);
        //assign results array to temp_storage variable
        temp_storage = users;
        console.log(temp_storage);
    });
}


//display event records
function displayRecords(records) {
    $(".swimr_records").children().remove();
    for (var i = 0; i < records.length; i++) {
        if (records[i].name === current_swimr) {
            var tempnum = i;
            //$('.records_template').clone().appendTo(".records_results");
            
            
            for (var e = 0; e < records[tempnum].swim_history.length; e++) {
                var temp_history = records[tempnum].swim_history;
                console.log(temp_history);//array is correct
                var showEvents = function (records) {
                    console.log("I am " + records);
                    var swim_template = $('.records_template').clone();
                    var name_elem = swim_template.find('.event_name');
                    name_elem.text("name should go here " + records[e].eventName);
                    return swim_template;
                }
                var hist_record = showEvents(temp_history);
                $(".records_results").append(hist_record);
            }
        
    
/*
            var temp_history = records[tempnum].swim_history;
            console.log(temp_history);//array is correct
            var showEvents = function (records) {
                console.log("I am " + records);
                var swim_template = $('.records_template').clone();
                var date_elem = swim_template.find('.event_date');
                date_elem.text("date should go here" + records.eventDate);
                return swim_template;
            }
            var hist_record = showEvents(temp_history);
            $(".records_results").append(hist_record);

            $.each(temp_history, function (tempnum, records) {
                
                console.log("boo");
                $(".records_results").append(hist_record);
            });*/

            //console.log(records[i].name);
            for (var e = 0; e < records[tempnum].swim_history.length; e++) {
                //console.log(records[tempnum].swim_history[e]);
                $(".swimr_records").append(
                    '<li value="' + records[tempnum].swim_history[e].eventName + '">' +
                    '<span class="event_name">' +
                    records[tempnum].swim_history[e].eventName +
                    '</span>' + ' ' +
                    '<span>' +
                    records[tempnum].swim_history[e].eventStroke + ' ' +
                    '</span>' +
                    records[tempnum].swim_history[e].eventDistance + ' ' +
                    records[tempnum].swim_history[e].eventTime + ' ' +
                    records[tempnum].swim_history[e].eventRank + ' ' +
                    '<button class="btn_remove_event">Remove Event</button>' +
                    '</li>'
                );



            }
        }
    }
}




$(document).ready(function () {

    //Auto get records on page load
    retrieveUsers();

    //ADD user
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
        current_swimr = $($(this).parent()).parent().attr("value");
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
        console.log($("select.event_stroke").val());
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
    $("ul").on("click", ".btn_remove_event", function(event) {
        console.log("You clicked for delete " + $(this).parent().text());
        event_del_name = $(this).parent().attr("value");
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
        console.log("you tried to delete a swim record");
    });

});
