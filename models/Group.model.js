require("./User.model");
const {Schema, model} = require("mongoose");

// 1. Define your schema
const GroupSchema = new Schema ({
    name: {type: String, text: true},
    members: {type: Schema.Types.ObjectId, ref: 'User'},
    count: Number,
    events: {type: Schema.Types.ObjectId, ref: 'Event'}

});

// 2. Define your model
const GroupModel = model ('Group', GroupSchema)

// 3. Export your Model with 'module.exports'
module.exports = GroupModel;