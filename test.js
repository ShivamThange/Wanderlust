const express = require("express");
const app = express();

// Just a simple route to show it's working
app.get("/", (req, res) => {
    res.send("Hello from root!");
});

// Your problematic line
app.all("/*catchall", (req, res) => {
    res.status(404).send("Not found from wildcard!");
});

app.listen(3000, () => {
    console.log("Test app listening on 3000");
});