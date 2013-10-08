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
    /*onDeviceReady: function() {
        app.receivedEvent('deviceready');

        console.log("DEVICE READY");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);       
    }*/ 
};

var firstTimeRefresh;
var isAuthenticated;
var currentYear;
var currentMonth;
var currentOrganisme;
var id_session;
var id_inscrit;
var actual_session;
var local;
var filename = escape("test de nom éé.txt");
var filecontent = "Test at "+new Date().toString() + "\n";

var mois = Array('janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre');

var fileSystem;
var locale_sessions = Array();


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    console.log("DEVICE READY");
    

    $(document).ready(function(){
        console.log('JQUERY READY');

        // on appelle le système de fichier uniquement quand jquery est prêt
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, onFSError);
    });
}

/*
 * ====================================
 * FILE SYSTEM
 * cf http://www.raymondcamden.com/index.cfm/2012/3/9/PhoneGaps-File-API
 * ====================================
 */


//generic getById
function getById(id) {
    return document.querySelector(id);
}

//generic error handler
function onFSError(e) {
    console.log('Error : '+e);
}

function onFSSuccess(fs) {
    console.log('onFSSuccess');
    fileSystem = fs;

    getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);            
    getById("#addFileButton").addEventListener("touchstart",doSaveFile);            
    getById("#readFileButton").addEventListener("touchstart",doReadFile);            
    getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);            
    getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);            
    
    console.log( "Got the file system: "+fileSystem.name +"\n" + "root entry name is "+fileSystem.root.name); 

    doDirectoryListing();
}

function doDirectoryListing(e) {
    console.log('doDirectoryListing');
    //get a directory reader from our FS
    var dirReader = fileSystem.root.createReader();

    dirReader.readEntries(gotFiles,onFSError);    
}

function gotFiles(entries) {
    console.log('gotFiles');
    //var s = "";

    $('#saved_sessions').html('<li data-role="list-divider" data-theme="a" role="heading">Conférences mémorisées :</li>');

    for(var i=0,len=entries.length; i<len; i++) {
        //entry objects include: isFile, isDirectory, name, fullPath

        if (entries[i].isFile && entries[i].name!='.DS_Store') {
            // file
            $('#saved_sessions').append(
                $("<li />")
                .append(
                    $("<a/>")
                    .attr('href','#session_detail')
                    .data('transition','slide')
                    //.data('date',liste_sessions[i].date)
                    //.data('jour',liste_sessions[i].jour)
                    .text(get_file_session_name(entries[i].name))
                    .append(
                        $("<img/>")
                        .attr('width',16)
                        .attr('height',16)
                        .addClass('ui-li-icon')
                        .attr('src','images/neutre@2x.png')
                    )
                )

                //.data('date',liste_sessions[i].jour+' '+mois[(parseInt(liste_sessions[i].mois)-1)])
                //data('id_session',liste_sessions[i].id)
            );


            locale_sessions.push(get_file_session_name(entries[i].name))

        } else{
            // directory
        } 
    }

    $('#saved_sessions')
    .listview({
        autodividers: true,
        autodividersSelector: function (li) {
            var out = li.data("date");
            return out;
        }
    })
    .listview('refresh');

}


function doSaveFile(e) {
    console.log('doSaveFile');
    fileSystem.root.getFile(filename, {create:true}, saveFileContent, onFSError);
}

function saveFileContent(f) {
    console.log('saveFileContent');
    f.createWriter(function(writerOb) {
        writerOb.onwrite=function() {
            console.log("Done writing to file");
        }
        //go to the end of the file...
        //writerOb.seek(writerOb.length);
        writerOb.seek(0);
        writerOb.write(filecontent);

        doDirectoryListing();
    });    
}

function doReadFile(e) {
    console.log('doReadFile');
    fileSystem.root.getFile(filename, {create:true}, readFile, onFSError);
}

function readFile(f) {
    console.log('readFile')
    reader = new FileReader();
    reader.onloadend = function(e) {
        console.log("go to end");
        console.log(e.target.result);
    }
    reader.readAsText(f);
}

