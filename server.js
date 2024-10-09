const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/peopleDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the Person schema and model
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobile: String
});

const Person = mongoose.model('Person', personSchema);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// GET /person: List all people
app.get('/person', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST /person: Create a new person
app.post('/person', async (req, res) => {
    const { name, age, gender, mobile } = req.body;

    const newPerson = new Person({
        name,
        age,
        gender,
        mobile
    });

    try {
        await newPerson.save();
        res.status(201).send('Person created successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// PUT /person/:id: Update an existing person
app.put('/person/:id', async (req, res) => {
    const { name, age, gender, mobile } = req.body;

    try {
        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            { name, age, gender, mobile },
            { new: true, runValidators: true }
        );

        if (!updatedPerson) {
            return res.status(404).send('Person not found');
        }

        res.send('Person updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// DELETE /person/:id: Delete a person
app.delete('/person/:id', async (req, res) => {
    try {
        const deletedPerson = await Person.findByIdAndDelete(req.params.id);

        if (!deletedPerson) {
            return res.status(404).send('Person not found');
        }

        res.send('Person deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});
