// http://cordova.apache.org/docs/en/3.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide
// http://cordova.apache.org/docs/en/edge/plugin_ref_plugman.md.html#Using%20Plugman%20to%20Manage%20Plugins_installing_core_plugins
// http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface
// https://github.com/apache/cordova-ios
// https://github.com/apache/cordova-plugman
// http://stackoverflow.com/questions/17795899/loading-barcode-plugin-in-phonegap-using-plugman
// http://shazronatadobe.wordpress.com/2012/11/07/cordova-plugins-put-them-in-your-own-repo-2/
// http://shazronatadobe.wordpress.com/?s=barcode
// https://github.com/phonegap-build/BarcodeScanner
// *** https://github.com/wildabeast/BarcodeScanner
// https://github.com/phonegap/phonegap-plugins/tree/master/iOS/BarcodeScanner

// cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git
// http://docs.phonegap.com/en/2.2.0/cordova_notification_notification.md.html#notification.confirm

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);


        scanButton = document.getElementById("scan-button");
        resultSpan = document.getElementById("scan-result");
       

        //scanButton.addEventListener("click", clickScan, false);
    }
};


$(document).ready(function(){

    $('#year_event').val('2013');
    $('#month_event').val('9');

    var local = app.local;
    testJSON ={
        'youpi':'super',
        'autre':true,
        'id':31
    }
    local.set('foo', testJSON);
    var bar = local.get('foo');
    console.log(bar);

    $.ajax({
           url:'http://www.sciencespo.fr/evenements/api/',
           type:'get',
           data:{
               event:'',
               month:9,
               year:2013
           },
           success:function(data){
                console.log(JSON.parse(data));

                dataJSON = JSON.parse(data);
                if(typeof(dataJSON.evenements)!='undefined'){

                    var i = 0;
                    $("#id_organisme").empty();
                    $.each(dataJSON.evenements.organismes, function(item) {
                        i++;
                        var is_selected = i==1 ? 'true' : 'false';
                        $("#id_organisme").append(
                            $("<option />")
                            .prop('selected', is_selected)
                            .val( dataJSON.evenements.organismes[item].id )
                            .text(dataJSON.evenements.organismes[item].nom)
                        );
                    });
                    //$("#id_organisme").prop("selectedIndex", 0);

                    $.each(dataJSON.evenements.evenement, function(item) {
                        $("#id_event").append(
                            $("<option />")
                            .val( dataJSON.evenements.evenement[item].id )
                            .text(dataJSON.evenements.evenement[item].titre)
                        );
                    });
                    //$("#id_event").prop("selectedIndex", 0);


                    //$( "#menu" ).trigger( "updatelayout" );
                }

                if(typeof(dataJSON.evenement) != 'undefined'){

                    $("#id_session").empty();
                    $.each(dataJSON.evenement.sessions, function(item) {
                        $("#id_session").append(
                            $("<option />").val( dataJSON.evenement.sessions[item].id )
                            .text(dataJSON.evenement.sessions[item].titre)
                        );
                    });

                    //data_event = dataJSON.evenement;
                }
           },
           error:function(w,t,f){
                console.log(w+' '+t+' '+f);
           }
    });

    $('#scan-button').click(function(e){
        console.log('scan');
        //http://docs.phonegap.com/en/2.2.0/cordova_notification_notification.md.html
        
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    });

});

//appendToList($('#event-list'),'c', dataJSON.evenements.evenement[item].id, dataJSON.evenements.evenement[item].titre);

/**
 * [appendToList description]
 * @param  {[type]} reference [description]
 * @param  {[type]} theme     [description]
 * @param  {[type]} id        [description]
 * @param  {[type]} texte     [description]
 * @return nothing            temple la liste passée en réference
 */
function appendToList(reference,theme,id,texte){
    reference.append(
        $('<li/>')
        .data('corners',false)
        .data('shadow',false)
        .data('iconshadow',false)
        .data('wrapperels','div')
        .data('icon','arrow-r')
        .data('iconpos','right')
        .data('theme',theme)
        .addClass('ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c')
        .append(
            $('<div/>')
            .addClass('ui-btn-inner ui-li')
            .append(
                $('<div/>')
                .addClass('ui-btn-text')
                .append(
                    $('<a/>').attr('href','#')
                    .addClass('ui-link-inherit')
                    .data('eventID',id)
                    .text(texte)
                )
            )
            .append(
                $('<span/>')
                .addClass('ui-icon ui-icon-arrow-r ui-icon-shadow')
                .html('&nbsp;')
            )
        )
    );
}


/**
 * [scannerSuccess description]
 * @param  {[type]} result [description]
 * @return {[type]}        [description]
 */
function scannerSuccess(result) {
    /*alert("We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled);*/

    /*console.log("scannerSuccess: result: ");
    console.log(result);
    // JSON.stringify(result);
    resultSpan.innerText = result.text;*/
    $('#scan-result').text(result.text);
    //navigator.notification.alert(result.text);
    //navigator.notification.beep(1);

    navigator.notification.confirm(
        result.text,            // message
        onConfirm,              // callback to invoke with index of button pressed
        'Resultat',            // title
        'Abandonner,Scanner'          // buttonLabels
    );
}
/**
 * [onConfirm description]
 * @param  {[type]} confirmID [description]
 * @return {[type]}           [description]
 */
function onConfirm(confirmID){
    if(confirmID == 2){
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    }
}

/**
 * [scannerFailure description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function scannerFailure(message) {
    console.log("scannerFailure: message: " + message)
    resultSpan.innerText = "failure: " + JSON.stringify(message)
}



var event_month;
var event_year;
var event_id_organisme;
var event_id_event;
var event_id_session;

function loadEventFromAPI(param){

    issetParam = typeof(param) != 'undefined' ? param : false;

    if(typeof(event_year)!= 'undefined' && typeof(event_month)!= 'undefined' && typeof(event_id_organisme)!= 'undefined' && typeof(event_id_event)!= 'undefined' && typeof(event_id_session)!= 'id_session' && issetParam == true ){

        var param = {
            year        : event_year,
            month       : event_month,
            id_organisme: event_id_organisme,
            lang        : "fr",
        }

    }else{

        var param = {
            year        : $("#year_event").val(),
            month       : $("#month_event").val(),
            id_organisme: $("#id_organisme").val(),
            lang        : "fr",
            id_event    : $("#id_event").val()
        }
    }


    $.ajax({
        url     :"../ajax/api-event.php",
        type    : "GET",
        dataType:'json',
        data    : param

    }).done(function ( dataJSON ) {
        console.log('date event reçues');
    });
}


/**
 * Pour enregistrer des données en local
 * cf //http://stackoverflow.com/questions/6511892/how-to-work-with-json-feed-stored-in-localstorage-in-phonegap-app
 * @return {[type]} [description]
 */
app.local = (function () {
    var self = {};

    self.get = function (key) {
        var b = localStorage.getItem(key);
        return b ? JSON.parse(b) : null;
    }

    self.set = function (key, value) {
        var b = JSON.stringify(value);
        localStorage.setItem(key, b);
    }

    return self;
})();

