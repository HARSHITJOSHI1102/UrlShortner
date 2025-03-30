const express = require('express');
const app = express();
const path = require('path')
const { connectToMongoDB } = require('./connect')
const {restrictToLoggedinUserOnly,checkAuth} = require("./middlewares/auth")
const URL = require('./models/url')
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("MongoDb Connected"));

const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter")
const userRoute = require("./routes/user");
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use("/url",restrictToLoggedinUserOnly, urlRoute)
app.use("/",checkAuth, staticRoute)
app.use("/user", userRoute);



app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: { timestamp: Date.now(), },
        }
    })
    if (!entry) {
        return res.json("Unable to fetch");
    }
    res.redirect(entry.redirectURL)
})
app.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`))