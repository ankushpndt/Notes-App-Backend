const router = require("express").Router()
const Note = require("../models/note.model")
const User = require("../models/user.model")
const verifyToken = require("../middlewares/verifyToken")
const { extend } = require("lodash");
const isNotePresentFunc = async (userId, noteId) => {
  let user = await User.findById(userId)

  const isNotePresentArr = user.notes.filter(note => JSON.stringify(note.id) === JSON.stringify(noteId))

  if (isNotePresentArr.length !== 0) {
    return true
  }
  else {
    return false
  }
}
router.route("/")
  .get(verifyToken, async (req, res) => {

    try {
      const userId = req.user._id

      const currentUser = await User.findById(userId)
      const response = await currentUser.populate('note').execPopulate()

      res.status(200).json({ success: true, message: "Notes fetched successfully", notes: response.notes })
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Error Occurred while Retrieving notes", errMessage: error.message })
    }
  })
  .post(verifyToken, async (req, res) => {

    try {
      const { title, content, color, isPinned, tag } = req.body
      const userId = req.user._id
      let user = await User.findById(userId)
      let note = user.notes
      let newNote = await new Note({ title, content, color, isPinned, tag })
      note = note.push(newNote)

      let saveNote = await user.save()
      res.status(200).json({ success: true, message: "Notes fetched successfully", saveNote })

    }
    catch (error) {
      res.status(500).json({ success: false, message: "Error Occurred while adding notes", errMessage: error.message })
    }
  })

  .put(verifyToken, async (req, res) => {
    try {
      const userId = req.user._id
      const updatedData = req.body;
      const noteId = updatedData._id
      let user = await User.findById(userId)
      let note = user.notes
      const isNotePresentinArr = await isNotePresentFunc(userId, String(noteId))

      if (isNotePresentinArr) {
        let result = note.find(el => el._id == noteId)
        updatedNote = extend(result, updatedData)
        let savedNote = await user.save()
        res.status(200).json({ success: true, message: "Note updated successfully. ", savedNote })
      }
      else {
        res.status(400).json({ success: false, message: "Note does not exist" })
      }
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Couldn't add this note", errMessage: error.message })
    }
  })
router.delete("/:id", verifyToken, async (req, res) => {

  try {
    const userId = req.user._id
    let user = await User.findById(userId)
    let note = user.notes
    let { id } = req.params
    const isNotePresentinArr = await isNotePresentFunc(userId, id)
    if (!isNotePresentinArr) {
      res.send("This note does not exist.")
    }
    else {
      const updatedNote = note.filter(currentNote => {

        return JSON.stringify(currentNote._id) !== JSON.stringify(id)
      })

      let savedNote = await User.findByIdAndUpdate({ _id: userId }, { notes: updatedNote }, { new: true })
      res.status(200).json({ success: true, message: "Note removed successfully.", savedNote })
    }
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Couldn't remove this note.", errMessage: error.message })
  }
})

module.exports = router;