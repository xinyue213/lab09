const express = require("express");
const User = require("../models/user.model");
const auth = require("../middleware/auth");

const router = express.Router();

//User registration
router.post("/users", async (req, res) => {
    //create new user
    console.log("Request body: ", req.body);
    try {
        const user = new User(req.body);
        await user.save();
        console.log("Saved user: ", JSON.stringify(user));
        const token = await user.generateAuthToken();
        res.status(201).send({ email: user.email, token });
    } catch (err) {
        console.log(err.stack);
        res.status(500).send({ error: err.message });
    }
});

//User login 
router.post("/users/login", async (req, res) => {
    //Login a registered user
    try {
        let { email, password } = req.body;
        let user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({ error: "Login failed!" });
        }
        const token = await user.generateAuthToken();
        res.send({ email, token });
    } catch (err) {
        console.log(err.stack);
        res.status(400).send({ error: err.message });
    }
});

//User profile
router.get("/users/profile", auth, async (req, res) => {
    let user = await User.findById(req.user_id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send("User not found");
    }

    // const token = req.header("Authorization").replace("Bearer","").trim();
    // jwt.verify(token,process.env.JWT_KEY,(err,data)=>{
    //     if(err){
    //         res.status(401).send(err.message);
    //     }else{
    //         User.findById(data._id,(err,user)=>{
    //             if(user){
    //                 res.json(user);
    //             }else{
    //                 res.status(404).send("User not found");
    //             }
    //         });
    //     }
    // });
});


module.exports = router;