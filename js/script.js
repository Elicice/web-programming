var googleMapsLocations=[];/*Tomt array*/
var markersArray = [];/*Tomt array for markører*/
var lekeplassArray = [];

function initMap(locations) {/*Kart med parameter locations */
  var bergen = {lat: 60.393081, lng: 5.324215};/*koordinatene til Bergen*/
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: bergen
  });

  for (var i = 0; i < markersArray.length; i++ ) {/*iterer gjennom og fjerner gamle markører*/
      markersArray[i].setMap(null);
    }
    markersArray = locations.map(function(location, i) { /**markører*/
      return new google.maps.Marker({ /*Mager markører og legger til i array*/
        position: location,
          label: (i+1)+"",
            map: map
      });
    });
      }
console.log("tekst");

function initApp(){
  loadData(window.dataUrl);
}

function loadData(url){/*Henter data fra url*/
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url);
  xhttp.onreadystatechange = function() {/*Det som skal gjøres etter at status er endret*/
    if (this.readyState == 4 && this.status == 200) {
      if(window.page == "toalett"){
        readToaletter(this.responseText);
      }
      else
      {
        readLekeplass(this.responseText);
      }
    }
    else
    {
      return null;
    }
  };
  xhttp.send();
}

function readToaletter(data){/*Parser data og muliggjør bruk av data i andre funksjoner*/
  data = JSON.parse(data);/*parser JSON-objekt til JS-objekt*/
  for (var i in data.entries){ /*iterer gjennom hvert element i arrayet entries*/
    var l={/*nytt objekt*/

      lat:parseFloat(data.entries[i].latitude),/*parseFloat for å gjøre string til float*/
      lng:parseFloat(data.entries[i].longitude),
      address: data.entries[i].adresse,/*legger til adresse*/
      place: data.entries[i].place,
      navn: data.entries[i].plassering,
      mann: data.entries[i].herre,
      dame: data.entries[i].dame,
      stellerom: data.entries[i].stellerom,
      rullestol: data.entries[i].rullestol,
      barePissoar: data.entries[i].pissoir_only,
      tidHverdag: data.entries[i].tid_hverdag,
      tidLordag: data.entries[i].tid_lordag,
      tidSondag: data.entries[i].tid_sondag,
      pris: parseInt(data.entries[i].pris)/*parser slik at det blir tall, ikke streng*/

    };
    googleMapsLocations.push(l);/*Legger til hvert av de nye objektne i arrayet*/

  }

  initMap(googleMapsLocations); /*Neste funksjon*/
  loadTable(googleMapsLocations);/*Neste funksjon*/
}

function loadTable(locations){ /*funksjon for å putte data inn i html-tabell*/
  document.getElementById("tabell").innerHTML = "";/*tømmer tabell*/
  for(var i in locations){/*for hvert element i arrayet locations*/
    var tableRow = document.createElement("TR"); /*Lage et tr*/

    var tdLabel = document.createElement("TD");/*lage et td*/
    var tableLabel = document.createTextNode(i*1+1); /*lage textnode ed label*/
    tdLabel.appendChild(tableLabel);/*setter textnode inn i td*/

    var tdAddress = document.createElement("TD");/*lage et td*/
    var tableAddress = document.createTextNode(locations[i].navn);/*lage textnde med adresse*/

    tdAddress.appendChild(tableAddress);/*setter textnode inn i td*/

    tableRow.appendChild(tdLabel);/*setter td inn i tr*/
    tableRow.appendChild(tdAddress);/*setter td inn i tr*/

    document.getElementById("tabell").appendChild(tableRow);/*setter tr inn i tabell med id "toalettTabel"*/
  }

}

function readSearchAvansert(){ /*funskjon for å lese inn søkeresultatene i avansert søk*/
  var avansertToalett={/*nytt objekt med standard verdier*/
    fritekst:"",
    gender: "annet",
    rullestol: false,
    stellerom: false,
    openNow: false,
    open: null,
    prisGratis: false,
    makspris:null
  };
  /*hvis søkekriteriet er merket av så vil verdi bli satt*/
  avansertToalett.fritekst=document.getElementById("avansertsok_fritekst").value;

  if(document.getElementById("radio_dame").checked){
    avansertToalett.gender="dame";
  }
  if(document.getElementById("radio_mann").checked){
    avansertToalett.gender="mann";
  }
  if(document.getElementById("rullestol").checked){
    avansertToalett.rullestol=true;
  }
  if(document.getElementById("stellerom").checked){
    avansertToalett.stellerom=true;
  }
  if(document.getElementById("open_now").checked){
    avansertToalett.openNow=true;
  }
  avansertToalett.open=document.getElementById("open_time").value;

  if(document.getElementById("pris_gratis").checked){
    avansertToalett.prisGratis=true;
  }
  avansertToalett.makspris=document.getElementById("pris_maks").value;
  filterSearch(avansertToalett);/*Neste funksjon*/
}

