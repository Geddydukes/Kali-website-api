const router = require("express").Router();
const ctrl = require("../controllers");

router.get("/profile", ctrl.user.show);
router.post("/profile/edit", ctrl.user.update);
router.delete("/profile/delete", ctrl.user.destroy);

module.exports = router;
