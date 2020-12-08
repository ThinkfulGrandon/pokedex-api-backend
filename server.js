require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const helmet = require('helmet');
const cors = require('cors');


// console.log(process.env.API_TOKEN);

const app = express()
app.use(helmet())
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())


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
    const {name, type} = req.query

    let mons;
    if(!name && !type) {
        res.send('search requires a "name=" or "type=" or both query')
    }
    if(name) {
        mons = POKEDEX.pokemon.filter(mon => mon.name.toLowerCase().includes(name.toLowerCase()))
    }
    if(type){
        if(validTypes.indexOf(type) === -1){
            res.send('you need to select a valid type!')
        }
        mons = POKEDEX.pokemon.filter(mon=> (mon.type.indexOf(type) !== -1))
    }
    res.send(mons);
}

app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
  })