var current_swimr;
var temp_storage = [];
var temp_event_storage = [];
var event_del_name;

//  delete a swimr from db
function deleteSwimr() {
    var swimrname = current_swimr;
    console.log("you clicked delete for " + swimrname);
    $.ajax({
        url: "/users",
        method: "DELETE",
        data: {
            swimr_name: swimrname
        }
    }).done(function (swimrname) {
        console.log("done deleting a swimr " + swimrname);
        window.location = "swimmers.html";
    }).fail(function (error) {
        console.log("error deleting a swimr " + error);
    });
}

//  Autofill with current date
function setCurrentDate() {
    var date = new Date().toISOString().substring(0, 10);
    $(".event_date").val(date);
}
// Push new swim record to temp storage
function pushtostorage(temp_event_storage, newrecord) {
    temp_event_storage.unshift(newrecord);
    console.log(temp_event_storage);
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

//  create swimr event
function createSwimrEvent() {
    console.log("date being submitted " + $(".event_date").val());
    tempswimrecord = new SwimRecord(
        $(".event_name").val(),
        $(".event_date").val(),
        $("select.event_stroke").val(),
        $(".event_distance").val(),
        $(".event_time").val(),
        $(".event_rank").val()
    );
    pushtostorage(temp_event_storage, tempswimrecord);
    displaySwimEvents(temp_event_storage);
    $.ajax({
        url: "/users/" + current_swimr + "/history",
        method: "POST",
        data: {
            swimr_name: current_swimr,
            eventName: $(".event_name").val(),
            eventDate: $(".event_date").val(),
            eventStroke: $("select.event_stroke").val(),
            eventDistance: $(".event_distance").val(),
            eventTime: $(".event_time").val(),
            eventRank: $(".event_rank").val()
        }
    }).done(function (newevent) {
        console.log("you made a new event " + newevent);
    }).fail(function (error) {
        console.log("error creating event " + error);
    });
    console.log("you tried to add a record");
}

//  display swimr events
function displaySwimEvents(records) {
    console.log("attempting to display swim records");
    console.log(records);
    $(".records_data").empty();
    for (var i = 0; i < records.length; i++) {
        var tempnum = i;
        var showEvents = function (i, temp_history) {
            console.log("I am " + i);
            var swim_template = $('.hidden_wrap .event_wrap').clone();
            //var swim_template = $('.hidden_wrap .records_template').clone();
            var date_elem = swim_template.find('.event_date');
            date_elem.html(temp_history[i].eventDate);
            var name_elem = swim_template.find('.event_name');
            name_elem.html("<h2>" + temp_history[i].eventName + "</h2>");
            var distance_elem = swim_template.find('.event_distance');
            distance_elem.html(temp_history[i].eventDistance);
            var stroke_elem = swim_template.find('.event_stroke');
            stroke_elem.html(temp_history[i].eventStroke);
            var time_elem = swim_template.find('.event_time');
            time_elem.html(temp_history[i].eventTime);
            var rank_elm = swim_template.find('.event_rank');
            rank_elm.html(temp_history[i].eventRank);
            return swim_template;
        }
        var hist_record = showEvents(tempnum, temp_event_storage);
        $(".records_data").append(hist_record);
    }
}

//  get swimr events from db
function getSwimEvents() {
    $.ajax({
        url: "/users/" + current_swimr + "/history",
        method: "GET",
        /*data: {
            swimr_name: current_swimr
        }*/
    }).done(function (found_events) {
        console.log("you requested the swim events for " + current_swimr);
        found_events.forEach(function (found_item) {
            temp_event_storage.unshift(found_item);
        })
        //temp_event_storage.unshift(found_events);
        console.log(temp_event_storage);
        displaySwimEvents(temp_event_storage);
    }).fail(function (err) {
        console.log("error getting swimr events from db " + err);
    });
}
// delete temp swimr events
function delete_temp_event(temp_event_storage, event_del_name) {
    for (var i = 0; i < temp_event_storage.length; i++) {
        if (temp_event_storage[i].eventName === event_del_name) {
            console.log("found and will delete " + temp_event_storage[i].eventName);
            temp_event_storage.splice(i, 1);
        }
    }
}
//  delete swimr events from db
function delete_event(event_del_name) {
    $.ajax({
        url: "/users/" + current_swimr + "/history",
        method: "DELETE",
        data: {
            swimr_name: current_swimr,
            eventName: event_del_name
        }
    }).done(function (deleted_event) {
        console.log("you deleted an event from the database" + deleted_event);
        displaySwimEvents(temp_event_storage);
    }).fail(function (err) {
        console.log("error deleting swim event ");
    });
}

$(document).ready(function () {
    setCurrentDate();
    current_swimr = localStorage.getItem("current_swimr");
    getSwimEvents();
    displaySwimEvents(temp_event_storage); //do I need this if getSwimEvents calls it already

    //  set button with current swimmers name
    $(".btn_swimr_menu").html(
        "<i class='fa fa-chevron-left' aria-hidden='true'></i> &nbsp &nbsp &nbsp" +
        current_swimr);
    
    
    //Click swimr name to go back to menu
    $(".btn_swimr_menu").on("click", function () {
        window.location = "swimmers.html";
        //  empty array
        temp_event_storage.length = 0;
    });

    //  Display confirm Swimr DELETE
    $("div").on("click", ".btn_show_del_swimr", function () {
        $(".btn_show_del_swimr").css("display", "none");
        $(".confirm_del_swimr").css("display", "inline-block");
    });

    //Cancel Swimr DELETE
    $("div").on("click", ".btn_cancel", function () {
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
    });

    //Swimr DELETE
    $("div").on("click", ".btn_del_swimr", function (event) {
        deleteSwimr();
    });
    //Click to cancel/close add event form
    $(".btn_event_close").on("click", function () {
        $(".add_record_wrap").css("display", "none");
        $(".records_wrap").css("display", "block");
    });
    //open new event form
    $(".btn_show_create_form").on("click", function () {
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
        $(".records_wrap").css("display", "none");
        $(".add_record_wrap").css("display", "inline-block");
    });
    //Add new swim record event
    $(".add_record_data").submit(function (event) {
        event.preventDefault();
        createSwimrEvent();
        //reset forms
        $(".event_name").val("");
        setCurrentDate();
        $("select.event_stroke").val("");
        $(".event_distance").val("");
        $(".event_time").val("");
        $(".event_rank").val("");
        //Hide forms
        $(".add_record_wrap").css("display", "none");
        //Show swim records again
        $(".records_wrap").css("display", "block");
    });
    //Delete swim record event for swimr
    $(".records_data").on("click", ".btn_remove_event", function (event) {
        console.log($(this).parent().parent().find(".event_name").text());
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
        event_del_name = $(this).parent().parent().find(".event_name").text();
        delete_temp_event(temp_event_storage, event_del_name);
        delete_event(event_del_name);
    });
});