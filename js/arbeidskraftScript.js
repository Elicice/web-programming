var arbeidskraftArray = [];
var sortKolonne = [];

function loadArbeidskraft(url){//laster data
  var xhttp = new XMLHttpRequest();
  url= "https://hotell.difi.no/api/json/nav/bedriftsundersokelse/ettersporsel-pr-yrke/2017";
  xhttp.open("GET", url);
  xhttp.onreadystatechange = function() {//Det som skal gjøres etter at staus er endret
    if (this.readyState == 4 && this.status == 200) {
      readArbeidskraft(this.responseText); //initierer readArbeidskraft hvis tilstand 4 og status OK
    }
    else
    {
      return null;
    }
  };
  xhttp.send();
}

function readArbeidskraft(data){
  data = JSON.parse(data);
  for (var i in data.entries){ //iterer gjennom hvert element i arrayet entries
    var l={//nytt objekt

      yrke: data.entries[i].yrke,
      yrkekode:parseInt(data.entries[i].yrkekode),
      aar:parseInt(data.entries[i].aar),
      norge:parseInt(data.entries[i].norge),
      hedmark:parseInt(data.entries[i].hedmark),
      vestfold:parseInt(data.entries[i].vestfold),
      rogaland:parseInt(data.entries[i].rogaland),
      akershus:parseInt(data.entries[i].akershus),
      vest_agder:parseInt(data.entries[i].vest_agder),
      finnmark:parseInt(data.entries[i].finnmark),
      nordland:parseInt(data.entries[i].nordland),
      troms:parseInt(data.entries[i].troms),
      sogn_fjordane:parseInt(data.entries[i].sogn_fjordane),
      ostfold:parseInt(data.entries[i].ostfold),
      oslo:parseInt(data.entries[i].oslo),
      oppland:parseInt(data.entries[i].oppland),
      more_og_romsdal:parseInt(data.entries[i].more_og_romsdal),
      trondelag:parseInt(data.entries[i].trondelag),
      hordaland:parseInt(data.entries[i].hordaland),
      aust_agder:parseInt(data.entries[i].aust_agder),
      buskerud:parseInt(data.entries[i].buskerud),
      telemark:parseInt(data.entries[i].telemark)
    };
    arbeidskraftArray.push(l);//Legger til hvert av de nye objektne i arrayet
  }
  loadTable(arbeidskraftArray);

var lastSortedAsc = true;
}

function sortTableAlpha(){//Funksjon for å sortere alfabetisk annehver gang synkende og annenhvergang stigende
  lastSortedAsc = !lastSortedAsc;
  arbeidskraftArray.sort(function(a, b){
    return lastSortedAsc?b.yrke.localeCompare(a.yrke):a.yrke.localeCompare(b.yrke);
    });
  loadTable(arbeidskraftArray);
}

