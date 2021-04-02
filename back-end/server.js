const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/bulletin_board', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    date: String,
    attendee_ammount: Number,
    attendees: Array
});

const Event = mongoose.model("Event", eventSchema);

// create a new event/announcement
app.post("/api/events", async (req, res) => {
    const event = new Event({
        id: Math.floor(Date.now() / 1000),
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: new Date(req.body.date).toLocaleDateString(),
        attendee_amount: 0,
        attendees: []
    });
    
    try {
        await event.save();
        res.send(event);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// get all events/announcements
app.get("/api/events", async (req, res) => {
    try {
        let events = await Event.find();
        res.send(events);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// get 1 event/announcement
app.get("/api/events/:id", async (req, res) => {
    try {
        let event = await Event.findOne({
            _id: req.params.id
        })
        res.send(events);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// delete an event/announcement
app.delete("/api/events/:id", async(req, res) => {
    try {
        await Event.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put("/api/events/attendee/:id", async(req, res) => {
    try {
        let newEvent = await Event.findOne({
            _id: req.params.id
        });
        newEvent.attendee_amount += req.body.new_attendee;
        newEvent.attendees.push(req.body.new_attendee_name);
        await newEvent.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put("/api/events/:id", async(req, res) => {
    try {
        let event = await Event.findOne({
            _id: req.params.id
        });
        event.title = req.body.title;
        event.description = req.body.description;
        event.location = req.body.location;
        event.date = req.body.date;
        await event.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendSyatus(500);
    }
})

app.listen(3001, () => console.log("Server listening on port 3001"));