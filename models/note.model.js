const mongoose = require('mongoose')
const NoteSchema = new mongoose.Schema({

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

}, { timestamps: true })

const Note = mongoose.model("Note", NoteSchema)

module.exports = Note