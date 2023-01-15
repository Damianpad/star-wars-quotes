const bodyParser = require('body-parser')
const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const PORT = 3000


//51q9oa2yfu4A0ckr
const conntectionString = 'mongodb+srv://yoda:51q9oa2yfu4A0ckr@cluster0.fuvqxv6.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(conntectionString, { useUnifiedTopology: true })
        .then(client => {
            console.log('Connected to the Database');
            const db = client.db('star-wars-quotes')
            const quotesCollection = db.collection('quotes')

            //==============
            //Middleware
            //==============

            //Place Middleware before CRUD handlers
            app.set('view engine', 'ejs')
            app.use(bodyParser.urlencoded({ extend: true }))
            app.use(bodyParser.json())
            app.use(express.static('public'))

            //==========
            //Routes
            //==========

            app.get('/', (req, res) => {
                // res.sendFile(__dirname + '/index.html')
                const cursor = db.collection('quotes').find().toArray()
                .then(quotes => {
                    res.render('index.ejs', { quotes: quotes })
                })
                .catch(error => console.error(error))
            // res.render('index.ejs', {})
            })
            
            app.post('/quotes', (req,res) => {
                quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
            })

            app.put('/quotes', (req, res) => {
                quotesCollection.findOneAndUpdate(
                    { name: 'Yoda' },
                    {
                      $set: {
                        name: req.body.name,
                        quote: req.body.quote
                      }
                    },
                    {
                      upsert: true
                    }
                  )
                    .then(result => {
                        res.json('Success')
                    })
                    .catch(error => console.error(error))
              })


        })
        .catch(error => console.error(error))


app.listen(PORT, function() {
    console.log(`listening on ${PORT}`);
})