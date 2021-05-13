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

function init(){
  $("#filter-options").val(selectedFilter);
}

//create functions to call an api//
function getApi(Url) {
  fetch(Url)
    .then((response) => response.json())
    .then((data) => {
      resultsLeft.textContent = "";
      console.log(data);
      if (filteredKeyword) {
        filteredKeyword = abbrState(filteredKeyword);
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

function abbrState(input) {
  input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
};

function abbrMetro(input) {
  input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < metros.length; i++){
            if(metros[i][0] == input){
                return(metros[i][1]);
            }
        }    
};

getApi(defaultUrl);

//function to display results//
function printResults(data) {
 if (selectedFilter == "states") {
     data.forEach((state, index) => {
       let row = resultsLeft.insertRow(index);
       let cell1 = row.insertCell(0);
       cell1.innerHTML = `${state.state} `;
       let cell2 = row.insertCell(1);
       cell2.innerHTML = `${state.actuals.newCases} `;
     });
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
  
  if(!filteredKeyword){UIkit.modal("#modal-error").show();}
});

init();

//todo
//reset button//
//create alert for mumbo jumbo//