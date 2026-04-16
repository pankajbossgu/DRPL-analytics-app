const express = require("express");
const statusMappingController = require("../controllers/statusMappingController");

const router = express.Router();

router.get("/", statusMappingController.getStatusMappings);
router.post("/save", statusMappingController.saveStatusMappings);

module.exports = router;
