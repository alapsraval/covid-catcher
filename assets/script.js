//define variables//
let searchForm = document.querySelector("#search-form");
let filterOptions = document.querySelector("#filter-options");
let searchBar = document.querySelector("#search-bar");
let filterButton = document.querySelector("#filter-button");
let resetButton = document.querySelector("#reset-button");
let resultContainer = document.querySelector("#result-container");
let resultHeading = document.querySelector("#result-heading");
let mapContainer = document.querySelector("#covid-map");

let apiKey = "e1c94a248b014cfdb6c6d715ed157e4e";
let baseURL = "https://api.covidactnow.org/v2/";
let apiUrl = "";
let selectedFilter = "";

let spinner = document.getElementById("spinner");

let modalTitle = document.querySelector(".uk-modal-title");
let modalMessage = document.querySelector(".uk-modal-message");

//localStorage.setItem("filterOption", "cbsas");

//search functions

//create functions to call an api//
function getApiResponse(selectedFilter, searchKeyword) {
  apiUrl = createURL(selectedFilter);
  showSpinner();
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      resultContainer.textContent = "";
      let filteredCovidData;
      //replace state abbr with names
      data = data.map(x => {
        x.state = x.state ? abbrState(x.state) : abbrMetro(x.fips);
        x.lastUpdatedDate = new Date(x.lastUpdatedDate).toLocaleDateString();
        x.metrics.caseDensity = x.metrics.caseDensity ? x.metrics.caseDensity.toFixed(2) : "N/A";
        x.metrics.infectionRate = x.metrics.infectionRate ? x.metrics.infectionRate.toFixed(2) : "N/A";
        x.color = getColor(x.actuals.newCases);
        return x;
      });
      selectedFilter === "states" ? showMap(data) : mapContainer.classList.add("uk-hidden");
      filteredCovidData = filterData(data, selectedFilter, searchKeyword);

      let searchHeadingText = updateSearchHeadingText(selectedFilter, searchKeyword);

      if (!filteredCovidData) {
        if (searchKeyword) {
          showErrorModal('Error', 'No matching record was found. Please try another keyword.');
          searchHeadingText = updateSearchHeadingText(selectedFilter, '');
        }
        resultHeading.innerText = searchHeadingText;
        data.forEach((value, index) => {
          printResults(value);
        });
      } else {
        resultHeading.innerText = searchHeadingText;
        //data.forEach((value, index) => {
        printResults(filteredCovidData);
        //});
      }
      hideSpinner();
    })
    .catch((error) => {
      hideSpinner();
      showErrorModal('Error', error);
    });
}

function filterData(data, category, keyword) {
  keyword = keyword.toLowerCase();
  if (!keyword) return;
  if (category === "states") {
    return data.find((o) => o.state.toLowerCase() === keyword);
  } else if (category === "counties") {
    return data.find((o) => o.county.toLowerCase() === keyword);
  } else if (category === "cbsas") {
    return data.find((o) => o.fips.toLowerCase() === keyword);
  }
}

//function to display results//
function printResults(data) {
  // let row = resultContainer.insertRow(index);
  // let cell1 = row.insertCell(0);
  // cell1.innerHTML = `${state.state} `;
  // let cell2 = row.insertCell(1);
  // cell2.innerHTML = `${state.actuals.newCases} `;

  let accordianList = document.createElement("li");
  let liContent = `<a class="uk-accordion-title uk-text-lead uk-text-left" href="#">${data.state || ""} ${data.county ? "-" : ""} ${data.county || ""} <span
                            class="uk-badge uk-background-muted uk-text-secondary" style="background-color: ${data.color}">${data.actuals.newCases}</span></a>

                    <article class="uk-comment uk-comment-primary uk-accordion-content">
                        <header class="uk-comment-header">
                            <div class="uk-grid-medium uk-flex-middle uk-grid" uk-grid>
                                <div class="uk-width-expand uk-padding-remove-left">
                                    
                                    <ul class="uk-comment-primary uk-subnav uk-subnav-divider uk-margin-remove-top uk-margin-remove-left">
                                        <li class=""><span>Total Cases <span class="uk-text-emphasis">${data.actuals.cases}</span></span></li>
                                        <li class=""><span>New Cases <span class="uk-text-emphasis	">${data.actuals.newCases}</span></span> </li>
                                        <li class=""><span>Deaths <span class="uk-text-emphasis">${data.actuals.deaths}</span></span> </li>
                                        <li class=""><span>Population <span class="uk-text-emphasis">${data.population}</span></span> </li>

                                    </ul>
                                </div>
                            </div>
                        </header>
                        <div class="uk-comment-body">  
                            <div class="uk-grid-medium uk-flex-middle uk-grid" uk-grid>
                                <div class="uk-width-expand@m">
                                    <table class="uk-table uk-table-responsive uk-table-small">
                                        <tbody>
                                            <tr>
                                                <td>Case Density</td>
                                                <td class="uk-width-small">${data.metrics.caseDensity}</td>
                                            </tr>
                                            <tr>
                                                <td>Infection Rate</td>
                                                <td class="uk-width-small">${data.metrics.infectionRate}</td>
                                            </tr>       
                                        </tbody>
                                    </table>
                                </div>
                                <div class="uk-width-expand@m">
                                    <table class="uk-table uk-table-responsive uk-table-small">
                                        <tbody>
                                            <tr>
                                                <td>Case Density Risk Level</td>
                                                <td class="uk-width-small">${data.riskLevels.caseDensity}</td>
                                            </tr>
                                            <tr>
                                                <td>Overall Risk Level</td>
                                                <td class="uk-width-small">${data.riskLevels.overall}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="uk-text-meta uk-text-break uk-margin-top uk-margin-small-left ${!data.url ? 'uk-hidden' : ''}"><a class="uk-text-primary" href="${data.url}" target="_blank">${data.url}</a></div>
                        <div class="uk-text-meta uk-text-break uk-margin-top uk-margin-small-left">Updated on ${data.lastUpdatedDate}</div>
                    </article>`;
  accordianList.innerHTML = liContent;
  resultContainer.appendChild(accordianList);
};

