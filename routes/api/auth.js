const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


//@route  Post api/auth
//@desc   Auht user
//@access Public
router.post('/',(req,res)=>{
//  res.send('register');
const { email, password} = req.body;

//Simple validation
if( !email || !password) {
    return res.status(400).json({msg:'Enter all fields'});
}
// Check for existing users
User.findOne({email})
.then(user => {
    if (!user) return res.status(400).json({msg: `User Does not exist`}); 

    //Validate password
    bcrypt.compare(password, user.password)
    .then(isMatch =>{
        if (!isMatch) return res.status(400).json({msg: `Invalid credetials`});

        jwt.sign({id: user.id}, config.get('jwtSecret'), {expiresIn: 3600},(err, token) =>{
            if(err) throw err;
            res.json({
                token,
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email
                }
            });
        })
    })

})
});


module.exports = router;