function doMetadataFile(e) {
    console.log('doMetadataFile');
    fileSystem.root.getFile(filename, {create:true}, function(f) {
        f.getMetadata(metadataFile,onFSError);
    }, onFSError);
}

function metadataFile(m) {
    console.log('metadataFile');
    console.log("File was last modified "+m.modificationTime);    
}

function doDeleteFile(e) {
    console.log('doDeleteFile');
    fileSystem.root.getFile(filename, {create:true}, function(f) {
        f.remove(function() {
            console.log("File removed"); 

            doDirectoryListing();
        });
    }, onFSError);
}

/**
 * Sert à supprimer le .txt d'un nom de fichier
 * @param  {[type]} _filename [description]
 * @return {[type]}           [description]
 */
function get_file_session_name(_filename){
    var n=_filename.lastIndexOf(".");
    return unescape(_filename.substring(0,n));
}


/*
 * ====================================
 * CHECK CONNEXION
 * ====================================
 */


function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    navigator.notification.alert('Connection type: ' + states[networkState]);
}




// ACCUEIL
$( document ).on( "pagebeforeshow", "#accueil", function( event ) {
    console.log("ACCUEIL");
    console.log('authentifié ? '+isAuthenticated);

    isAuthenticated = false;

    $('.connected').css('display','none');
    $('.not_connected').css('display','none');


    local = app.local;
    testJSON ={
        'youpi':'super',
        'autre':true,
        'id':31
    }
    local.set('foo', testJSON);
    var bar = local.get('foo');
    //console.log(bar);
    
    // VARIABLES
    currentYear         = new Date().getFullYear();
    currentMonth        = parseInt(new Date().getMonth() +1);
    currentOrganisme    = 1;
    firstTimeRefresh    = true;


    $('.not_loggued').css('display','none');
    $("#logout_button").css('display','none');
    $("#login_button").css('display','block');
    

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
    $('#accueil select')
    .selectmenu()
    .selectmenu('refresh');

    console.log('firstTimeRefresh '+firstTimeRefresh);

    $("#month_event, #year_event, #id_organisme").change(function(e){
        currentYear      = $('#year_event').val();
        currentMonth     = $("#month_event").val();
        //currentOrganisme = firstTimeRefresh ? 1 : $('#id_organisme').val();
        currentOrganisme = $('#id_organisme').val();

        refreshSessionList();
    })

    refreshSessionList();
} );



// AUTHENTIFICATION
$( document ).on( "pagebeforeshow", "#authentification", function( event ) {
    console.log("AUTHENTIFICATION");
    console.log('authentifié ? '+isAuthenticated);

    if(!isAuthenticated){
        $("#logout_button").css('display','none');
        $("#login_button").css('display','block');
    }else{
        $("#logout_button").css('display','block');
        $("#login_button").css('display','none');
    }

    /*if(local.get('user_data').login == null || local.get('user_data').login ==''){
        $("#logout_button").hide();
        $("#login_button").show();

        $('.not_loggued').hide();
    }else{
        $('#login').val(local.get('user_data').login);
        $('#password').val(local.get('user_data').password);
    }*/

    $("#login_button")
    .unbind('click')
    .click(function(e){
    //$("form#login_form").submit(function(e){
        console.log('click login');

        /*user_data = {
            login:      $("#login").val(),
            password:   $("#password").val()
        }
        local.set('user_data', user_data);*/

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
                $.mobile.loading('hide');

                //console.log('AJAX resultat de login_form :');
                //console.log(dataJSON);
                if(dataJSON.isAuthenticated == true){
                    isAuthenticated = true;
                    console.log('ON EST CONNECTÉ');

                    $("#logout_button").css('display','block');
                    $("#login_button").css('display','none');
                }else if(dataJSON.isAuthenticated == false){
                    isAuthenticated = false;
                    console.log('ON EST DECONNECTÉ');

                    $("#logout_button").css('display','none');
                    $("#login_button").css('display','block');
                }
            }
        });

        e.preventDefault();
    });

    $("#logout_button")
    .unbind('click')
    .click(function(e){
        console.log('click login');

        /*user_data = {
            login:      null,
            password:   null
        }
        local.set('user_data', user_data);*/

        $("#login").val('');
        $("#password").val('');

        $.ajax({
            url:'http://www.sciencespo.fr/evenements/api/',
            type:'post',
            data:{
                logout:      true,
            },
            dataType:'json',
            beforeSend: $.mobile.loading('show'),
            success:function(dataJSON){
                $.mobile.loading('hide');

                if(dataJSON.isAuthenticated == true){
                    isAuthenticated = true;
                    console.log('ON EST CONNECTÉ');

                    $("#logout_button").css('display','block');
                    $("#login_button").css('display','none');
                }else if(dataJSON.isAuthenticated == false){
                    isAuthenticated = false;
                    console.log('ON EST DECONNECTÉ');

                    $("#logout_button").css('display','none');
                    $("#login_button").css('display','block');
                }
                $('.connected').css('display','block');
                $('.not_connected').css('display','none');
            },
            error:function(w,t,f){
                $('.connected').css('display','none');
                $('.not_connected').css('display','block');
            }
        });

        e.preventDefault();
    });
} );



