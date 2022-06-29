import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import PokemonService from './pokemon-service.js';

function getElements(response) {
  if (response.species) {
    $('.showName').text(response.species.name);
    let sprite = document.createElement('img');
    $(sprite).prop('src', response.sprites.front_default);
    $('.showSprite').html("");
    $('.showSprite').append(sprite);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

async function getPokeByName(name) {
  const response = await PokemonService.getPokemonByName(name);
  getElements(response);
}

async function getAllGenMons(genNumber) {
  const response = await PokemonService.getPokemonByGen(genNumber);
  populateNames(response);
}

function populateNames(response) {
  const pokemonArray = response.pokemon_species;
  const list = $('#pokemons');
  pokemonArray.forEach(function(pokemon) {
    let option = $(document.createElement('option'));
    option.val(pokemon.name);
    list.append(option);
  });
}

// Array.prototype.random = function() {
//   return this[Math.random]
// }
function randomMon(response) {
  const pokemonArray = response.pokemon_species;
  const list = $('#pokemons');
    let randomMon = (Math.floor(Math.random()*pokemonArray.length))
    list.append(pokemonArray[randomMon])
  };



$(document).ready(function() {
  const srchGenUpTo = 8;
  for (let i = 1; i <= srchGenUpTo; i++) {
    getAllGenMons(i);
  }
  $('#pokemonInfo').on('click', function() {
    const name = $('#nameAuto').val();
    getPokeByName(name);
  });
});