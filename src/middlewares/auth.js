const jwt = require('jsonwebtoken');

const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token){
            throw new Error();
        }else{
            jwt.verify(token, 'clausecreta');
            next();
        }

    }catch(e){
        res.status(401).json({error: 'Please authenticate'});
    }

};

module.exports = auth;