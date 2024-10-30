const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

// Get all the pending connection request for loggedIn user
router.get("/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser.userId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "avatar_url",
      "skills",
      "gender",
      "about",
      "age",
    ]);

    res.status(200).json({ data: connectionRequest });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser.userId, status: "accepted" },
        { toUserId: loggedInUser.userId, status: "accepted" },
      ],
    }).populate("fromUserId", ["firstName", "lastName", "avatar_url"]);

    res.status(200).json({ data: connectionRequest });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = router;
