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

        console.log('Received Event: ' + id);       
    }
};


var firstTimeRefresh;
var isAuthenticated;
var currentYear;
var currentMonth;
var currentOrganisme;

var mois = Array('janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre');

$(document).ready(function(){


    var local = app.local;
    testJSON ={
        'youpi':'super',
        'autre':true,
        'id':31
    }
    local.set('foo', testJSON);
    var bar = local.get('foo');
    //console.log(bar);

    // VARIABLES
    isAuthenticated = false;
    currentYear = new Date().getFullYear();
    currentMonth = parseInt(new Date().getMonth() +1);
    currentOrganisme = 1;
    firstTimeRefresh = true;


    // SELECTION DES SESSIONS
    for(var i=currentYear; i >= 2010 ; i--){
        $("#year_event").append(
            $("<option />")
            .val(i)
            .text(i)
        );
    }

    $("#year_event").val(currentYear); 
    $("#month_event").val(currentMonth);
    $( "select" ).selectmenu('refresh');

    $("#month_event, #year_event, #id_organisme").change(function(e){
        currentYear      = $('#year_event').val();
        currentMonth     = $("#month_event").val();
        currentOrganisme = firstTimeRefresh ? 1 : $('#id_organisme').val();;

        refreshSessionList();
    });


    // SCAN DE BILLET
    $('#scan-button').click(function(e){
        console.log('scan');
        //http://docs.phonegap.com/en/2.2.0/cordova_notification_notification.md.html
        
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    });


    // CONNEXION
    $("form#login_form").submit(function(e){
        $.ajax({
            url:'http://www.sciencespo.fr/evenements/api/',
            type:'post',
            data:{
                login:      $("#login").val(),
                password:   $("#password").val()
            },
            dataType:'json',
            beforeSend: $.mobile.loading('show'),
            success:function(dataJSON){
                if(dataJSON.isAuthenticated == true){
                    isAuthenticated == true;

                    console.log('ON EST CONNECTÉ') 
                }else if(dataJSON.isAuthenticated == false){
                    isAuthenticated == false;

                    console.log('ON EST DECONNECTÉ')
                }
            }
        });
        return false;
    });

    // DECONNEXION
    $("form#logut_form").submit(function(e){
        $.ajax({
            url:'http://www.sciencespo.fr/evenements/api/',
            type:'post',
            data:{
                logout:      $("#logout").val(),
            },
            dataType:'json',
            beforeSend: $.mobile.loading('show'),
            success:function(dataJSON){
                if(dataJSON.isAuthenticated == true){
                    isAuthenticated == true;

                    console.log('ON EST CONNECTÉ') 
                }else if(dataJSON.isAuthenticated == false){
                    isAuthenticated == false;

                    console.log('ON EST DECONNECTÉ')
                }
            }
        });
        return false;
    });
});



// GESTION DE L'AFFICHAGE DES PAGES

// ACCUEIL
$( document ).on( "pageshow", "#accueil", function( event ) {
    console.log("ACCUEIL");
    refreshSessionList();
} );

// AUTHENTIFICATION
$( document ).on( "pageshow", "#authentification", function( event ) {
    console.log("AUTHENTIFICATION");
} );

// DETAIL D'UNE SESSION
$( document ).on( "pageshow", "#session_detail", function( event ) {
    console.log("DÉTAIL SESSION");
} );

// LISTE DES INSCRITS
$( document ).on( "pageshow", "#listing_inscrits", function( event ) {
    console.log("LISTING INSCRITS");
} );



/**
 * [refreshSessionList description]
 * @return {[type]} [description]
 */
function refreshSessionList(){
    $.ajax({
        url:'http://www.sciencespo.fr/evenements/api/',
        type:'get',
        data:{
            event:          '',
            month:          currentMonth,
            year:           currentYear,
            id_organisme :  currentOrganisme
        },
        dataType:'json',
        beforeSend: $.mobile.loading('show'),
        success:function(dataJSON){
            $.mobile.loading('hide');    

            //dataJSON = JSON.parse(data);
            if(typeof(dataJSON.evenements)!='undefined'){

                // on rempli la liste des organismes
                $("#id_organisme").empty();
                $.each(dataJSON.evenements.organismes, function(api_id_organisme) {
                    $("#id_organisme").append(
                        $("<option />")
                        .val( dataJSON.evenements.organismes[api_id_organisme].id )
                        .text(dataJSON.evenements.organismes[api_id_organisme].nom)
                    );
                });

                // on prépare la liste des sessions
                $("#liste_sessions").empty();
                var liste_sessions = Array();

                $.each(dataJSON.evenements.evenement, function(api_id_event) {
                    $.each( dataJSON.evenements.evenement[api_id_event].sessions, function(api_id_session) {
                        var ladate = dataJSON.evenements.evenement[api_id_event].sessions[api_id_session].date.split('-');

                        liste_sessions.push({
                            id :    dataJSON.evenements.evenement[api_id_event].sessions[api_id_session].id,
                            titre : dataJSON.evenements.evenement[api_id_event].sessions[api_id_session].titre,
                            jour : ladate[2],
                            mois : ladate[1],
                            date : dataJSON.evenements.evenement[api_id_event].sessions[api_id_session].date
                        });
                    });
                });

                // on trie par date la liste des sessions
                liste_sessions.sort(function(a,b){
                    return (parseInt(a.jour) > parseInt(b.jour) ? -1 : 1);
                });

                // on crée les éléments de liste des sessions 
                for(var i=0; i<liste_sessions.length; i++){
                    $("#liste_sessions").append(
                        $("<li />").append(
                                $("<a/>")
                            .attr('href','#session_detail')
                            .data('transition','slide')
                            .data('id_session',liste_sessions[i].id)
                            .data('date',liste_sessions[i].date)
                            .data('jour',liste_sessions[i].jour)
                            .text(liste_sessions[i].titre)
                        )
                        .data('date',liste_sessions[i].jour+' '+mois[(parseInt(liste_sessions[i].mois)-1)])
                    );
                }
    
                $('#liste_sessions')
                .listview({
                    autodividers: true,
                    autodividersSelector: function (li) {
                        var out = li.data("date");
                        return out;
                    }
                })
                .listview('refresh');
                

                $('#id_organisme').val(currentOrganisme);

                $('#liste_sessions li').bind('click', function() {
                    $('#valb').text( $(this).text() );
                });

                //http://stackoverflow.com/questions/5366508/jquery-mobile-update-select-using-javascript
                $( "select" ).selectmenu('refresh');
            }


            if(typeof(dataJSON.evenement) != 'undefined'){
                $("#id_session").empty();
                $.each(dataJSON.evenement.sessions, function(item) {
                    $("#id_session").append(
                        $("<option />").val( dataJSON.evenement.sessions[item].id )
                        .text(dataJSON.evenement.sessions[item].titre)
                    );
                });
            }

            firstTimeRefresh = false;
        },
        error:function(w,t,f){
            console.log(w+' '+t+' '+f);
        }
    });
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
        onScanConfirm,              // callback to invoke with index of button pressed
        'Resultat',            // title
        Array('Abandonner','Scanner')          // buttonLabels
    );
}


/**
 * [scannerFailure description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function scannerFailure(message) {
    //console.log("scannerFailure: message: " + message)
    //resultSpan.innerText = "failure: " + JSON.stringify(message)
    navigator.notification.alert("Il y a eu un problème lors du scan : "+message);
}


/**
 * [onConfirm description]
 * @param  {[type]} confirmID [description]
 * @return {[type]}           [description]
 */
function onScanConfirm(confirmID){
    if(confirmID == 2){
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    }
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

