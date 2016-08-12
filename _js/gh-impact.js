/*
Ian Dennis Miller
*/

var query = function() {

    var account_name = $("#account_name_query").val();
    if ((!account_name) || (account_name == "undefined")) {
        return(false);
    }

    $("#masked").css("display", "block");
    $("#examples").css("display", "none");
    $("#search_box").css("display", "none");

    var bucket = $.md5(account_name.toLowerCase()).slice(0, 2);

    $.getJSON( "data/json/" + bucket + ".json", function(data) {
        var account = data[account_name.toLowerCase()];
        if (account != undefined) {
            $("#account_name").html("<a target='_blank' href='http://github.com/" + account["l"] + "'>" + account["l"] + "</a>");
            $("#impact_score").html("<a href='http://www.gh-impact.com/#" + account["l"] + "'>" + account["s"] + "</a>");
            if (account["t"] == 1) {
                $("#account_type").html("Individual");
            }
            else {
                $("#account_type").html("Organization");
            }
            show_percentile(account["s"], account["t"]);
            location.hash = account["l"];
            document.title = "gh-impact report: " + account["l"];

            ga('send', {
                hitType: 'event',
                eventCategory: 'search',
                eventAction: 'query',
            });
        }
        else {
            $("#account_name").html("not found");
            $("#impact_score").html("");

            ga('send', {
                hitType: 'event',
                eventCategory: 'search',
                eventAction: 'not_found',
            });
        }
    });
}

var show_percentile = function(score, account_type) {
    var percentiles = [
        [0.0000000, 0.0000000, 0.6829202, 0.8619581, 0.9310143, 0.9617953, 0.9776193, 0.9857905, 0.9903589, 0.9931521],
        []
    ];

    var result;

    if (account_type == 1) { // individual
        if (score < 10) {
            result = Math.round(percentiles[0][score] * 100);
        }
        else {
            result = 99;
        }
    }
    else { //organziation
        result = "not scored yet";
    }

    $("#percentile").html(result);
}

var run_location = function() {
    if (location.hash != "") {
        var q = location.hash;
        q = q.substring(1, location.hash.length);
        $("#account_name_query").val(q);
        query();

        ga('send', {
            hitType: 'event',
            eventCategory: 'index',
            eventAction: 'run_location',
        });
    }
    else {
        $("#masked").css("display", "none");
        $("#account_name_query").val("");
        $("#search_box").css("display", "block");
        show_examples();
    }
}

var show_examples = function() {
    $("#examples ul").randomize("li");
    $("#examples ul li").slice(5, $("#examples ul li").length).remove();
    $("#examples").slideDown();

    ga('send', {
        hitType: 'event',
        eventCategory: 'index',
        eventAction: 'show_examples',
    });
}

var handle_enter = function (e) {
    if (e.which == 13) {
        query();
        return false;
    }
}

$(function() {
    $("#search").removeAttr("href");
    $("#search").click(query);
    $('#search').keypress(handle_enter);

    $('#account_name_query').keypress(handle_enter);

    $(window).on('hashchange', run_location);
    run_location();
});
