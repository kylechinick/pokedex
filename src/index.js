import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import PokemonService from './pokemon-service.js';
import OpenWeatherService from './open-weather_service.js';

function getElements(response) {
  if (response.species) {
    let pokemonName = response.species.name;
    pokemonName = pokemonName[0].toUpperCase() + pokemonName.slice(1);

    $('.showName').text(pokemonName);

    let types = document.createElement('ul');

    response.types.forEach(function (element) {
      let type = document.createElement('li');
      element.type.name =
        element.type.name[0].toUpperCase() + element.type.name.slice(1);
      type.innerText = element.type.name;
      types.appendChild(type);
    });

    $('.showType').html('');
    $('.showType').html(types);

    let sprite = document.createElement('img');
    sprite.className = 'sprites';
    let shiny = document.createElement('img');
    shiny.className = 'sprites';
    $(sprite).prop('src', response.sprites.front_default);
    $(shiny).prop('src', response.sprites.front_shiny);

    $('.showSprites').html('');
    $('.showSprites').append(sprite);
    $('.showSprites').append(shiny);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

function populateSpeciesInfo(response) {
  if (response.name) {
    let enText = '';
    const flavorTexts = response.flavor_text_entries;

    for (let i = flavorTexts.length - 1; i > 0; i--) {
      if (flavorTexts[i].language.name === 'en') {
        enText = flavorTexts[i].flavor_text;
        enText = enText.replace(/[\uE000-\uF8FF]/g, '');
        break;
      }
    }

    $('.showFlavor').text('');
    $('.showFlavor').text(enText);

    let enGenus = '';
    const generaTexts = response.genera;

    for (let i = 0; i < generaTexts.length; i++) {
      if (generaTexts[i].language.name === 'en') {
        enGenus = generaTexts[i].genus;
        break;
      }
    }

    let firstAppear = document.createElement('p');
    let fASplit = response.generation.name.split('-');
    fASplit[0] = 'Generation';
    fASplit[1] = fASplit[1].toUpperCase();
    firstAppear.innerText = fASplit.join('-');

    $('.showMisc').html('');
    $('.showMisc').append(enGenus);
    $('.showMisc').append(firstAppear);

    let enEgg = '';
    const eggTypeArray = response.egg_groups;

    for (let i = 0; i < eggTypeArray.length; i++) {
      let eggType = eggTypeArray[i].name;
      eggType = eggType[0].toUpperCase() + eggType.slice(1);
      enEgg += eggType + ' ';
    }

    $('.showEgg').text('');
    $('.showEgg').text('Egg Type: ' + enEgg);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

async function getPokeByName(name) {
  const response = await PokemonService.getPokemonByName(name);
  getElements(response);
}

async function getPokeSpeciesInfo(name) {
  const response = await PokemonService.getPokemonSpeciesInfo(name);
  populateSpeciesInfo(response);
}

async function getAllGenMons(genNumber, allPokemons) {
  const response = await PokemonService.getPokemonByGen(genNumber);
  populateNames(response);
  allPokemons.push(response.pokemon_species);
}

function populateNames(response) {
  const pokemonArray = response.pokemon_species;
  const list = $('#pokemons');
  pokemonArray.forEach(function (pokemon) {
    let option = $(document.createElement('option'));
    option.val(pokemon.name);
    list.append(option);
  });
}

function randomMon(genList) {
  let randomGen = Math.floor(Math.random() * genList.length);
  let randomPokemon = Math.floor(Math.random() * genList[randomGen].length);
  const selectedPokemon = genList[randomGen][randomPokemon];

  fillPokemonInfo(selectedPokemon.name);
}

function fillPokemonInfo(name) {
  getPokeByName(name);
  getPokeSpeciesInfo(name);
}

async function displayWeather() {
  const response = await OpenWeatherService.getCurrentTemperature();
  const temperatureData = response.main.temp;
  $('#current-temperature').text(temperatureData);
}

async function displayForecast() {
  const response = await OpenWeatherService.get16DayForecast();
  console.log(response);
  const forecasts = response.list;
  forecasts.forEach(function (element) {
    let day = document.createElement('li');
    let temp = 1.8 * (element.main.temp - 273) + 32;
    day.innerText = (temp + '').substring(0, 4) + '℉';
    $('#forecast').append(day);
  });
}

// Kyle's Conversion Function:
// function convertKelvinToFahrenheit(kelvinValue) {
//   return parseFloat((((kelvinValue - 273.15) * 9) / 5 + 32).toFixed(0));
// }

$(document).ready(function () {
  const srchGenUpTo = 8;
  const allPokemons = [];
  for (let i = 1; i <= srchGenUpTo; i++) {
    getAllGenMons(i, allPokemons);
  }

  $('#pokemonInfo').on('click', function () {
    const name = $('#nameAuto').val();
    if (name.length !== 0) {
      fillPokemonInfo(name);
    }
  });
  $('#getRandomPokemon').on('click', function () {
    randomMon(allPokemons);
  });

  displayWeather();
  displayForecast();
});