function filterSearch(searchToalett){/*funksjon for å filtrere søkeresultatet*/
  var locations = googleMapsLocations;/*nytt array*/
    if (searchToalett.fritekst && searchToalett.fritekst.length>0) locations = /*case insensitive fritekstsøk*/
        locations.filter(location => location.navn.match(new RegExp(searchToalett.fritekst,"i")) ||
        location.address.match(new RegExp(searchToalett.fritekst,"i")) ||
        location.place.match(new RegExp(searchToalett.fritekst,"i")));
    if (searchToalett.gender=="dame") locations = locations.filter(location => location.dame=="1");
    if (searchToalett.gender=="mann") locations = locations.filter(location => location.mann=="1" || location.barePissoar=="1");
    if (searchToalett.rullestol) locations = locations.filter(location => location.rullestol=="1");
    if (searchToalett.stellerom) locations = locations.filter(location => location.stellerom=="1");
    if(searchToalett.prisGratis)locations = locations.filter(location => location.pris==0 || !location.pris);
    if(searchToalett.makspris) locations = locations.filter(location => (location.pris<=searchToalett.makspris || !location.pris));
    if(searchToalett.open) locations = locations.filter(location => dag(location, searchToalett.open));
    if(searchToalett.openNow) locations = locations.filter(location => dag(location, new Date().toTimeString().split(" ")[0]));

  initMap(locations);
  loadTable(locations);
}

function erIApningstid(timeRange, klokkeslett){/*funksjon som skal finne ut om klokkeslett er i åpningstid*/

  if (timeRange=="NULL"){ return false;}/*hvis tidspunkt er null, så false*/
  if (timeRange=="ALL") {return true;}/*hvis tidspunkt er all, så true*/
  var apningstid = timeRange.split(" - "); /*splitter på mellomrom, bindestrek, melomrom*/
  var apner = klokkeslettTilDate(apningstid[0]); /*Når det åpner, første verdi i listen*/
  var stenger = klokkeslettTilDate(apningstid[1]);/*Når den stenger, siste verdi i listen*/
  var tidspunkt = klokkeslettTilDate(klokkeslett);/*Funksjon klokkeslettTilDate()*/
  return  (tidspunkt>=apner && tidspunkt<=stenger);/*returnerer hvis tidspunkt er innenfor åpningstid*/
}

function dag(location, klokkeslett){/*Funksjon som funner ut hvilken dag som skal brukes*/
  var dag = new Date();
  var ukedag = dag.getDay();

  if (new Date() > klokkeslettTilDate(klokkeslett)){/*hvis tidspubkt er passer, så neste dag*/
  ukedag = ukedag+1;
  }
  if(ukedag == 0 || ukedag == 7){/*ukedag 0 er søndag*/
    return erIApningstid(location.tidSondag, klokkeslett);
  }
  else if (ukedag == 6) {/*ukedag 6 er lørdag*/
    return erIApningstid(location.tidLordag, klokkeslett);
  }
  else
  {
    return erIApningstid(location.tidHverdag, klokkeslett);
  }

}

function klokkeslettTilDate(klokkeslett){/*klokkeslett og parse til dato*/
  var d = new Date();
  return new Date(d.toDateString() + " " + klokkeslett.replace(".",":"));
}
function readSearchHurtig(){/*funksjon for å lese inn søkeresultatene fra hurtigsøk*/
  var hurtigToalett={/*nytt objekt med standard verdier*/
    fritekst:"",
    gender: "annet",
    rullestol: false,
    stellerom: false,
    openNow: false,
    open: null,
    prisGratis: false,
    makspris:null
  };
  var query = document.getElementById("hurtigsok").value; /*Ny variabel forespørsel, det som ble søkt etter*/
  var address = query.split(" ").filter(function(item){ /*splitter forespørsel inn i enheter*/
    /*spesifikke søkeord, case insensitive*/
    if(item.match(new RegExp("mann","i"))){
      hurtigToalett.gender = "mann";
    }
    else if(item.match(new RegExp("stellerom","i"))){
      hurtigToalett.stellerom = true;
    }
    else if(item.match(new RegExp("rullestol","i"))){
      hurtigToalett.rullestol = true;
    }
    else if(item.match(new RegExp("gratis","i"))){
      hurtigToalett.prisGratis = true;
    }
    else if(item.match(new RegExp("dame","i"))){
      hurtigToalett.gender = "dame";
    }
    else if(item.match(new RegExp("åpen:\\d{2}:\\d{2}", "i"))){ //må finne en måte å få verdien av klokkeslett inn her
      hurtigToalett.open =item.replace("åpen:",""); //verdien av klokkeslett
    }
    else if(item.match(new RegExp("åpen","i"))){
      hurtigToalett.openNow = true;
    }
    else if(item.match(new RegExp("pris:\\d", "i"))){ //må få inn verdien av makspris
      hurtigToalett.makspris = item.replace("pris:","");//verdi av maks pris
    }
    else
    {
      return true;
    }
  }
);
  hurtigToalett.fritekst = address.join(" ");/*fritekstsøk*/

  filterSearch(hurtigToalett);/*Neste funksjon*/
}
function helpSearch(){
  if(document.getElementById("hjelp").style.display == "none"){
    document.getElementById("hjelp").style.display="";
  }
  else{document.getElementById("hjelp").style.display="none";
  }

}

function readLekeplass(data){//Parser data og muliggjør bruk av data i andre funksjone
  data = JSON.parse(data);
  for (var i in data.entries){
    var lekeplass={
      lat:parseFloat(data.entries[i].latitude),
      lng:parseFloat(data.entries[i].longitude),
      navn:data.entries[i].navn,
      id:parseInt(data.entries[i].id)
    }
    lekeplassArray.push(lekeplass);
  }
  loadTable(lekeplassArray);
  initMap(lekeplassArray);
}
