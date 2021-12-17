const express = require('express')
const router = express.Router()

let GroupModel = require('../models/Group.model')

// NOTE: All your API routes will start from /api 

// will handle all GET requests to http:localhost:5005/api/groups
router.get('/groups', (req, res) => {
     GroupModel.find()
          .then((groups) => {
               res.status(200).json(groups)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })         
})

// will handle all POST requests to http:localhost:5005/api/create
router.post('/create-group', (req, res) => {  
    const {name, description} = req.body;
    
    GroupModel.create({name, description})
          .then((response) => {
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

// will handle all GET A SPECIFIC requests to http:localhost:5005/api/groups/:groupId
//PS: Don't type :todoId , it's something dynamic, 
router.get('/groups/:groupId', (req, res) => {
    GroupModel.findById(req.params.groupId)
     .then((response) => {
          res.status(200).json(response)
     })
     .catch((err) => {
          res.status(500).json({
               error: 'Something went wrong',
               message: err
          })
     }) 
})

// will handle all DELETE requests to http:localhost:5005/api/groups/:id
router.delete('/groups/:id', (req, res) => {
    GroupModel.findByIdAndDelete(req.params.id)
          .then((response) => {
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

// will handle all EDIT requests to http:localhost:5005/api/groups/:id
router.patch('/groups/:id', (req, res) => {
    let id = req.params.id
    const {name, description} = req.body;
    TodoModel.findByIdAndUpdate(id, {$set: {name: name, description: description}}, {new: true})
          .then((response) => {
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          }) 
})

module.exports = router;