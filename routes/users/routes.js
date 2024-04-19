const express = require('express');
const router = express.Router();
const User = require('../../dblayer/user');
const { Error } = require('mongoose');
const GenerateResponse = require('../../utils/response_creator');

// HTTP get method to get list of users, this function would get invoked at /users/ API call 
router.get('/', async (req, res) => {

    try {
        console.log('in get /');
        const users = await getUsers();
        console.log('users are: ', users.length);
        res.json(users);
    }
    catch {
        (err) => {
            console.log('err occured : ', err);
        }
    }

});

// HTTP post method to add a new user, this function would get invoked at /users/ API call
router.post('/', async (req, res) => {

    try {
        console.log('in post /');
        // if user already exist        
        if (await User.findOne({ Username: req.body.Username })) {
            res.json({ message: "User already exists" })
        }

        else {
            const usr = await User.create(req.body);
            // Return all users as response
            const users = await getUsers();
            res.json(new GenerateResponse(true, undefined, users));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});


// HTTP put method to update an existing user, this function would get invoked at /users/ API call
router.put('/:Username', async (req, res) => {
    console.log('in put /username');
    const { Username } = req.params
    const newUserObj = req.body
    console.log("username is: ", Username);
    try {

        if (!(await User.findOne({ Username: Username }))) {
            res.json({ message: "User does not exist" })
        }
        else {
            console.log('about to change');
            // console.log('id on put : ', JSON.stringify(req.params));
            await User.findOneAndUpdate({ Username: Username }, newUserObj, { returnDocument: 'after' });
            // Return all users as response
            const users = await getUsers();
            console.log('users after update: ', users);
            res.send(new GenerateResponse(true, undefined, users));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});


// HTTP delete method to delete an existing user, this function would get invoked at /users/ API call
router.delete('/:Username', async (req, res) => {

    console.log('in delete /username');
    const { Username } = req.params
    console.log("username is: ", Username);
    try {
        const delResult = await User.deleteOne({ Username: Username });
        if (delResult.hasOwnProperty("deletedCount") && delResult.deletedCount === 1) {
            // Return remaining users as response
            const users = await getUsers();
            res.json(new GenerateResponse(true, undefined, users));
        } else {
            res.json(new GenerateResponse(false, "Unable to delete user at the moment."));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

async function getUsers() {
    const users = await User.find({}).lean();
    return users instanceof Array ? users : [];
}

module.exports = router;