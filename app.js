//import modules
const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app=express();
const databasePath = path.join(__dirname, 'cricketTeam.db')

//middleware 
app.use(express.json());

//initilize dabase ans server
let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

//helping function
const convertDbObjectToResponseObject = dbObject => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    }
  }

// get list of all players in the team
app.get('/players/', async (request, response) => {
    const getPlayersQuery = `
      SELECT
        *
      FROM
        cricket_team;`
    const playersArray = await database.all(getPlayersQuery)
    response.send(
      playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
    )
  })
  
  //Creates a new player in the team
  app.post('/players/', async (request, response) => {
    const {playerName, jerseyNumber, role} = request.body
    const postPlayerQuery = `
    INSERT INTO
      cricket_team (player_name, jersey_number, role)
    VALUES
      ('${playerName}', ${jerseyNumber}, '${role}');`
    const player = await database.run(postPlayerQuery)
    response.send('Player Added to Team')
  })

  //Get player based on a player ID
  app.get('/players/:playerId/', async (request, response) => {
    const {playerId} = request.params
    const getPlayerQuery = `
      SELECT 
        * 
      FROM 
        cricket_team 
      WHERE 
        player_id = ${playerId};`
    const player = await database.get(getPlayerQuery)
    response.send(convertDbObjectToResponseObject(player))
  })

  //Updates the details of a player
  app.put('/players/:playerId/', async (request, response) => {
    const {playerName, jerseyNumber, role} = request.body
    const {playerId} = request.params
    const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE
      player_id = ${playerId};`
  
    await database.run(updatePlayerQuery)
    response.send('Player Details Updated')
  })
  
//Deletes a player from the team
app.delete('/players/:playerId/', async (request, response) => {
    const {playerId} = request.params
    const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
    await database.run(deletePlayerQuery)
    response.send('Player Removed')
  })
  
  module.exports = app





