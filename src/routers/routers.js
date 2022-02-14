const express = require('express');
const User = require('../models/user.js');
const Game = require('../models/game.js');
const dateNow = require('../utils/date.js');

const router = new express.Router();


router.post('/players', async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'/*aquí s'hi poden afegir més camps */];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid fields'});
    }
    try{
        if(!req.body.name){
            req.body.name = 'anon';
        }else{
            //buscar si el nom està ocupat
        }
    }catch(e){
        res.status(400).send(e);
    }
    res.send(req.body.name);

});

router.post('/login', async (req, res)=>{

    res.send('De moment això no fa res!');
    
});

router.put('/players/:id', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'/*aquí s'hi poden afegir més camps */];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'});
    }

    try{
        const user = await User.findOne({_id:req.params.id});
        if (!user) {
            return res.status(404).send();
        }
        updates.forEach((update)=>(user[update] = req.body[update]));
        await user.save();
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
        await game.save();
        res.status(201).send(game);
    } catch(e){
        res.status(400).send(e);     
    }
    
});

router.delete('/players/:id/games', async (req, res)=>{

    res.send('prova');
    
});

router.get('/players', async (req, res)=>{

    res.send('prova');
    
});

router.get('/players/:id/games', async (req, res)=>{

    res.send('prova');
    
});

router.get('/players/ranking', async (req, res)=>{

    res.send('prova');
    
});

router.get('/players/ranking/loser', async (req, res)=>{

    res.send('prova');
    
});

router.get('/players/ranking/winner', async (req, res)=>{

    res.send('prova');
    
});

module.exports = router;