// DETAIL D'UNE SESSION
$( document ).on( "pagebeforeshow", "#session_detail", function( event ) {
    console.log("DÉTAIL SESSION");
    console.log('authentifié ? '+isAuthenticated);

    refreshSessionDetail();
} );


// LISTE DES INSCRITS
$( document ).on( "pagebeforeshow", "#page_inscrits", function( event ) {
    console.log("LISTING INSCRITS");
    console.log('authentifié ? '+isAuthenticated);

    $("#listing_inscrits").empty();

    var temp = Array();

    $.each(actual_session.liste_inscrits, function(api_id_inscrit) {
        temp.push({
            texte : actual_session.liste_inscrits[api_id_inscrit].nom.toUpperCase()+" "+actual_session.liste_inscrits[api_id_inscrit].prenom.capitalize(),
            id : actual_session.liste_inscrits[api_id_inscrit].id
        });
    });

    temp.sort(function(a,b){
        return a.texte.toLowerCase() < b.texte.toLowerCase() ? -1 : 1;
    });
    
    $.each(temp, function(api_id_inscrit) {
        $("#listing_inscrits").append(
            $("<li/>")
            .append(
                $('<a/>')
                .attr('href','#detail_inscrit')
                .data('transition','slide')
                .text(temp[api_id_inscrit].texte)
            )
            .data('lettre',temp[api_id_inscrit].texte.substr(0,1).toUpperCase())
            .data('id', temp[api_id_inscrit].id )  
        );
    });

    $("#listing_inscrits")
    .listview({
        autodividers: true,
        autodividersSelector: function (li) {
            var out = li.data("lettre");
            return out;
        }
    })
    .listview('refresh');


    $('#listing_inscrits li')
    .bind('click', function() {
        id_inscrit = $(this).data('id');
        //refreshInscritDetail();
        //
        console.log($(this).data('id')+ ' ' + id_inscrit);
    });

    $('#scan-button')
    .unbind('click')
    .click(function(e){
        console.log('SCAN');
        //http://docs.phonegap.com/en/2.2.0/cordova_notification_notification.md.html
        
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    });
} );



// DETAIL D'UNE SESSION
$( document ).on( "pagebeforeshow", "#detail_inscrit", function( event ) {
    console.log("DÉTAIL INSCRIT");
    console.log('authentifié ? '+isAuthenticated);

    refreshInscritDetail(); 
} );



/**
 * [refreshInscritDetail description]
 * @return {[type]} [description]
 */
