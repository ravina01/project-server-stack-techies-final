const express = require('express');

let event = require('../../models/Event');

const { check, validationResult } = require('express-validator');
//var multer = require('multer');
const router = express.Router();

router.get('/',async(req,res)=> {

    try{
    const EventDb = await event.find()
    res.send(EventDb);
    }catch(err){
        res.status(500).send('Server error');
    }
    
  });


  router.post( '/',
  [
      check('event_title', 'event title is required').not().isEmpty(),
      check('event_logo', 'event logo is required').not().isEmpty(),
      check('company_name', 'Company name is required').not().isEmpty(),
    check('event_time','Event time is required').not().isEmpty(),
    check('event_location','Event location is required').not().isEmpty(),
    check('event_date','Event Date is required').not().isEmpty(),
    
  ],
async(req, res) => {
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log(req.body);
     
        try {
           
      
        const newEvent = new user(
          {
            event_title: req.body.event_title,
            event_logo: req.files.event_logo,
            event_desc: req.body.event_desc,
            company_name: req.body.company_name,
            event_time: req.body.event_time,
            event_location: req.body.event_location,
            event_date:req.body.event_date,
          });
        //   newItem.event_logo.data = fs.readFileSync(req.files.userPhoto.path)
        
          console.log("line 55");
     
      const nEvent = await newEvent.save();
      res.send(nEvent);
    } catch (err) {
        console.log(err);
      res.status(500).send('Server error');
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const EventDb = await event.findById(req.params.id);
      if (!EventDb) {
        return res.status(404).send('task not found');
      }
      res.send(EventDb);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  router.delete('/:id',async (req, res) => {
    try{
        await Event.findByIdAndRemove({_id:req.params.id});     
        res.json("Record Deleted");
    }catch(err){
        res.status(500).send('Server error');
    }
    
});

router.put('/:id',async (req, res) => {

  const eventupdate = await Event.findById(req.body.id);   
  eventupdate.event_title = req.body.event_title,
  eventupdate.event_logo = req.body.event_logo,
  eventupdate.company_name = req.body.company_name,    
  eventupdate.event_desc = req.body.event_desc,   
  eventupdate.event_location = req.body.event_location,
  eventupdate.event_desc = req.body.event_desc,
  eventupdate.total_seat = req.body.total_seat,
  eventupdate.registered = req.body.registered 
  
  
  await eventupdate.save();
  res.send("Record Updated");
 });


 router.delete('/:id', async (req, res) => {
    try {
      // find the element
      await Event.findByIdAndRemove({ _id: req.params.id });
  
      res.json({ msg: 'Event deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;