
import "../scss/main.scss";

const api = 'https://pokeapi.co/api/v2/';
const app = document.getElementById("app");
const loading = document.getElementById("loading");
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
  loading.classList.add('active');
  let pokedexlist = api + 'pokemon?limit=100&offset=0';
  let pokedex = JSON.parse(getStorage(pokedexlist));
  
  if( !pokedex ) {

    fetch(pokedexlist).then(
      response => response.json()
    ).then(
      data => {
        setStorage(pokedexlist, JSON.stringify(data) );
        createPokedex(data);
        loading.classList.remove('active');
      }
    );
  } else {
    createPokedex(pokedex);
    loading.classList.remove('active');
  }
  
}

function viewPokemon(e) {
  loading.classList.add('active');
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
        loading.classList.remove('active');
      }
    );
  } else {
    createPokeScreen(thisMon);
    loading.classList.remove('active');
  }
  
}

function createPokedex(pokedex) {  
  app.innerHTML = '<div class="screen" id="pokedex-screen"></div>';
  const pokedexScreen = document.getElementById("pokedex-screen");  

  let pokelist = '';
  pokedex.results.forEach((mon,i) => {
    var pokemonNum = i + 1;
    pokelist = pokelist + `
    <div class="pokedex-list__item" data-url="${mon.url}">
      <span class="pokedex-list__number">${pokemonNum.toString().length < 2 ? '0' + pokemonNum : pokemonNum}</span>
      <h3 class="pokedex-list__title">${mon.name}</h3>
    </div>
    `
  });

  pokedexScreen.innerHTML = pokelist;

  var viewbuttons = pokedexScreen.querySelectorAll('.pokedex-list__item');
  for(let c = 0; c < viewbuttons.length; c++) {
    viewbuttons[c].addEventListener('click', viewPokemon, false);
  }

}

function createPokeScreen(data) {
  console.log('init PokeScreen');
  const previousScreen = document.getElementById("pokemon-screen");
  if(previousScreen) previousScreen.remove();
  app.insertAdjacentHTML("beforeend", '<div class="screen active" id="pokemon-screen"></div>');
  console.log(data);
  const screen = `

    <button class="screen__close" id="close-screen">x</button>
    <h2>${data.name}</h2>
    <div>
      <img src="${data.sprites.front_default}" />
      <p>
        Height: ${data.height/10}m <br/>
        Weight: ${data.weight/10}kg
      </p>
      <p>
        Type:<br/>
        ${data.types.map(type => `<span class="type type--${type.type.name}">${type.type.name}</span>`).join("")}
    </div>
    
    

  `
  const currentScreen = document.getElementById("pokemon-screen");
  currentScreen.innerHTML = screen;

  const closeScreen = document.getElementById("close-screen");
  closeScreen.addEventListener('click', (currentScreen)=>{
    document.getElementById("pokemon-screen").remove();
  });
}

viewPokedex()