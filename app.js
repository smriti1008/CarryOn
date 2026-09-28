const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection")

const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const indexRouter = require("./routes/index");


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owner", ownerRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);

// app.get("/", function(req, res){
//     res.send("yupp heyyyaaaaa");
// })

app.listen(3000);
