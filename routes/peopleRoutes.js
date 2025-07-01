const express = require("express");
const router = express.Router();
const {
  getAllPeople,
  addPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/peopleController");

router.get("/", getAllPeople);
router.post("/", addPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;
