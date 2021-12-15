require("./User.model");
const {Schema, model} = require("mongoose");

// 1. Define your schema
const EventSchema = new Schema ({
    organiser: {type: String, text: true},
    title: {type: String, text: true},
    time: {},
    location: {},
    limit: {type: String, text: true},
    members: {type: Schema.Types.ObjectId, ref: 'User'},
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
    description: {},
    id: String
});

// 2. Define your model
const EventModel = model ('Event', EventSchema)

// 3. Export your Model with 'module.exports'
module.exports = EventModel;