function handleSearchFormSubmit() {
  let selectedFilter = filterOptions.value || "states";
  let searchKeyword = searchBar.value;
  if (!searchKeyword) { showErrorModal("Error!!", "Please enter corresponding state, county or metropolitan."); return; }
  // call the API to get the results
  getApiResponse(selectedFilter, searchKeyword);
}

//reset button function
function resetForm() {
  searchForm.reset();
  localStorage.clear();
  init();
}

function init() {
  selectedFilter = localStorage.getItem("filterOption") || "states";
  $("#filter-options").val(selectedFilter);
  getApiResponse(selectedFilter, "");
  updatePlaceHolderText(selectedFilter);
}

// show map

function showMap(statesCovidData) {
  mapContainer.classList.remove("uk-hidden");
  changeStatesData(statesCovidData);
  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap);
}

// utility functions

// function to create API URL using parameters
function createURL(filter) {
  return `${baseURL}${filter}.json?apiKey=${apiKey}`;
}

function changeStatesData(data) {
  statesData.features.map(state => {
    const matchIndex = data.findIndex(y => y.state === state.properties.name);
    if (matchIndex > -1) {
      state.properties.density = data[matchIndex].actuals.newCases;
    }
  })
  return;
}

// reference: https://gist.github.com/calebgrove/c285a9510948b633aa47

//function to convert abbr to name or vice versa
function abbrState(input, to = 'name') {
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

//function to convert abbr to name or vice versa

function abbrMetro(input, to = 'name') {
  if (to == 'fips') {
    input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    for (i = 0; i < metros.length; i++) {
      if (metros[i][1] == input) {
        return (metros[i][0]);
      }
    }
  } else if (to == 'name') {
    for (i = 0; i < metros.length; i++) {
      if (metros[i][0] == input) {
        return (metros[i][1]);
      }
    }
  }
};

function updateSearchHeadingText(category, keyword) {
  if (keyword) {
    return `Search result for ${keyword}`
  } else {
    return category === "states" ? 'All US States' :
      category === "counties" ? 'All US Counties' :
        category === "cbsas" ? 'All US Metropolitan Areas' :
          '';
  }
}

function updatePlaceHolderText(category) {
  searchBar.placeholder = category === "states" ? 'e.g. illinois' :
      category === "counties" ? 'e.g. dupage county' :
        category === "cbsas" ? 'e.g. 16980' :
          'search keyword';
}

//show spinner while fetching data
function showSpinner() {
  spinner.removeAttribute('hidden');
}

//hide spinner after fetching data
function hideSpinner() {
  spinner.setAttribute('hidden', '');
}

function showErrorModal(type = "Error", message = "Invalid input"){
  modalTitle.textContent = type;
  modalMessage.textContent = message;
  UIkit.modal("#modal-error").show();
}

//event listeners

//event listner for filter dropdown
filterOptions.addEventListener("change", function () {
  // get the selected option from the UI for the three catergories
  selectedFilter = filterOptions.value;
  updatePlaceHolderText(selectedFilter);
  localStorage.setItem("filterOption", filterOptions.value)
});

//event listener for search button
filterButton.addEventListener("click", handleSearchFormSubmit);
resetButton.addEventListener("click", resetForm);

init();