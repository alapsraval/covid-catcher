//define variables//
let searchForm = document.querySelector('#search-form');
let filterButton = document.querySelector('#filter-button');
let searchBar = document.querySelector('#search-bar');
let filterOptions = document.querySelector('#filter-options');
let resultsLeft = document.querySelector('#results-left');
let requestUrl = "https://api.covidactnow.org/v2/states.json?apiKey=e1c94a248b014cfdb6c6d715ed157e4e";



function getApi(requestUrl) {
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        resultsLeft.textContent = '';
        console.log(data); 
        printResults(data);
      });
  };

  getApi(requestUrl);

function printResults(data){

    data.forEach((state, index) => {
        let row = resultsLeft.insertRow(index);
        let cell1 = row.insertCell(0);
        cell1.innerHTML = `${state.state} `;
        let cell2 = row.insertCell(1);
        cell2.innerHTML = `${state.actuals.cases} `;
     })

    //   resultsLeft.textContent += `${data} `;
};
//create functions to call an api//
//create 4 event listeners//
//function to display results//
//add a heat/bubble map//
//initial screen commit will display state's stats//
//modal for alerts//
//use local storage to store last selected filter//
//reset button//




