const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

const USER_DATA_TO_SEND = [
  "firstName",
  "lastName",
  "avatar_url",
  "skills",
  "gender",
  "about",
  "age",
];

// Get all the pending connection request for loggedIn user
router.get("/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser.userId,
      status: "interested",
    }).populate("fromUserId", USER_DATA_TO_SEND);

    res.status(200).json({ data: connectionRequest });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser.userId, status: "accepted" },
        { toUserId: loggedInUser.userId, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "avatar_url"])
      .populate("toUserId", ["firstName", "lastName", "avatar_url"]);

    const data = connectionRequests.map((row) => {
      return row.fromUserId._id.toString() === loggedInUser.userId.toString()
        ? row.toUserId
        : row.fromUserId;
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser.userId },
        { toUserId: loggedInUser.userId },
      ],
    }).select(["fromUserId", "toUserId"]);

    const usersWithRequestConnectionCreated = new Set();
    connectionRequests.forEach((row) => {
      usersWithRequestConnectionCreated.add(row.fromUserId.toString());
      usersWithRequestConnectionCreated.add(row.toUserId.toString());
    });

    usersWithRequestConnectionCreated.add(loggedInUser.userId.toString());

    const users = await User.find({
      _id: { $nin: Array.from(usersWithRequestConnectionCreated) },
    }).select(USER_DATA_TO_SEND);

    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
