const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Item = require('../../models/Item');

//@route  Get api/items
//@desc   Get All items
//@access Public
router.get('/',(req,res)=>{
Item.find()
.sort({date:-1})
.then(items => res.json(items));
});

//@route  POST api/items
//@desc   Create an items
//@access private
router.delete('/:id', auth, (req,res)=>{Item.findById(req.params.id)
   .then(item =>item.remove().then(()=> res.json({Success:true})))
   .catch(err=> res.status(404).json({ Success:false}));
    });
    

    //@route  Delete api/items
//@desc   Delete an items
//@access private
router.post('/', auth, (req,res)=>{
    const newItem = new Item({
        name: req.body.name
    });
    newItem.save().then(item => res.json(item));
     });
    

module.exports = router;
