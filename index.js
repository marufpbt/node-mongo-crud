const express = require('express')
var bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
// var ObjectID = require('mongodb').ObjectID
const app = express()
const port = 3000
// const password = X64bvL22rhHeK4ty;
// create application/json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://marufpbt:X64bvL22rhHeK4ty@cluster0.edbhc.mongodb.net/marufpbt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
	const productCollection = client.db("marufpbt").collection("marufpbt");

	app.get('/products', (req, res) => {
		productCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})

	app.get('/product/:id', (req, res) => {
		productCollection.find({ _id: ObjectId(req.params.id) })
			.toArray((err, documents) => {
				res.send(documents[0])
			})
	})

	app.post('/addProduct', (req, res) => {
		const product = req.body;
		productCollection.insertOne(product)
			.then(result => {
				console.log("data added succesfully");
				res.redirect('/')
			})
	})

	app.patch('/update/:id', (req, res) => {
		productCollection.updateOne({_id: ObjectId(req.params.id)},
		{
			$set: {price: req.body.price, quantity: req.body.quantity}
		}
		)
		.then(result=>{
			res.send(result.modifiedCount > 0)
		})

	})

	app.delete('/delete/:id', (req, res) => {
		productCollection.deleteOne({ _id: ObjectId(req.params.id) })
			.then(result => {
				res.send(result.deletedCount > 0)
			})
	})
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
