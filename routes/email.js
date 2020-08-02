const router = require("express").Router();
const ctrl = require("../controllers");

router.post("/", ctrl.email.contact);

module.exports = router;
