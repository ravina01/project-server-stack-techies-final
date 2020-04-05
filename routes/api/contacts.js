const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//let User = require('../../models/Contact');
let Contact = require('../../models/Contact');

router.get('/', async (req, res) => {
    try{
        const contactDB = await Contact.find();
        res.send(contactDB);
    }catch(err){
        res.status(500).send('Server error');
    }
  });

  router.post('/',
  [
    check('fname','First Name is required').not().isEmpty(),
    check('lname','Last Name is required').not().isEmpty(),
    check('email','Please enter valid email').isEmail(),
    check('contact_no','Please enter Contact ').not().isEmpty(),
    check('province','please select province ').not().isEmpty(),
    check('reason','Please enter reason to contact ').not().isEmpty()
  ]
  ,
  async (req, res) => {      

          const errors = validationResult(req);
          // if (!errors.isEmpty()) {
          //   return res.status(422).json({ errors: errors.array() });
          // }
        console.log(req.body);

        try{
        //   let user1 = await User.findOne({email: req.body.email});
        //   if(user1){
        //     return res.status(400).json({error: [{msg: ' User Exists '}]});
        //   }
  
          const newContact =new Contact ({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,    
            contact_no: req.body.contact_no,   
            province: req.body.province,
            reason: req.body.reason
          });  
  
          //const salt = await bcrypt.genSalt(10);
          //newContact.password = await bcrypt.hash(req.body.password,salt);
          console.log(newContact);
          //const payload
          await newContact.save();

          const payload = {
            contact: {
              id: newContact.id,
              name: newContact.name
            }
          };

          jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
          
        }catch (err) {
          console.log(err);
          res.status(500).send(err);
        }       
        //res.send(nUser);
      
    });

module.exports = router;