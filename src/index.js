import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import PokemonService from './pokemon-service.js';

function getElements(response) {
  if (response.species) {
    let pokemonName = response.species.name;
    pokemonName = pokemonName[0].toUpperCase() + pokemonName.slice(1);
    $('.showName').text(pokemonName);

    // get types and put them in ul
    let types = document.createElement('ul');
    response.types.forEach(function(element) {
      let type = document.createElement('li');
      type.innerText = element.type.name;
      types.appendChild(type);
    });
    $('.showType').html("");
    $('.showType').html(types);

    let sprite = document.createElement('img');
    let shiny = document.createElement('img');
    $(sprite).prop('src', response.sprites.front_default);
    $(shiny).prop('src', response.sprites.front_shiny);
    $('.showSprite').html("");
    $('.showSprite').append(sprite);
    $('.showShinySprite').html("");
    $('.showShinySprite').append(shiny);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

async function getPokeByName(name) {
  const response = await PokemonService.getPokemonByName(name);
  getElements(response);
}

async function getAllGenMons(genNumber, allPokemons) {
  const response = await PokemonService.getPokemonByGen(genNumber);
  populateNames(response);
  allPokemons.push(response.pokemon_species);
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

function randomMon(genList) {
  let randomGen = Math.floor(Math.random() * genList.length);
  let randomPokemon = Math.floor(Math.random() * genList[randomGen].length);
  const selectedPokemon = genList[randomGen][randomPokemon];

  getPokeByName(selectedPokemon.name);
}

$(document).ready(function() {
  const srchGenUpTo = 2;
  const allPokemons = [];
  for (let i = 1; i <= srchGenUpTo; i++) {
    getAllGenMons(i, allPokemons);
  }

  $('#pokemonInfo').on('click', function() {
    const name = $('#nameAuto').val();
    getPokeByName(name);
  });
  $('#getRandomPokemon').on('click', function() {
    randomMon(allPokemons);
  });
  
});