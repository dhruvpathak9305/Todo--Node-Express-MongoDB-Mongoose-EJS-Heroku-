const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const items = ["Item 1", "Item 2", "Item 3"];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true});

const itemSchema={
  name:String
}

const Item=mongoose.model("Item",itemSchema)

//these are document created using the Item Model.
const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"This is the second item"
});

const item3 = new Item({
  name:"This is the third item"
});

const defaultItems =[item1,item2,item3];

Item.insertMany(defaultItems,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Successfully saved the default items to DB.");
  }
})


app.get("/", function(req, res) {

  res.render("list", { listTitle:"Today", newListItems: items });
});

app.post("/", function(req, res) {
  console.log(req.body);
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
  console.log(item);
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