function refreshInscritDetail(){
    console.log(id_inscrit);

    console.log('ok');

    $('#casque').text(          actual_session.liste_inscrits[id_inscrit].casque);
    $('#date_scan').text(       actual_session.liste_inscrits[id_inscrit].date_scan);
    $('#entreprise').text(      actual_session.liste_inscrits[id_inscrit].entreprise);
    //$('#est_venu').text(        actual_session.liste_inscrits[id_inscrit].est_venu);
    $('#fonction').text(        actual_session.liste_inscrits[id_inscrit].fonction);
    $('#id').text(              actual_session.liste_inscrits[id_inscrit].id);
    $('#nom').text(             actual_session.liste_inscrits[id_inscrit].nom);
    $('#prenom').text(          actual_session.liste_inscrits[id_inscrit].prenom);
    $('#type_inscription').text(actual_session.liste_inscrits[id_inscrit].type_inscription);
    $('#unique_id').text(       actual_session.liste_inscrits[id_inscrit].unique_id);


    
    $('#est_venu')
    .val( actual_session.liste_inscrits[id_inscrit].est_venu == 1 ? 'oui' : 'non')
    .slider()
    .slider('refresh')
    .on('slidestop',function(e){
        actual_session.liste_inscrits[id_inscrit].est_venu = $(this).val() == 'oui' ? 1 : 0;

        console.log(actual_session.liste_inscrits[id_inscrit].est_venu);
    });
}


/**
 * [refreshSessionList description]
 * @return {[type]} [description]
 */
function refreshSessionList(){
    $.ajax({
        url:'http://www.sciencespo.fr/evenements/api/',
        type:'GET',
        data:{
            event:          '',
            month:          currentMonth,
            year:           currentYear,
            id_organisme :  currentOrganisme
        },
        dataType:'json',
        beforeSend: $.mobile.loading('show'),
        success:function(dataJSON){

            $('.connected').css('display','block');
            $('.not_connected').css('display','none');


            $.mobile.loading('hide');
            console.log('refreshSessionList :'+dataJSON.isAuthenticated);  

            isAuthenticated = dataJSON.isAuthenticated;
            //dataJSON = JSON.parse(data);
            console.log(isAuthenticated);
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
                    return parseInt(a.mois) > parseInt(b.mois) ? -1 :
                            (parseInt(a.mois) < parseInt(b.mois) ? 1 :
                             (parseInt(a.jour) > parseInt(b.jour) ? -1 : 1));
                });

                //console.log(liste_sessions);

                // on crée les éléments de liste des sessions 
                for(var i=0; i<liste_sessions.length; i++){

                    if(jQuery.inArray(liste_sessions[i].titre, locale_sessions) == -1 ){

                        $("#liste_sessions").append(
                            $("<li />")
                            .append(
                                $("<a/>")
                                .attr('href','#session_detail')
                                .data('transition','slide')
                                .data('date',liste_sessions[i].date)
                                .data('jour',liste_sessions[i].jour)
                                .text(liste_sessions[i].titre)
                                .append(
                                    $("<img/>")
                                    .attr('width',16)
                                    .attr('height',16)
                                    .addClass('ui-li-icon')
                                    .attr('src','images/vert@2x.png')
                                )
                            )
                            .data('date',liste_sessions[i].jour+' '+mois[(parseInt(liste_sessions[i].mois)-1)])
                            .data('id_session',liste_sessions[i].id)
                        );
                    }   
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

                    id_session = $(this).data('id_session');
                    //refreshSessionDetail();
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
            console.log('echec');
            $('.connected').css('display','none');
            $('.not_connected').css('display','block');
           // navigator.notification.alert('mince');
        }
    });
}

/**
 * [refreshSessionDetail description]
 * @return {[type]} [description]
 */
