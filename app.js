//import modules
const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app=express();
const const databasePath = path.join(__dirname, 'cricketTeam.db')

//middleware 
app.use(express.json());
//initilize dabase ans server

