const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./db");
const { swaggerUi, specs } = require("./swagger");
const fileUpload = require("express-fileupload");

app.use(cors({
    origin: "https://blockreview.monstercoders.io",
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret : process.env.secret,
    proxy: true,
    cookie: {
        secure: false,
        sameSite: "none"
    }
}));

app.use(fileUpload());

app.get("/", (req, res)=> {
    res.redirect("/api-docs");
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use("/api/blockreview/user", require("./router/User"));
app.use("/api/blockreview/review", require("./router/Review"));
app.use("/api/blockreview/store", require("./router/Store"));



app.listen(PORT, () => console.log(`✅ Server is Running At : ${PORT}`));