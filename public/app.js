var current_swimr;
var temp_storage = [];
var temp_event_storage = [];

//  show intro text
function showIntroMessage(temp_storage) {
    if (temp_storage.length < 1) {
        $(".intro_message").css("display", "block");
    }else {
        $(".intro_message").css("display", "none");
    }
}

//  New Swimr menu populating function
function newSwimr(newname) {
    var swimr_template = $(".hidden_wrap .swimr_template").clone();
    var name_elem = swimr_template.find(".btn_show_records");
    name_elem.html(newname);
    return swimr_template;
}
//  create a new swimr
function createSwimr() {
    var newname = $(".swimr_name").val();
    $(".swimr_name").val("");
    var made_newuser = newSwimr(newname);
    //hide add swimr form
    $(".add_swimr_wrap").css("display", "none");
    $(".swimr_list_data").append(made_newuser);
    console.log(newname);
    $.ajax({
        url: "/users",
        method: "POST",
        data: {
            swimr_name: newname
        }
    }).done(retrieveSwimrs, function () {
        console.log("done creating swimrs");
    }).fail(function (error) {
            console.log("an error prevented creation of a new swimr");
        });
    current_swimr = newname;
    $(".swimrs_wrap").css("display", "block");
}

//  displays Swimrs from the temp storage
function displaySwimrs(swimrsarray) {
    showIntroMessage(swimrsarray);
    for (var index in swimrsarray) {
        var made_newswimr = newSwimr(swimrsarray[index].swimr_name);
        $(".swimr_list_data").prepend(made_newswimr);
    }
}

//  get all swimrs from db
function retrieveSwimrs() {
    $.ajax({
        url: "/users",
        method: "GET"
    }).done(function (swimrs) {
      $(".swimr_list_data").children().remove();
      console.log(swimrs);
      displaySwimrs(swimrs);
      temp_storage = swimrs;
      showIntroMessage(temp_storage);
      console.log(temp_storage);
    });
}



$(document).ready(function () {
    retrieveSwimrs();
    console.log(temp_storage);
    showIntroMessage(temp_storage);
    current_swimr = localStorage.getItem("current_swimr");
    console.log(current_swimr + " is the swimmer in localstorage");

    // show login form
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
        } else {
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
                window.location = "swimmers.html";
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
    $(".btn_submit_newuser").on("click", function (event) {
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
        }).done(function (data) {
            console.log("new user created" + data);
            window.location = "swimmers.html";
        }).fail(function (error) {
            console.log("error new user creation failed"),
                $(".new_login_error").css("display", "block")
        });
    });

    //  CREATE Swimr
    $(".add_swimr").submit(function (event) {
        event.preventDefault();
        createSwimr();
    });
    //  Cancel adding swimr
    $(".btn_swimr_close").click(function (event) {
        $(".add_swimr_wrap").css("display", "none");
        $(".swimrs_wrap").css("display", "block");
    });

    //  go to records page
    $("section").on("click", ".btn_show_records", function () {
        current_swimr = $(this).text();
        localStorage.setItem("current_swimr", current_swimr);
        window.location = "events.html";
    });

    //  Click to show add swimr form
    $(".btn_add_swimr").on("click", function () {
        $(".add_swimr_wrap").css("display", "block");
        $(".swimrs_wrap").css("display", "none");
    });

    //  Log out
    $(".btn_logout").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            url: "auth/logout",
            method: "GET"
        }).done(function() {
            console.log("You logged out");
            window.location = "index.html";
        }).fail(function() {
            console.log("An error occured trying to log out");
        });
    });

});
