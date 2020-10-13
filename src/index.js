
import "../scss/main.scss";

const api = 'https://pokeapi.co/api/v2/';
const app = document.getElementById("app");
// pokemon?limit=100&offset=0


function setStorage(key, data) {
  localStorage.setItem(key, data);
}

function getStorage(key) {
  return localStorage.getItem(key);
}

function removeStorage(key) {
  localStorage.removeItem(key);
}

function requestData(endpoint) {
  let pokedata = getStorage(endpoint) ? JSON.parse(getStorage(endpoint)) : false
  if( !pokedata ) {
    fetch(endpoint).then(
      response => response.json()
    ).then(
      data => {
        setStorage(endpoint, JSON.stringify(data) );
        pokedata = data;
      }
    );
  }
  return pokedata;
}

function viewPokedex() {
  console.log('init');
  let pokedexlist = api + 'pokemon?limit=100&offset=0';
  let pokedex = JSON.parse(getStorage(pokedexlist));
  
  if( !pokedex ) {
    fetch(pokedexlist).then(
      response => response.json()
    ).then(
      data => {
        setStorage(pokedexlist, JSON.stringify(data) );
        createPokedex(data);
      }
    );
  } else {
    createPokedex(pokedex);
  }
  
}

function viewPokemon(e) {
  let pokeurl = this.getAttribute("data-url");
  // requestData(pokeurl);
  let thisMon = JSON.parse(getStorage(pokeurl));
  if(!thisMon) {
    fetch(pokeurl).then(
      response => response.json()
    ).then(
      data => {
        setStorage(pokeurl, JSON.stringify(data) );
        createPokeScreen(data);
      }
    );
  } else {
    createPokeScreen(thisMon);
  }
  
}

function createPokedex(pokedex) {  
  app.innerHTML = '<div class="screen" id="pokedex-screen"></div>';
  const pokedexScreen = document.getElementById("pokedex-screen");  

  let pokelist = '';
  pokedex.results.forEach((mon,i) => {
    pokelist = pokelist + `
    <div class="view-mon" data-url="${mon.url}">
      <span>${i + 1}</span>
      <h3>${mon.name}</h3>
    </div>
    `
  });

  pokedexScreen.innerHTML = pokelist;

  var viewbuttons = pokedexScreen.querySelectorAll('.view-mon');
  for(let c = 0; c < viewbuttons.length; c++) {
    viewbuttons[c].addEventListener('click', viewPokemon, false);
  }

}

function createPokeScreen(data) {
  console.log('init PokeScreen');
  const previousScreen = document.getElementById("pokemon-screen");
  if(previousScreen) previousScreen.remove();
  app.insertAdjacentHTML("beforeend", '<div class="screen active" id="pokemon-screen"></div>');

  const screen = `
  
    <img src="${data.sprites.front_default}" />
    <h2>${data.name}</h2>

  `
  const currentScreen = document.getElementById("pokemon-screen");
  currentScreen.innerHTML = screen;
}

viewPokedex()
