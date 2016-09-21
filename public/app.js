var current_swimr;
var temp_storage;
var event_del_name;

//  New Swimr menu populating function
function newSwimr(newname) {
    var swimr_template = $('.hidden_wrap .swimr_template').clone();
    var name_elem = swimr_template.find('.btn_show_records');
    name_elem.html('<img class="identavar" src="./identavar.png">' + newname);
    return swimr_template;
}

//  function that displays Swimrs from the temp storage
function displaySwimrs(swimrsarray) {
    for (var index in swimrsarray) {
        var made_newswimr = newSwimr(swimrsarray[index].name);
        $(".swimr_list_data").prepend(made_newswimr);
    }
}

//  ajax call to get all users
function retrieveSwimrs() {
    $.ajax({
        url: "/users",
        method: "GET"
    }).done(function (swimrs) {
      $(".swimr_list_data").children().remove();
      console.log(swimrs);
      displaySwimrs(swimrs);
      temp_storage = swimrs;
      console.log(temp_storage);
    });
}


//  display event records
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
                    return swim_template;
                }
                var hist_record = showEvents(e, temp_history);
                $(".records_table").append(hist_record);
            }
        }
    }

}



$(document).ready(function () {
    // Auto get records on page load
    retrieveSwimrs();
    console.log(temp_storage);

    // show login options
    $(".btn_confirm").on("click", function (event) {
        $(".intro_words").css("display", "none");
        $(".login_wrap").css("display", "block");
    });

    // click log in button
    $(".btn_submit_login").on("click", function (event) {
        event.preventDefault();
        var username = $(".user_name").val();
        var password = $(".user_password").val();
        if (username === "" || password === "") {
            $(".login_error").css("display", "none");
            $(".login_error_nodata").css("display", "block");
        }else {
            console.log("attempting to ajax the house");
            $(".login_error").css("display", "none");
            $(".login_error_nodata").css("display", "none");
            $.ajax({
                url: "/auth/login",
                method: "POST",
                data: {
                    username: username,
                    password: password
                }
            }).done(function () {
                console.log("you logged in");
                //redirect to events.html
                window.location = "events.html"; 
                //get list of swimrs
                //window.cookie
            }).fail(function (error) {
                console.log('error with credentials' + error),
                $(".login_error").css("display", "block");
            });
        }
    });

    // show new user form
    $(".btn_new_user").on("click", function (event) {
        event.preventDefault();
        $(".login_data").css("display", "none");
        $(".new_acct_form").css("display", "block");
    });

    // check that new user password fields match
    $(".input_new_password_confirm").keyup(function () {
        var new_password = $(".input_new_password").val();
        var new_password_confirm = $(".input_new_password_confirm").val();
        if (new_password != new_password_confirm) {
            $(".btn_submit_newuser").prop("disabled", true);
            $(".passwords_nomatch").css("display", "block");
            $(".passwords_match").css("display", "none");
        } else {
            $(".btn_submit_newuser").prop("disabled", false);
            $(".passwords_nomatch").css("display", "none");
            $(".passwords_match").css("display", "block");
        }
    });

    // Create new User
    $(".btn_submit_newuser").on("click", function(event) {
        event.preventDefault();
        var newusername = $(".new_user_name").val();
        var newuserpassword = $(".input_new_password_confirm").val();
        $.ajax({
            url: "auth/create",
            method: "POST",
            data: {
                username: newusername,
                password: newuserpassword
            }
        }).done(function(data) {
            console.log("new user created" + data);
        }).fail(function (jqXHR, error) {
                console.log("error new user creation failed"),
                $(".new_login_error").css("display", "block")
                });
    });

    // CREATE Swimr on click
    $(".add_swimr").submit(function (event) {
        event.preventDefault();
        var newname = $(".swimr_name").val();
        $(".swimr_name").val("");
        var made_newuser = newSwimr(newname);
        //hide add swimr form
        $(".add_swimr_wrap").css("display", "none");
        $(".swimr_list_data").append(made_newuser);
        console.log(newname);
        //ajax call
        $.ajax({
            url: "/users",
            method: "POST",
            data: {
                swimr_name: newname
            }
        }).done(retrieveSwimrs, function() {
            console.log("done creating swimrs");
        })
        .fail(function (jqXHR, error) {
            console.log("an error prevented creation of a new swimr");
        });
        current_swimr = newname;
        displayRecords(temp_storage);
        $(".swimrs_wrap").css("display", "block");
    });

    $(".btn_swimr_close").click(function (event) {
        $(".add_swimr_wrap").css("display", "none");
        $(".swimrs_wrap").css("display", "block");
    });

    //Confirm Swimr DELETE
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
        //var tempid = $($(this).parent()).parent().attr("value");
        var swimrname = current_swimr;
        console.log("you clicked delete for " + swimrname);
        $.ajax({
            url: "/users",
            method: "DELETE",
            data: { name: swimrname }
        }).done(retrieveSwimrs);
        $(".records_wrap").css("display", "none");
        $(".btn_swimr_menu").css("display", "none");
        $(".swimrs_wrap").css("display", "block");
    });



    // Push new swim record to temp storage
    function pushtostorage(temprecords, newrecord) {
        for (var i = 0; i < temprecords.length; i++) {
            if (temprecords[i].name === current_swimr) {
                var tempnum = i;
                console.log(temprecords[i].name);
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
    $(".add_record_data").submit(function (event) {
        event.preventDefault();
        tempswimrecord = new SwimRecord($(".event_name").val(), $(".event_date").val(), $("select.event_stroke").val(), $(".event_distance").val(), $(".event_time").val(), $(".event_rank").val());
        console.log(tempswimrecord);
        pushtostorage(temp_storage, tempswimrecord);
        displayRecords(temp_storage);
        $.ajax({
            url: "/"+current_swimr+"/history", /*do I need the user defined here?*/
            data: {
                name: current_swimr,
                eventName: $(".event_name").val(),
                eventDate: $(".event_date").val(),
                eventStroke: $("select.event_stroke").val(),
                eventDistance: $(".event_distance").val(),
                eventTime: $(".event_time").val(),
                eventRank: $(".event_rank").val()
            },
            method: "POST"
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

    function delete_temp_event(temp_storage, event_del_name) {
        for (var i = 0; i < temp_storage.length; i++) {
            if (temp_storage[i].name === current_swimr) {
                var tempnum = i;
                for (var e = 0; e < temp_storage[tempnum].swim_history.length; e++) {
                    if (event_del_name == temp_storage[tempnum].swim_history[e].eventName) {
                        temp_storage[tempnum].swim_history.splice(e, 1);
                    }
                }
            }
        }
    }

    //Show records for swimr
    $("section").on("click", ".btn_show_records", function () {
        $(".swimrs_wrap").css("display", "none");
        $(".add_record_data").css("display", "block");
        current_swimr = $(this).text();
        console.log($(this).text());
        $(".btn_swimr_menu").html("<i class='fa fa-chevron-left' aria-hidden='true'></i> &nbsp &nbsp &nbsp" + current_swimr);
        $(".btn_swimr_menu").css("display", "inline");
        $(".records_wrap").css("display", "block");
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
        console.log(current_swimr);
        displayRecords(temp_storage);
    });

    //Click swimr name to go back to menu
    $(".btn_swimr_menu").on("click", function () {
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
        $(".swimrs_wrap").css("display", "block");
        $(".records_wrap").css("display", "none");
        $(".btn_swimr_menu").css("display", "none");
        //make sure add swimr form is hidden
        $(".add_swimr_wrap").css("display", "none");
        //hide new event form
        $(".add_record_wrap").css("display", "none");
        $(".confirm_del_swimr").css("display", "none");
    })

    //Click to show add swimr form
    $(".btn_add_swimr").on("click", function () {
        $(".add_swimr_wrap").css("display", "block");
        $(".swimrs_wrap").css("display", "none");
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

    //Delete swim record event for swimr
    $("tbody").on("click", ".btn_remove_event", function (event) {
        $(".confirm_del_swimr").css("display", "none");
        $(".btn_show_del_swimr").css("display", "inline-block");
        //console.log("You clicked for delete " + $(this).parent().parent().text());
        console.log($(this).parent().parent().find(".event_name").text());
        //event_del_name = $(this).parent().attr("value");
        event_del_name = $(this).parent().parent().find(".event_name").text();
        console.log("You tried to delete the event called " + event_del_name);
        console.log(temp_storage);
        delete_temp_event(temp_storage, event_del_name);
        $.ajax({
            url: "/" + current_swimr + "/history",
            method: "DELETE",
            data: {
                name: current_swimr,
                eventName: event_del_name
            }
        }).done(retrieveSwimrs);
        displayRecords(temp_storage);
        console.log("you deleted a swim record");
    });



});
