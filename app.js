const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const items = ["Item 1", "Item 2", "Item 3"];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

//these are document created using the Item Model.
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "This is the second item"
});

const item3 = new Item({
  name: "This is the third item"
});

const defaultItems = [item1, item2, item3];

const listSchema={
  name:String,
  items:[itemSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved the default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        //Create a new List
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        //Show an existing list
        res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
      }
    }
  })
 
})

app.post("/", function(req, res) {
  
  const itemName = req.body.newItem;
const item=new Item({
  name:itemName
});
item.save();
res.redirect("/");
});

app.post("/delete", function(req, res) {
  console.log(req.body);
  const checkedItemId= req.body.checkbox;
Item.findByIdAndRemove(checkedItemId,function(err){
  if(!err){
    console.log("Successfully deleted checked Items.")
    res.redirect("/");
  }
});
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
