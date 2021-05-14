//define variables//
let searchForm = document.querySelector("#search-form");
let filterButton = document.querySelector("#filter-button");
let searchBar = document.querySelector("#search-bar");
let filterOptions = document.querySelector("#filter-options");
let resultsLeft = document.querySelector("#results-left");
let baseURL = "https://api.covidactnow.org/v2/";
let apiKey = "e1c94a248b014cfdb6c6d715ed157e4e";
let selectedFilter = localStorage.getItem("filterOption") || "states";
let filteredKeyword = "";
let defaultUrl = createURL(selectedFilter);
let resetButton = document.querySelector("#reset-button");

function init() {
  selectedFilter = localStorage.getItem("filterOption") || "states";
  $("#filter-options").val(selectedFilter);
  getApi(defaultUrl);
}

function resetForm() {
  searchForm.reset();
  localStorage.clear();
  init();
}

//create functions to call an api//
function getApi(Url) {
  fetch(Url)
    .then((response) => response.json())
    .then((data) => {
      resultsLeft.textContent = "";
      changeStatesData(data);

      if (filteredKeyword) {
        filteredKeyword = abbrState(filteredKeyword, "abbr");
        let filteredData = data.find((o) => o.state === filteredKeyword);
        if (selectedFilter === "counties") {
          filteredKeyword = searchBar.value
          filteredData = data.find((o) => o.county === filteredKeyword);
        } else if (selectedFilter === "cbsas") {
          filteredKeyword = searchBar.value;
          // filteredKeyword = abbrMetro(filteredKeyword);
          filteredData = data.find((o) => o.fips == filteredKeyword);
        }
        printResults([filteredData]);
      } else {
        printResults(data);
      }
    });
}

function changeStatesData(data) {
  console.log(data);
  let cases = [];
  data.forEach(caseData => {
    let caseObj = {
      "name": abbrState(caseData.state, "name"),
      "cases": caseData.actuals.newCases
    }
    cases.push(caseObj);
  })

  statesData.features.map(state => {
    const matchIndex = cases.findIndex(y => y.name === state.properties.name);
    if (matchIndex > -1) {
      state.properties.density = cases[matchIndex].cases;
    }
    // cases.forEach(caseData => {
    //   console.log(caseData.name);
    // })
    //console.log(state.properties);
  })
  console.log(statesData);
  return;
}

// reference: https://gist.github.com/calebgrove/c285a9510948b633aa47
function abbrState(input, to = 'abbr') {
  if (to == 'abbr') {
    input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    for (i = 0; i < states.length; i++) {
      if (states[i][0] == input) {
        return (states[i][1]);
      }
    }
  } else if (to == 'name') {
    input = input.toUpperCase();
    for (i = 0; i < states.length; i++) {
      if (states[i][1] == input) {
        return (states[i][0]);
      }
    }
  }
};

function abbrMetro(input) {
  input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  for (i = 0; i < metros.length; i++) {
    if (metros[i][0] == input) {
      return (metros[i][1]);
    }
  }
};

getApi(defaultUrl);

//function to display results//
function printResults(data) {
  if (selectedFilter == "states") {
    data.forEach((state, index) => {
      // let row = resultsLeft.insertRow(index);
      // let cell1 = row.insertCell(0);
      // cell1.innerHTML = `${state.state} `;
      // let cell2 = row.insertCell(1);
      // cell2.innerHTML = `${state.actuals.newCases} `;

      let accordianList = document.createElement("li");
      let liContent = `<a class="uk-accordion-title uk-text-lead uk-text-left" href="#">${abbrState(state.state, "name")} <span
                            class="uk-badge uk-background-muted uk-text-secondary" style="background-color: ${getColor(state.actuals.newCases)}">${state.actuals.newCases}</span></a>

                    <article class="uk-comment uk-comment-primary uk-accordion-content">
                        <header class="uk-comment-header">
                            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-expand uk-padding-remove-left">
                                    
                                    <ul class="uk-comment-primary uk-subnav uk-subnav-divider uk-margin-remove-top uk-margin-remove-left">
                                        <li class=""><span>Total Cases <span class="uk-text-emphasis">${state.actuals.cases}</span></span></li>
                                        <li class=""><span>New Cases <span class="uk-text-emphasis	">${state.actuals.newCases}</span></span> </li>
                                        <li class=""><span>Deaths <span class="uk-text-emphasis">${state.actuals.deaths}</span></span> </li>
                                        <li class=""><span>Population <span class="uk-text-emphasis">${state.population}</span></span> </li>

                                    </ul>
                                </div>
                            </div>
                        </header>
                        <div class="uk-comment-body">  
                            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-expand">
                                    <table class="uk-table uk-table-small uk-table-divider">
                                        <tbody>
                                            <tr>
                                                <td>Case Density</td>
                                                <td class="uk-width-small">${state.metrics.caseDensity}</td>
                                            </tr>
                                            <tr>
                                                <td>Infection Rate</td>
                                                <td class="uk-width-small">${state.metrics.infectionRate}</td>
                                            </tr>       
                                        </tbody>
                                    </table>
                                </div>
                                <div class="uk-width-expand">
                                    <table class="uk-table uk-table-small uk-table-divider">
                                        <tbody>
                                            <tr>
                                                <td>Case Density Risk Level</td>
                                                <td class="uk-width-small">${state.riskLevels.caseDensity}</td>
                                            </tr>
                                            <tr>
                                                <td>Overall Risk Level</td>
                                                <td class="uk-width-small">${state.riskLevels.overall}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="uk-text-meta uk-margin-top uk-margin-small-left"><a href="${state.url}" target="_blank">${state.url}</a></div>
                        <div class="uk-text-meta uk-margin-top uk-margin-small-left">Updated on ${new Date(state.lastUpdatedDate).toLocaleDateString()}</div>
                    </article>`;
      accordianList.innerHTML = liContent;
      resultsLeft.appendChild(accordianList);
    });

    geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap);
  } else if (selectedFilter == "counties") {
    data.forEach((county, index) => {
      let row = resultsLeft.insertRow(index);
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `${county.county} `;
      let cell2 = row.insertCell(1);
      cell2.innerHTML = `${county.actuals.newCases} `;
    });
  }
  else if (selectedFilter == "cbsas") {
    data.forEach((cbsa, index) => {
      let row = resultsLeft.insertRow(index);
      let cell1 = row.insertCell(0);
      let fips = abbrMetro(cbsa.fips);
      cell1.innerHTML = `${fips} `;
      let cell2 = row.insertCell(1);
      cell2.innerHTML = `${cbsa.actuals.newCases} `;
    });
  }
};

// function for parameters
function createURL(filter) {
  return `${baseURL}${filter}.json?apiKey=${apiKey}`;
}

function filterCat() {
  // call the API to get the results
  let newUrl = createURL(selectedFilter);
  getApi(newUrl);
  // print results (need to call it)
}

//event listeners

//event listner for filter dropdown
filterOptions.addEventListener("change", function () {
  // get the selected option from the UI for the three catergories
  selectedFilter = filterOptions.value;

  localStorage.setItem("filterOption", filterOptions.value)
});

//event listener for search button
filterButton.addEventListener("click", function () {
  filterCat();
  filteredKeyword = searchBar.value;

  if (!filteredKeyword) { UIkit.modal("#modal-error").show(); }
});

resetButton.addEventListener("click", resetForm);


init();

//todo
//reset button//
//create alert for mumbo jumbo//