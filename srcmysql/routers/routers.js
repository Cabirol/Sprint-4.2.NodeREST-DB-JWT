const express = require('express');
const {Op} = require('sequelize');

const db = require('../db/mysql.js');


const dateNow = require('../utils/date.js');

const router = new express.Router();


router.post('/players', async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).json({error: 'invalid fields'});
    }
    try{
        if(!req.body.name || req.body.name === 'anon'){
            req.body.name = 'anon';
        }else{
            const existingUser = await db.User.findOne({where: {name: req.body.name} });
            if (existingUser){
                return res.status(400).json({error: 'name already taken'});
            }
        }
        const newUser = db.User.build({name: req.body.name, regDate: dateNow()});
        await newUser.save();
        res.status(201).json(newUser);
    }catch(e){
        res.status(400).json(e);
    }

});

router.get('/login', async (req, res)=>{

try{
    console.log(db);
    const users = await db.User.create({name:"Dani"});
    res.json(users);
}catch(e){
    res.status(400).json(e);
}
    
});

router.put('/players', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', '_id'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).json({error: 'invalid updates'});
    }
    if(!req.body.name || !req.body._id || req.body.name === 'anon'){
        return res.status(400).json({error: 'missing name or id'});
    }
    try{
        const user = await db.User.findOne({where: {_id:req.body._id}});

        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }
        const existingUser = await db.User.findOne({where:{name:req.body.name, [Op.not]: { _id: req.body._id }}});
        if (existingUser){
            return res.status(400).json({error: 'name already taken'});
        }
        user.name = req.body.name;
        await user.save();
        res.json(user);
    }catch(e){
        res.status(400).json(e);
    }
    
});

router.post('/players/:id/games', async (req, res)=>{
    const game = db.Game.build({
        die1: Math.floor(Math.random() * 6) + 1,
        die2: Math.floor(Math.random() * 6) + 1,
        UserId: req.params.id
    });
    try{
        const user = await db.User.findOne({where: {_id:req.params.id}});
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }
        await game.save();
        res.status(201).json(game);
    } catch(e){
        res.status(400).json(e);     
    }
    
});

router.delete('/players/:id/games', async (req, res)=>{
    try{
        const user = await db.User.findOne({where: {_id:req.params.id}});
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }
        const deleted = await db.Game.destroy({where: {UserId: req.params.id}});
        res.json(deleted);
    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players', async (req, res)=>{

    try{
        const users = await db.User.findAll();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }
        const ratios = [];
        for (const user of users){
            const games = await db.Game.findAll({where:{ UserId: user._id }});
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
        res.status(201).json(ratios);
    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/:id/games', async (req, res)=>{

try{
    const user = await db.User.findOne({where: {_id:req.params.id} });
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }
    const games = await db.Game.findAll({where:{ UserId: req.params.id }});
    res.status(201).json(games);
}catch(e){
    res.status(500).json(e);
}
    
});


router.get('/players/ranking', async (req, res)=>{

    try{
        const games = await db.Game.findAll();
        if (games.length === 0) {
            return res.status(404).json({error: 'No games played'});
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
        res.status(201).json({ratioWin});
    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/ranking/loser', async (req, res)=>{

    try{
        const users = await db.User.findAll();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }
        let ratios = [];
        let min = 100;
        for (const user of users){
            const games = await db.Game.findAll({where:{UserId: user._id}});
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
            res.status(400).json({error: "no games played"});
        }
        res.status(201).json(ratios);
    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/ranking/winner', async (req, res)=>{
    try{
        const users = await db.User.findAll();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }
        let ratios = [];
        let max = 0;
        for (const user of users){
            const games = await db.Game.findAll({where:{UserId: user._id}});
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
            res.status(400).json({error: "no games played"});
        }
        res.status(201).json(ratios);
    }catch(e){
        res.status(500).json(e);
    }
});

module.exports = router;