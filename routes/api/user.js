const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')

//@route  Post api/users
//@desc   Register new user
//@access Public
router.post('/',(req,res)=>{
//  res.send('register');
const {name, email, password} = req.body;

//Simple validation
if(!name || !email || !password) {
    return res.status(400).json({msg:'Enter all fields'});
}
// Check for existing users
User.findOne({email})
.then(user => {
    if (user) return res.status(400).json({msg: `User all ready exists`});

    const newUser = new User({
        name,
        email,
        password
    });

    //create salt & hash
    bcrypt.genSalt(10,(err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {

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
    })
})
});

// Validate user with token
//@route  Get api/users/auth
//@desc   Get user data
//@access private
router.get('/auth', auth, (req, res) => {
    User.findById(req.user.id)
    .select('-password') // deselects password
    .then(user => res.json(user))
});

module.exports = router;
