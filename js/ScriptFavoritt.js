var toalettArray = [];
var lekeplassArray = [];
var markersArray = [];

function distanse(a,b){ //funksjon for å kalkulere distanse basert på koordinater
  var xa = a.lat;
  var ya = a.lng;
  var xb =b.lat;
  var yb = b.lng;

  return Math.abs(Math.sqrt(Math.pow(xa-xb,2)+Math.pow(ya-yb,2))); //kvadratroten av (lendegradA minus lengdegradB i andre, pluss, breddgredA minus breddegradB i andre.
}

function initMap(locations) {/*Kart med parameter locations */
  var bounds = new google.maps.LatLngBounds();
  var bergen = {lat: 60.393081, lng: 5.324215};/*koordinatene til Bergen*/
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: bergen
  });
  if(locations){
  for (var i = 0; i < markersArray.length; i++ ) {/*iterer gjennom og fjerner gamle markører*/
      markersArray[i].setMap(null);
    }
    markersArray = locations.map(function(location, i) { /**markører*/
    bounds.extend(location);
      return new google.maps.Marker({ /*Lager markører og legger til i array*/
        position: location,
          label: (i+1)+"",
            map: map
      });

    });

    map.fitBounds(bounds);
  }
}

function readLekeplasser(data){
  data = JSON.parse(data);
  for (var i in data.entries){ //itererer gjennom datasettet
    var lekeplass={
      lat:parseFloat(data.entries[i].latitude),
      lng:parseFloat(data.entries[i].longitude),
      navn: data.entries[i].navn
    };
    lekeplassArray.push(lekeplass);//Legger til data til array
  }

    loadData("https://hotell.difi.no/api/json/bergen/dokart", readToaletter); //Neste funksjon
    loadList(lekeplassArray);//Neste funksjon
}

function readToaletter(data) {
  data = JSON.parse(data);//parser JSON-objekt til JS-objekt
  for (var i in data.entries){ //iterer gjennom hvert element i arrayet entries
    var l={//nytt objekt

      lat:parseFloat(data.entries[i].latitude),//parseFloat for å gjøre string til float
      lng:parseFloat(data.entries[i].longitude),
      address: data.entries[i].adresse,//legger til adresse
      navn: data.entries[i].plassering
    };
    toalettArray.push(l);//Legger til hvert av de nye objektne i arrayet

  }

}

function initApp(){ //funksjon for å sette i gang programmet
  loadData("https://hotell.difi.no/api/json/bergen/lekeplasser", readLekeplasser); //sender parametrene til loadData
  initMap();//initierer initMap
}

function loadData(url, callback){//Henter data fra url og funksjon
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url);
  xhttp.onreadystatechange = function() {//Det som skal gjøres etter at status er endret
    if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText); //callback
    }
  };
  xhttp.send();
}

function loadList(lekeplass){ //funksjon for å putte data inn i html-dropdown-liste
  document.getElementById("favoritt").innerHTML = "";//tømmer tabell
  for(var i in lekeplass){//for hvert element i arrayet lekeplass
    var optionRow = document.createElement("OPTION"); //Lage et optionRow
    var attribute = document.createAttribute("value");
    attribute.value = i;
    optionRow.setAttributeNode(attribute);
    var optionValue = document.createTextNode(lekeplass[i].navn);
    optionRow.appendChild(optionValue);//setter textnode
    document.getElementById("favoritt").appendChild(optionRow);//setter option inn i select
  }
}

function sortFavoritt(lekeplass){//Funksjon for å finne nærmeste toalett etter valgt lekeplass
  var forrigeKorteDistanse = false;
  var naermesteToalett = false;

  for (var i in toalettArray){ //itererer gjennom toalettArray
    var distanseToalett = distanse(lekeplassArray[lekeplass], toalettArray[i]);
      if( distanseToalett <= forrigeKorteDistanse || forrigeKorteDistanse == false){ //hvis distanse er kortere eller like forrgie kotre distanse, eller er flase
        forrigeKorteDistanse = distanseToalett; //Tildel nye verdier
        naermesteToalett =  toalettArray[i]; //tildel nye verdier
      }
  }
  var favorittArray = [];
  favorittArray.push(lekeplassArray[lekeplass]);//setter inn lekeplass i array
  favorittArray.push(naermesteToalett);//setter inn nærmeset toalett i array

  initMap(favorittArray); //neste funksjon
  loadTable(favorittArray); //neste funksjon
}

function loadTable(favoritt){ //funksjon for å putte data inn i html-tabell
  document.getElementById("tabell").innerHTML = "";//tømmer tabell
  for(var i in favoritt){//for hvert element i arrayet favoritt
    var tableRow = document.createElement("TR"); //Lage et tr

    var tdLabel = document.createElement("TD");//lage et td
    var tableLabel = document.createTextNode(i*1+1); //lage textnode med label
    tdLabel.appendChild(tableLabel);//setter textnode inn i td

    var tdType = document.createElement("TD");//lage et td
    var tableType = document.createTextNode(i==0?' Lekeplass:':' Toalett:'); //*lage textnode med type
    tdType.appendChild(tableType);//setter textnode inn i td

    var tdAddress = document.createElement("TD");//lage et td
    var tableAddress = document.createTextNode(favoritt[i].navn);//*lage textnde med navn
    tdAddress.appendChild(tableAddress);//setter textnode inn i td

    tableRow.appendChild(tdLabel);//setter td inn i tr
    tableRow.appendChild(tdType);//sette td inn i tr
    tableRow.appendChild(tdAddress);//setter td inn i tr

    document.getElementById("tabell").appendChild(tableRow);//setter tr inn i tabell med id "tabel"
  }
}
