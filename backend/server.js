const app = require("./src/app")
const MONGODB = require("./src/config/database")

MONGODB()
app.listen(3000, () => {
    console.log("server is runnig on 3000");
})