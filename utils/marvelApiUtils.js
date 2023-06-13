const axios = require("axios");
const md5 = require("crypto-js/md5");

function getHash() {
    const timestamp = new Date().getTime();
    const hash = md5(`${timestamp}${process.env.PRIVATE_KEY}${process.env.PUBLIC_KEY}`);
    return [hash, timestamp];
  }
async function getComicList() {
    const [hash, timestamp] = getHash();
    const response = await axios.get("https://gateway.marvel.com/v1/public/comics", {
        params:{
            apikey: process.env.PUBLIC_KEY,
            ts: timestamp,
            hash: hash,
        },
    });
    const comics = response.data.data.results.map((comic) => ({
        id: comic.id,
        title: comic.title,
        image: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    }));
    return comics;
}
async function getComic(comicId) {
    const [hash, timestamp] = getHash();
    const response = await axios.get(`https://gateway.marvel.com/v1/public/comics/${comicId}`, {
        params:{
            apikey: process.env.PUBLIC_KEY,
            ts: timestamp,
            hash: hash,
        },
    });
    const comic = response.data.data.results.map((comic) => ({
        id: comic.id,
        title: comic.title,
        description: comic.description,
        image: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,  
    }));
    return comic;
}

async function getCharacters() {
    const [hash, timestamp] = getHash();
    const response = await axios.get("https://gateway.marvel.com/v1/public/characters", {
        params:{
            apikey: process.env.PUBLIC_KEY, 
            ts: timestamp,
            hash: hash,
        },
    });
    const characters = response.data.data.results.map((character) => ({
        id: character.id,
        name: character.name,
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));
    return characters;
}
async function getCharacter(name) {
    //realiza una busqueda por nombre
    const [hash, timestamp] = getHash();
    const response = await axios.get("https://gateway.marvel.com/v1/public/characters", {
        params:{
            apikey: process.env.PUBLIC_KEY,
            ts: timestamp,
            hash: hash,
            name: name,
        },
    });
    const character = response.data.data.results.map((character) => ({
        id: character.id,
        name: character.name,
        description: character.description,
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    }));
    return character;
}

module.exports = { getHash, getComicList, getComic, getCharacters, getCharacter };