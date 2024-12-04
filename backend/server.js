const express = require('express')
const cors = require('cors')
const app = express()
const mongodb = require('mongodb').MongoClient
const port = 3000 || process.env.PORT

const STRING = "mongodb://localhost:27017/todoApp/todo"
const DATABASE = "todoApp"

//app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/", (req, res, next) => {
	console.log(req.method, req.url)
	next()
})

var dbase;

app.listen(port, () => {
	mongodb.connect(STRING, (err, client) => {
		dbase = client.db(DATABASE)
		console.log(`server started on http://localhost:${port}`)
	})
})

app.get("/showTodo", (req, res) => {
	dbase.collection("todo").find({}).toArray((err, result) => {
		res.json(result);
	})
})

//get task by name
app.get("/getRecord/:taskname", (req, res) => {
	const taskname = req.params.taskname
	dbase.collection("todo").find({name: taskname}).toArray((err, result) => {
		res.json(result)
	})
})

app.post("/addTodo", (req, res) => {
	dbase.collection("todo").insertOne({
		name: req.body.name,
		priority: req.body.priority,
		subTasks: req.body.subTasks
	})
	res.json(`Task ${req.body.name} was added`)
})

app.delete("/deleteTodo", (req, res) => {
	dbase.collection("todo").deleteOne({ name: req.body.name });
	res.json(`Deleted : ${req.body.name}`)
})

app.put("/updateTodo", (req, res) => {
	
	const updateData = {
		name: req.body.name,
		priority: req.body.priority,
		subTasks: req.body.subTasks
	}

	dbase.collection("todo").updateOne(
		{ name: req.body.name },
		{ $set: updateData }
	);
	res.json(`A text was updated of text Id: ${req.body.todoId}`)
})