function loadTable(arbeidskraft){ /*funksjon for å sette data inn i html-tabell*/

  document.getElementById("tabellArbeidskraft").innerHTML = "";/*tømmer tabell*/

  for(var i in arbeidskraft){
    var tableRow = document.createElement("TR"); //ny tableRow
    //lager TD-elementer og setter data inn i elementene
    var tdYrke = document.createElement("TD");
    var tableYrke = document.createTextNode(arbeidskraft[i].yrke);
    tdYrke.appendChild(tableYrke);

    var tdNorge = document.createElement("TD");
    var tableNorge = document.createTextNode(arbeidskraft[i].norge);
    tdNorge.appendChild(tableNorge);

    var tdOstfold = document.createElement("TD");
    var tableOstfold = document.createTextNode(arbeidskraft[i].ostfold);
    tdOstfold.appendChild(tableOstfold);

    var tdAkershus = document.createElement("TD");
    var tableAkershus = document.createTextNode(arbeidskraft[i].akershus);
    tdAkershus.appendChild(tableAkershus);

    var tdOslo = document.createElement("TD");
    var tableOslo = document.createTextNode(arbeidskraft[i].oslo);
    tdOslo.appendChild(tableOslo);

    var tdHedmark = document.createElement("TD");
    var tableHedmark = document.createTextNode(arbeidskraft[i].hedmark);
    tdHedmark.appendChild(tableHedmark);

    var tdOppland = document.createElement("TD");
    var tableOppland = document.createTextNode(arbeidskraft[i].oppland);
    tdOppland.appendChild(tableOppland);

    var tdBuskerud = document.createElement("TD");
    var tableBuskerud = document.createTextNode(arbeidskraft[i].buskerud);
    tdBuskerud.appendChild(tableBuskerud);

    var tdVestfold = document.createElement("TD");
    var tableVestfold = document.createTextNode(arbeidskraft[i].vestfold);
    tdVestfold.appendChild(tableVestfold);

    var tdTelemark = document.createElement("TD");
    var tableTelemark = document.createTextNode(arbeidskraft[i].telemark);
    tdTelemark.appendChild(tableTelemark);

    var tdAustAgder = document.createElement("TD");
    var tableAustAgder = document.createTextNode(arbeidskraft[i].aust_agder);
    tdAustAgder.appendChild(tableAustAgder);

    var tdVestAgder = document.createElement("TD");
    var tableVestAgder = document.createTextNode(arbeidskraft[i].vest_agder);
    tdVestAgder.appendChild(tableVestAgder);

    var tdRogaland = document.createElement("TD");
    var tableRogaland = document.createTextNode(arbeidskraft[i].rogaland);
    tdRogaland.appendChild(tableRogaland);

    var tdHordaland = document.createElement("TD");
    var tableHordaland = document.createTextNode(arbeidskraft[i].hordaland);
    tdHordaland.appendChild(tableHordaland);

    var tdSognOgFjordane = document.createElement("TD");
    var tableSognOgFjordane = document.createTextNode(arbeidskraft[i].sogn_fjordane);
    tdSognOgFjordane.appendChild(tableSognOgFjordane);

    var tdMoreOgRomsdal = document.createElement("TD");
    var tableMoreOgRomsdal = document.createTextNode(arbeidskraft[i].more_og_romsdal);
    tdMoreOgRomsdal.appendChild(tableMoreOgRomsdal);

    var tdTrondelag = document.createElement("TD");
    var tableTrondelag = document.createTextNode(arbeidskraft[i].trondelag);
    tdTrondelag.appendChild(tableTrondelag);

    var tdNordland = document.createElement("TD");
    var tableNordland = document.createTextNode(arbeidskraft[i].nordland);
    tdNordland.appendChild(tableNordland);

    var tdTroms = document.createElement("TD");
    var tableTroms = document.createTextNode(arbeidskraft[i].troms);
    tdTroms.appendChild(tableTroms);

    var tdFinnmark = document.createElement("TD");
    var tableFinnmark = document.createTextNode(arbeidskraft[i].finnmark);
    tdFinnmark.appendChild(tableFinnmark);
    //Setter data inn i radene
    tableRow.appendChild(tdYrke);
    tableRow.appendChild(tdNorge);
    tableRow.appendChild(tdOstfold);
    tableRow.appendChild(tdAkershus);
    tableRow.appendChild(tdOslo);
    tableRow.appendChild(tdHedmark);
    tableRow.appendChild(tdOppland);
    tableRow.appendChild(tdBuskerud);
    tableRow.appendChild(tdVestfold);
    tableRow.appendChild(tdTelemark);
    tableRow.appendChild(tdAustAgder);
    tableRow.appendChild(tdVestAgder);
    tableRow.appendChild(tdRogaland);
    tableRow.appendChild(tdHordaland);
    tableRow.appendChild(tdSognOgFjordane);
    tableRow.appendChild(tdMoreOgRomsdal);
    tableRow.appendChild(tdTrondelag);
    tableRow.appendChild(tdNordland);
    tableRow.appendChild(tdTroms);
    tableRow.appendChild(tdFinnmark);

    document.getElementById("tabellArbeidskraft").appendChild(tableRow);/*setter tr inn i tabell med id "toalettTabel"*/
  }

}

function setSortKolonne(th, kolonne){ //funksjon for å sortere kolonne

  for(var i in sortKolonne){ //for hvert element i arrayet sortKolonne
    if(sortKolonne[i].navn == kolonne){ //sjekker om kolonnen finnes i arrayet
      if(sortKolonne[i].direction == "asc"){//hvis den da er stigende
        sortKolonne[i].direction="desc";//Endre til synkende
        th.classList.add("sort-desc");//legg til i klassen sort-desc
      }
      else
      {
        sortKolonne.splice(i,1);//Fjerner element
        th.classList.add("no-sort");//Legger til klasse no-sort
      }
      return;
    }
  }
  th.classList.add("sort-asc");//Legg til klassen sort-asc
  sortKolonne.push({//legg til i arrayet sortKolonne
    navn: kolonne,
    direction: "asc"
  });
}

function setSort(th, kolonne){ //Funksjon for å sortere etter kolonner
//fjerne klasser
  th.classList.remove("sort-asc");
  th.classList.remove("sort-desc");
  th.classList.remove("no-sort");

  setSortKolonne(th, kolonne);//initierer setSortKolonne


  arbeidskraftArray.sort(function(a, b){
    if(sortKolonne.length == 0){ //hvis sortKolonner er 0
      return b.norge-a.norge;//returnert tall for norge synkende, som er utgangspunktet for datasettet
    }

    for(var i in sortKolonne){//for hvert element i sortKolonne
      var v
      if(sortKolonne[i].navn == "yrke"){ //sjekker om yrke
        v = sortKolonne[i].direction == "asc"?b.yrke.localeCompare(a.yrke):a.yrke.localeCompare(b.yrke); //hvis den er ascending, så sortert stigende, hvis ikke sorter etter synkende. alfabetisk
      }
      else //hvis ikke
      {
        v = sortKolonne[i].direction == "asc"?a[sortKolonne[i].navn]-b[sortKolonne[i].navn]:b[sortKolonne[i].navn]-a[sortKolonne[i].navn];//hvis ascending sorter etter stigende, hvis ikke sorter etter synkende
      }
      if(v!=0){//Hvis v ikke er 0 så returner v
        return v;
      }
    }
    return 0;
  });
  loadTable(arbeidskraftArray); //initierer loadTable
}
