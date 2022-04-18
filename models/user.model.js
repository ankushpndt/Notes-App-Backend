const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  notes: [{
    title: {
      type: String,

    },
    content: String,
    color: {
      type: String,
      default: "white"
    },
    isPinned: Boolean,
    tag: {
      type: String,
      default: "No Tag"
    }
  }]
})

const User = mongoose.model("User", UserSchema)
module.exports = User