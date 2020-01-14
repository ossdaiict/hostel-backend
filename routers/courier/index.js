const express = require("express");

const Courier = require("../../models/courier");
const checkSupervisor = require("../../middleware/checkSupervisor");

const getCouriers = (req, res) => {
  Courier.find({ isCourierCollected: false })
    .select("-__v")
    .sort({ cdate: -1 })
    .then(couriers => {
      res.status(201).json(couriers);
    })
    .catch(err =>
      res.status(500).json({ message: "Failed to query database!.." })
    );
};

const addCourier = (req, res) => {
  const { cID, name, room, service, cdate, type } = req.body;
  Courier.create({ cID, cdate, service, type, name, room }, err => {
    if (err) {
      return res.status(500).json({ message: "Failed to add new snail!.." });
    } else {
      return res.status(201).json({ message: "New snail added." });
    }
  });
};

const removeCourier = (req, res) => {
  const { courierID } = req.body;
  Courier.findOneAndUpdate(
    { _id: courierID },
    { $set: { isCourierCollected: true } },
    { new: true }
  ).then(courier => {
    if (courier) {
      console.log(courier);
      return res
        .status(201)
        .json({ courier, message: "Removed Courier Successfully." });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to remove node courier!.." });
    }
  });
};

const router = express.Router();

router.get("/", getCouriers);
router.post("/add", checkSupervisor, addCourier);
router.post("/delete", checkSupervisor, removeCourier);

module.exports = router;
