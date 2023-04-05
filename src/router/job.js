const express = require('express')
const { model } = require('mongoose')
const router = express.Router()

const {job} = require("../controllers/index")


router.get("/add", (req, res) => {
    return res.render("addNewJob");
  })


router.post('/filter', job.filterSalary)
router.post('/add',job.addJob)
router.get('/save/:id', job.saveJob)
router.get('/myjob/',job.myJob)
router.get('/remove/:id',job.remove)
router.get('/del/:id',job.deleteJob)


module.exports = router