function refreshSessionDetail(){
    $('#titre_session').text('');
    $('#date_session').text('');
    $('#horaire_session').text('');
    $('#amphi_interne').text('');
    $('#amphi_externe').text('');
    $('#retransmission_interne').text('');
    $('#retransmission_externe').text('');

    $('#save_session_button').data('filename','');

    $('#save_session_button').css('display','none');

    $('.not_loggued').css('display','none');
    console.log(id_session);

    $.ajax({
        url:'http://www.sciencespo.fr/evenements/api/',
        type:'get',
        data:{
            session: id_session
        },
        dataType:'json',
        beforeSend: $.mobile.loading('show'),
        success:function(dataJSON){
            $.mobile.loading('hide');

            console.log('refreshSessionDetail :'+dataJSON.isAuthenticated);

            isAuthenticated = dataJSON.isAuthenticated;

            actual_session = dataJSON;

            console.log("DETAIL DE SESSION");
            console.log(actual_session);

            var ladate = actual_session.session.date_debut.split('-');

            $('#titre_session').text(actual_session.session.titre);
            $('#date_session').text(ladate[2]+' '+mois[parseInt(ladate[1])-1]+' '+ladate[0]);
            $('#horaire_session').text(actual_session.session.horaire_debut);
            $('#amphi_interne').text(actual_session.session.places_internes_prises+"/"+actual_session.session.places_internes_totales);
            $('#amphi_externe').text(actual_session.session.places_externes_prises+"/"+actual_session.session.places_externes_totales);
            $('#retransmission_interne').text(actual_session.session.places_internes_prises_visio+"/"+actual_session.session.places_internes_totales_visio);
            $('#retransmission_externe').text(actual_session.session.places_externes_prises_visio+"/"+actual_session.session.places_externes_totales_visio);

            actual_session.lieu              = (actual_session.lieu != null && actual_session.lieu!= undefined) ? actual_session.lieu : '';
            actual_session.nom_adresse       = (actual_session.nom_adresse != null && actual_session.nom_adresse!= undefined) ? actual_session.nom_adresse : '';
            actual_session.code_batiment_nom = (actual_session.code_batiment_nom != null && actual_session.code_batiment_nom != undefined) ? actual_session.code_batiment_nom : '';
            $('#lieu').html(actual_session.lieu+" "+actual_session.session.nom_adresse+" "+"<br/>"+actual_session.session.adresse);
            console.log('NOM DU BATIMENT : '+actual_session.session.code_batiment_nom);

            $('#save_session_button').data('filename', escape(actual_session.session.titre)+'.txt');

            $('#save_session_button').click(function(e){
                filename = $('#save_session_button').data('filename');
                //actual_session
                //test={'super':'Ça fonctionne !'}
                filecontent = JSON.stringify(actual_session);
                console.log('on sauve la session ' + filename);
                //console.log(filecontent);

                doSaveFile();
            });
            //places_enregistrees: "0"
            //places_enregistrees_visio: "0"
            //statut_inscription: "0"
            //statut_visio: "0"            

            if( dataJSON.isAuthenticated == false ){
                $('.not_loggued').css('display','none');   
            }else{
                $('.not_loggued').css('display','block'); 
            }

            if((parseInt(actual_session.session.places_internes_prises) <= 0 && parseInt(actual_session.session.places_externes_prises) <= 0 && parseInt(actual_session.session.places_internes_prises_visio)<= 0 && parseInt(actual_session.session.places_externes_prises_visio) <= 0) || dataJSON.isAuthenticated == false){
                $('#bouton_liste_inscrits').css('display','none');
            }else{
                $('#bouton_liste_inscrits').css('display','block');
            }

            $('.connected').css('display','block');
            $('.not_connected').css('display','none');
        },
        error:function(w,t,f){
            console.log(w+' '+t+' '+f);

            $('.connected').css('display','none');
            $('.not_connected').css('display','block');
        }
    });
}



