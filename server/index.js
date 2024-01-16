const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;


const uri = "mongodb://127.0.0.1:27017/test";

mongoose.connect(uri, { })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


const todoSchema = new mongoose.Schema({
  description: String,
  completed: Boolean
});
const Todo = mongoose.model("Todo", todoSchema);


app.post("/api/todos/CreatePost", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(400).json({ message: "Error creating todo" });
  }
});


app.get("/api/todos/GetPost", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.get("/api/todos/GetPost/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    console.error("Error fetching todo:", err);
    res.status(500).json({ message: "Error fetching todo" });
  }
});



app.put("/api/todos/EditPost/:id", async (req, res) => {
  try {
    const updatedDescription = req.body.description; // Get updated description from the request body
    const id = req.params.id;

    await Todo.findByIdAndUpdate(id, { description: updatedDescription }, { new: true }); // Update the document with new description and return updated document

    res.json("Todo description updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json("Error updating todo");
  }
});

app.delete("/api/todos/DeletePost/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
