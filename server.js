require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json')

// console.log(process.env.API_TOKEN)

const app = express();
app.use(morgan('dev'));

const validTypes = [
    `Bug`,
    `Dark`, 
    `Dragon`, 
    `Electric`, 
    `Fairy`, 
    `Fighting`, 
    `Fire`, 
    `Flying`, 
    `Ghost`, 
    `Grass`, 
    `Ground`, 
    `Ice`, 
    `Normal`, 
    `Poison`, 
    `Psychic`, 
    `Rock`, 
    `Steel`, 
    `Water`
    ]
app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token mid')
    if(!bearerToken || bearerToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
})

function handleGetTypes(req, res) {
    res.json(validTypes)
}
app.get('/types', handleGetTypes)


function handleGetPokemon(req, res) {
    res.send('Hello Pokemons')
}
app.get('/pokemon', handleGetPokemon)


const port = 8000;

app.listen(port, () => {
    console.log(`Port started at port ${port}`)
})