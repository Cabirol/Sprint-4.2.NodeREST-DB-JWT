const express = require('express');

const {
    dateNow,
    rolld6,
    ratioUser
} = require('../utils/utils.js');

const {
    findUsers,
    findUserByName,
    findUserById,
    filterUserByName,
    newUserInstance,
    saveUser,
    newGameInstance,
    saveGame,
    deleteGamesByUser,
    findGames,
    findGamesByUser
} = require(process.env.NODE_ENV ? '../mongodb/services.js' : '../mysql/services.js');

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
            const existingUser = await findUserByName(req.body.name);
            if (existingUser){
                return res.status(400).json({error: 'name already taken'});
            }
        }
        
        const newUser = newUserInstance(req.body.name, dateNow());
        await saveUser(newUser);
        res.status(201).json(newUser);
        
    }catch(e){
        res.status(500).json(e);
    }

});

router.post('/login', async (req, res)=>{

res.json('prova');
    
});

router.put('/players', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', '_id'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).json({error: 'invalid updates'});
    }
    if(!req.body.name || !req.body._id || req.body.name === 'anon'){
        return res.status(400).json({error: 'missing name or _id'});
    }

    try{

        const user = await findUserById(req.body._id);
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }

        const existingUser = await filterUserByName(req.body.name, req.body._id);
        if (existingUser){
            return res.status(400).json({error: 'name already taken'});
        }

        user.name = req.body.name;
        await saveUser(user);
        res.json(user);

    }catch(e){
        res.status(400).json(e);
    }
    
});

router.post('/players/:id/games', async (req, res)=>{
    const newGame = newGameInstance(rolld6(), rolld6(), req.params.id);

    try{
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }

        await saveGame(newGame);
        res.status(201).json(newGame);

    } catch(e){
        res.status(400).json(e);     
    }
    
});

router.delete('/players/:id/games', async (req, res)=>{
    try{
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }
        const deleted = await deleteGamesByUser(req.params.id);
        res.json(deleted);

    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players', async (req, res)=>{

    try{
        const users = await findUsers();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }
        
        const ratios = [];
        for (const user of users){
            const games = await findGamesByUser(user._id);
            ratios.push({
                _id:user._id,
                name: user.name,
                ratio: games.length ? ratioUser(games) : "No games played"
            });
        }
        res.status(201).json(ratios);

    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/:id/games', async (req, res)=>{

    try{
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'no user found'});
        }

        const games = await findGamesByUser(req.params.id);
        res.status(201).json(games);

    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/ranking', async (req, res)=>{

    try{
        const games = await findGames();
        if (games.length === 0) {
            return res.status(404).json({error: 'No games played'});
        }

        res.status(201).json({ratio: ratioUser(games)});

    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/ranking/loser', async (req, res)=>{

    try{
        const users = await findUsers();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }

        let ratios = [];
        let min = 100;
        for (const user of users){
            const games = await findGamesByUser(user._id);
            if (games.length !== 0) {
                
                const ratio = ratioUser(games);
                if (ratio<min){
                    ratios = [];
                    ratios.push({_id:user._id, name:user.name, ratio:ratio});
                    min = ratio;
                }else if (ratio == min){
                    ratios.push({_id:user._id, name:user.name, ratio:ratio});
                }
            }       
        }

        if (ratios.length === 0){
            return res.status(400).json({error: "no games played"});
        }
        res.status(201).json(ratios);

    }catch(e){
        res.status(500).json(e);
    }
    
});

router.get('/players/ranking/winner', async (req, res)=>{
    try{
        const users = await findUsers();
        if (users.length === 0) {
            return res.status(404).json({error: 'no users found'});
        }
        let ratios = [];
        let max = 0;
        for (const user of users){
            const games = await findGamesByUser(user._id);
            if (games.length !== 0) {

                const ratio = ratioUser(games);
                if (ratio>max){
                    ratios = [];
                    ratios.push({_id:user._id, name:user.name, ratio:ratio});
                    max = ratio;
                }else if (ratio == max){
                    ratios.push({_id:user._id, name:user.name, ratio:ratio});
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