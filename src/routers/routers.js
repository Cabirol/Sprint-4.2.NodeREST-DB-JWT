const express = require('express');
const User = require('../models/user.js');


const router = new express.Router();


router.post('/players', async (req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        const genDate = await user.generateDate();
        res.status(201).send({user, genDate});
    }catch(e){
        res.status(400).send(e);
    }
    res.send('prova');

});

router.post('/login', async (req, res)=>{

    res.send('prova');
    
});

router.put('/players', async (req, res)=>{

    res.send('prova');
    
});

router.post('/players/:id/games', async (req, res)=>{

    res.send('prova');
    
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