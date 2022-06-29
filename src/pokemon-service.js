export default class PokemonService {  
  static async getPokemonByName(name) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    } catch(error) {
      return error.message;
    }
  }
  static async getPokemonByGen(number) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/generation/${number}`);
      // const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomNumber}`);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    } catch(error) {
      return error.message;
    }
  }
}