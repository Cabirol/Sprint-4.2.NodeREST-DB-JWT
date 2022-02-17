const express = require('express');
const User = require('../models/user.js');
const Game = require('../models/game.js');
const dateNow = require('../utils/date.js');

const {
    findUserByName,
    findUserById,
    filterUserByName,
    newUserInstance,
    saveUser
} = require('../services/mongoservices.js');

const router = new express.Router();


router.post('/players', async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid fields'});
    }
    try{
        if(!req.body.name || req.body.name === 'anon'){
            req.body.name = 'anon';
        }else{
            //const existingUser = await User.findOne({name:req.body.name});
            const existingUser = await findUserByName(req.body.name);
            if (existingUser){
                return res.status(400).send({error: 'name already taken'});
            }
        }
        
        //const newUser = new User({name: req.body.name, regDate: dateNow()});
        const newUser = newUserInstance(req.body.name, dateNow());
        //await newUser.save();
        await saveUser(newUser);
        res.status(201).send(newUser);
    }catch(e){
        res.status(400).send(e);
    }

});

router.post('/login', async (req, res)=>{

res.send('prova');
    
});

router.put('/players', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', '_id'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'});
    }
    if(!req.body.name || !req.body._id || req.body.name === 'anon'){
        return res.status(400).send({error: 'missing name or _id'});
    }
    try{
        //const user = await User.findOne({_id:req.body._id});
        const user = await findUserById(req.body._id);
        if (!user) {
            return res.status(404).send({error: 'no user found'});
        }
        //const existingUser = await User.findOne({name:req.body.name, _id: { $ne: req.body._id }});
        const existingUser = await filterUserByName(req.body.name, req.body._id);
        if (existingUser){
            return res.status(400).send({error: 'name already taken'});
        }
        user.name = req.body.name;
        await saveUser(user);
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
    
});

router.post('/players/:id/games', async (req, res)=>{
    const game = new Game({
        die1: Math.floor(Math.random() * 6) + 1,
        die2: Math.floor(Math.random() * 6) + 1,
        owner: req.params.id
    });
    try{
        const user = await User.findOne({_id:req.params.id});
        if (!user) {
            return res.status(404).send({error: 'no user found'});
        }
        await game.save();
        res.status(201).send(game);
    } catch(e){
        res.status(400).send(e);     
    }
    
});

router.delete('/players/:id/games', async (req, res)=>{
    try{
        const user = await User.findOne({_id:req.params.id});
        if (!user) {
            return res.status(404).send({error: 'no user found'});
        }
        const deleted = await Game.deleteMany({owner: req.params.id});
        res.send(deleted);
    }catch(e){
        res.status(500).send(e);
    }
    
});

router.get('/players', async (req, res)=>{

    try{
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).send({error: 'no users found'});
        }
        const ratios = [];
        for (const user of users){
            const games = await Game.find({ owner: user._id });
            if (games.length === 0) {
                ratios.push({_id:user._id, name:user.name, ratioWin:"No games played"});
            } else {
                const turnoutsUser = [];
                games.forEach((game)=>{
                    const sum = game.die1+game.die2;
                    if (sum === 7){
                        turnoutsUser.push(1);
                    } else {
                        turnoutsUser.push(0);
                    }
                });
                const ratioUser = 100 * turnoutsUser.reduce((a, b) => a + b, 0)/turnoutsUser.length;
                ratios.push({_id:user._id, name:user.name, ratioWin:ratioUser});
            }
        }
        res.status(201).send(ratios);
    }catch(e){
        res.status(500).send(e);
    }
    
});

router.get('/players/:id/games', async (req, res)=>{

try{
    const user = await User.findOne({_id:req.params.id});
        if (!user) {
            return res.status(404).send({error: 'no user found'});
        }
    const games = await Game.find({owner: req.params.id});
    res.status(201).send(games);
}catch(e){
    res.status(500).send(e);
}
    
});


router.get('/players/ranking', async (req, res)=>{

    try{
        const games = await Game.find();
        if (games.length === 0) {
            return res.status(404).send({error: 'No games played'});
        }
        const turnouts = [];
        games.forEach((game)=>{
            const sum = game.die1+game.die2;
            if (sum === 7){
                turnouts.push(1);
            } else {
                turnouts.push(0);
            }
        });
        const ratioWin = 100 * turnouts.reduce((a, b) => a + b, 0)/turnouts.length;
        res.status(201).send({ratioWin});
    }catch(e){
        res.status(500).send(e);
    }
    
});

router.get('/players/ranking/loser', async (req, res)=>{

    try{
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).send({error: 'no users found'});
        }
        let ratios = [];
        let min = 100;
        for (const user of users){
            const games = await Game.find({ owner: user._id });
            if (games.length !== 0) {
                const turnoutsUser = [];
                games.forEach((game)=>{
                    const sum = game.die1+game.die2;
                    if (sum === 7){
                        turnoutsUser.push(1);
                    } else {
                        turnoutsUser.push(0);
                    }
                });
                const ratioUser = 100 * turnoutsUser.reduce((a, b) => a + b, 0)/turnoutsUser.length;

                if (ratioUser<min){
                    ratios = [];
                    ratios.push({_id:user._id, name:user.name, ratioWin:ratioUser});
                    min = ratioUser;
                }else if (ratioUser == min){
                    ratios.push({_id:user._id, name:user.name, ratioWin:ratioUser});
                }
            }       
        }
        if (ratios.length === 0){
            res.status(400).send({error: "no games played"});
        }
        res.status(201).send(ratios);
    }catch(e){
        res.status(500).send(e);
    }
    
});

router.get('/players/ranking/winner', async (req, res)=>{
    try{
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).send({error: 'no users found'});
        }
        let ratios = [];
        let max = 0;
        for (const user of users){
            const games = await Game.find({ owner: user._id });
            if (games.length !== 0) {
                const turnoutsUser = [];
                games.forEach((game)=>{
                    const sum = game.die1+game.die2;
                    if (sum === 7){
                        turnoutsUser.push(1);
                    } else {
                        turnoutsUser.push(0);
                    }
                });
                const ratioUser = 100 * turnoutsUser.reduce((a, b) => a + b, 0)/turnoutsUser.length;
                if (ratioUser>max){
                    ratios = [];
                    ratios.push({_id:user._id, name:user.name, ratioWin:ratioUser});
                    max = ratioUser;
                }else if (ratioUser == max){
                    ratios.push({_id:user._id, name:user.name, ratioWin:ratioUser});
                }
            }       
        }
        if (ratios.length === 0){
            res.status(400).send({error: "no games played"});
        }
        res.status(201).send(ratios);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;