// LISTE DES INSCRITS
$( document ).on( "pagebeforeshow", "#page_inscrits", function( event ) {
    console.log("LISTING INSCRITS");
    console.log('authentifié ? '+isAuthenticated);

    $("#listing_inscrits").empty();

    var temp = Array();

    $.each(actual_session.liste_inscrits, function(api_id_inscrit) {
        temp.push({
            texte : actual_session.liste_inscrits[api_id_inscrit].nom.toUpperCase()+" "+actual_session.liste_inscrits[api_id_inscrit].prenom.capitalize(),
            id : actual_session.liste_inscrits[api_id_inscrit].id
        });
    });

    temp.sort(function(a,b){
        return a.texte.toLowerCase() < b.texte.toLowerCase() ? -1 : 1;
    });
    
    $.each(temp, function(api_id_inscrit) {
        $("#listing_inscrits").append(
            $("<li/>")
            .append(
                $('<a/>')
                .attr('href','#detail_inscrit')
                .data('transition','slide')
                .text(temp[api_id_inscrit].texte)
            )
            .data('lettre',temp[api_id_inscrit].texte.substr(0,1).toUpperCase())
            .data('id', temp[api_id_inscrit].id )  
        );
    });

    $("#listing_inscrits")
    .listview({
        autodividers: true,
        autodividersSelector: function (li) {
            var out = li.data("lettre");
            return out;
        }
    })
    .listview('refresh');


    $('#listing_inscrits li')
    .bind('click', function() {
        id_inscrit = $(this).data('id');
        //refreshInscritDetail();
        //
        console.log($(this).data('id')+ ' ' + id_inscrit);
    });

    $('#scan-button')
    .unbind('click')
    .click(function(e){
        console.log('SCAN');
        //http://docs.phonegap.com/en/2.2.0/cordova_notification_notification.md.html
        
        cordova.plugins.barcodeScanner.scan(scannerSuccess,scannerFailure);
    });
} );



// DETAIL D'UNE SESSION
$( document ).on( "pagebeforeshow", "#detail_inscrit", function( event ) {
    console.log("DÉTAIL INSCRIT");
    console.log('authentifié ? '+isAuthenticated);

    refreshInscritDetail(); 
} );



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
    
    var message = 'Le billet scanné n’existe pas';
    var isOK = false;

    $.each(actual_session.liste_inscrits, function(api_id_inscrit) {
        if( actual_session.liste_inscrits[api_id_inscrit].unique_id == result.text){

            if(actual_session.liste_inscrits[api_id_inscrit].est_venu == 0){
                message = "Bienvenue "+actual_session.liste_inscrits[api_id_inscrit].prenom+" "+actual_session.liste_inscrits[api_id_inscrit].nom.toUpperCase();
                actual_session.liste_inscrits[api_id_inscrit].est_venu = 1;
                isOK = true;
            }else{
                message = "Ce billet a déjà été scanné";
            }

            return false;
        }
    });

    if(isOK){
        navigator.notification.confirm(
            message,            // message
            onScanConfirm,              // callback to invoke with index of button pressed
            'Entrée valide',            // title
            Array('Abandonner','Scanner')          // buttonLabels
        );
    }else{
         navigator.notification.alert(
            message,  // message
            false,         // callback
            'Erreur',            // title
            'Ok'                  // buttonName
        );
    }   
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


/**
 * [capitalize description]
 * @return {[type]} [description]
 */
String.prototype.capitalize = function() {

    var pieces = this.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].slice(1);
    }
    return pieces.join(" ");
}



/**
 * [date2mysql description]
 * cf http://jsfiddle.net/73vVD/
 * @return {[type]} [description]
 */
Date.prototype.date2mysql = function(){
    annee   = this.getFullYear();
    mois    = this.getMonth() + 1 <10 ? "0"+(this.getMonth() + 1): this.getMonth() + 1;
    jour    = this.getDate() <10      ? "0"+this.getDate()       : this.getDate();
    heure   = this.getHours()<10      ? "0"+this.getHours()      : this.getHours();
    minute  = this.getMinutes()<10    ? "0"+this.getMinutes()    : this.getMinutes();
    seconde = this.getSeconds()<10    ? "0"+this.getSeconds()    : this.getSeconds();

    return annee+"-"+mois+"-"+jour+" "+heure+":"+minute+":"+seconde;
}

