var data;

var lati;
var long;

$(function() {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
    
    var req = new XMLHttpRequest();

    req.open('GET', 'http://accd1036.ngrok.io/api/gps', true);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            console.log(req.responseText);
        }
    };
    req.setRequestHeader('Accept', 'application/json');
    req.send();

// Request info from API

var localGps = localStorage.getItem("gpsEntries");
var localJourn = localStorage.getItem("journalEntries");
var localWemo = localStorage.getItem("wemoEntries");
var localMem = localStorage.getItem("memtestEntries");
    
// GPS
$.ajax({
        url: "http://accd1036.ngrok.io/api/gps",
        dataType: 'json',
        data: data
    })
    .done(function(data) {
        console.log("Acquired GPS");
        console.log(data[0]);
        var numEntries = data.length;
        lati = data[0].lat;
        long = data[0].lon;
        var timeD = data[0].time;
        $(".gpsLat").html(lati);
        $(".gpsLon").html(long);
        $(".gpsTime").html(timeD);
        $(".gpsEntries").html(numEntries);
    
        if (numEntries>=localGps) {
            $(".gpsEntries").html(numEntries-localGps);
            localStorage.setItem("gpsEntries", numEntries);
        }
        if (numEntries<localGps) {
            /*This shouldn't happen*/
        }
    })
    .fail(function(data) {
        console.log("Failed GPS Retrieval");
    });
    
// MMSE
$.ajax({
        url: "http://accd1036.ngrok.io/api/memoryGame",
        dataType: 'json',
        data: data
    })
    .done(function(data) {
        console.log("Acquired MMSE");
        console.log(data[0]);
        var numEntries = data.length;
        var score = data[0].score;
        var user = data[0].user;
        var timeD = data[0].time;
        $(".memScore").html(score);
        $(".memUser").html(user);
        $(".memTime").html(timeD);
        $(".memEntries").html(numEntries);
    })
    .fail(function(data) {
        console.log("Failed MMSE Retrieval");
    });
    
// Journal
$.ajax({
        url: "http://accd1036.ngrok.io/api/journal",
        dataType: 'json',
        data: data
    })
    .done(function(data) {
        console.log("Acquired Journal");
        console.log(data[0]);
        var numEntries = data.length;
        var medicationTaken = data[0].medication;
        var message = data[0].message;
        var timeD = data[0].datetime;
        var activities = data[0].activities;
        $(".jMed").html(medicationTaken);
        $(".jMessage").html(message);
        $(".jTime").html(timeD);
        $(".jActivities").html(activities);
        $(".jEntries").html(numEntries);
    })
    .fail(function(data) {
        console.log("Failed Journal Retrieval");
    });

// WeMo
$.ajax({
        url: "http://accd1036.ngrok.io/api/wemo",
        dataType: 'json',
        data: data
    })
    .done(function(data) {
        console.log("Acquired WeMo");
        console.log(data[0]);
        var numEntries = data.length;
        var prevEntries = localStorage.getItem("wemoEntries");
        var status = data[0].status;
        var time = data[0].time;
        var date = data[0].date;
        $(".wemoStatus").html(status);
        $(".wemoTime").html(time);
        $(".wemoDate").html(date);
        $(".wemoEntries").html(numEntries);
    })
    .fail(function(data) {
        console.log("Failed WeMo Retrieval");
    });

});

window.onload = function() {
    console.log("window.onload");
    var latlon = new google.maps.LatLng(lati, long);
    var mapholder = document.getElementById('#mapholder');
    mapholder.style.height = '250px';
    mapholder.style.width = '500px';

    var myOptions = {
        center:latlon,zoom:14,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    };

    var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
};