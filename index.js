const express = require("express");
require("dotenv").config();
require("./models/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require('./routers/user.router');

app.use('/', router);

app.get('/', (req, res) => {
    res.send("Hello JWT");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});