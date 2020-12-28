const express = require('express');
const bodyParser = require('body-parser')
const Dishes = require('../models/dishes')

var dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dishes)
            })
    })
    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish)
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }).catch((error)=>{
                res.status = error.statusCode
                res.end(error.message.toString())
            })
    })
    .put((req, res, next) => {
        res.status = 403
        res.end('Put operation is not supported')
    })
    .delete((req, res, next) => {
        Dishes.remove()
            .then((response) => {
                console.log('All dish Deleted')
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            })
    })

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            })
    })
    .post((req, res, next) => {
        res.status = 403
        res.end('Post operation is not supported')
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            })
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((response) => {
                console.log('Dish deleted')
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            })
    })

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish.comments.length != 0) {
                    res.status = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish.comments)
                } else {
                    res.status = 404
                    res.end('Comments is not found')
                }
            })
    })
    .post((req, res, next) => {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) {
                res.status = 400
                res.setHeader('Content-Type', 'application/json')
                res.json(err)
            } else {
                dish.comments.push(req.body)
                dish.save(function (err, comment) {
                    if (err) {
                        res.status = 400
                        res.setHeader('Content-Type', 'application/json')
                        res.json(err)
                    } else {
                        res.status = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(comment)
                    }
                })
            }
        })
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) {
                res.status = 400
                res.setHeader('Content-Type', 'application/json')
                res.json(err)
            } else {
                for (let index = 0; index < dish.comments.length; index++) {
                    dish.comments.id(dish.comments[index]._id).remove()
                }
                dish.save(function (err, result) {
                    if (err) {
                        res.status = 400
                        res.setHeader('Content-Type', 'application/json')
                        res.json(err)
                    } else {
                        res.status = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(result)
                    }
                })
            }
        })
    })
    .put((req, res, next) => {
        res.status = 403
        res.end('Put operation is not supported')
    })

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => [
        Dishes.findById(req.params.dishId, ((err, dish) => {
            if (err) {
                res.status = 400
                res.setHeader('Content-Type', 'application/json')
                res.json(err)
            } else {
                res.status = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish.comments.id(req.params.commentId))
            }
        }))
    ])
    .post((req, res, next) => {
        res.status = 403
        res.end('Post operation is not supported')
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId, ((err, dish) => {
            if (err) {
                res.status = 400
                res.setHeader('Content-Type', 'application/json')
                res.json(err)
            } else {
                dish.comments.id(req.params.commentId).remove()
                dish.comments.push(req.body)
                dish.comments.save((err, comment) => {
                    if (err) {
                        res.status = 400
                        res.setHeader('Content-Type', 'application/json')
                        res.json(err)
                    } else {
                        res.status = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(comment)
                    }
                })
            }
        }))
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId, ((err, dish) => {
            dish.comments.id(req.params.commentId).remove()
            dish.save((err, result) => {
                if (err) {
                    res.status = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.json(err)
                } else {
                    res.status = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(result)
                }
            })
        }))
    })

module.exports = dishRouter