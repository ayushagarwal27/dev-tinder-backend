const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  const fromUserId = req.user.userId;
  const { toUserId } = req.params;
  const { status } = req.params;

  // self connection check
  if (fromUserId === toUserId) {
    res
      .status(400)
      .json({ message: "Cannot send connection request to yourself" });
    return;
  }

  const allowedStatus = ["ignored", "interested"];
  if (!allowedStatus.includes(status)) {
    res.status(400).json({ message: "Invalid Status Type: " + status });
    return;
  }

  try {
    // check to user ID
    const toUserInDb = await User.findOne({ _id: toUserId });
    if (!toUserInDb) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check for existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      res.status(400).json({ message: "Connection request already exists" });
      return;
    }

    const connectionRequestSaved = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });
    res.json(connectionRequestSaved);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/review/:status/:requestId", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const { requestId } = req.params;
  const { status } = req.params;

  const allowedStatus = ["accepted", "rejected"];
  if (!allowedStatus.includes(status)) {
    res.status(400).json({ message: "Invalid Status Type: " + status });
    return;
  }
  const connectionRequestInDb = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser.userId,
    status: "interested",
  });

  if (!connectionRequestInDb) {
    res.status(404).json({ message: "Connection request not found" });
    return;
  }

  try {
    const data = await ConnectionRequest.findByIdAndUpdate(
      { _id: requestId },
      { status },
    );
    res
      .status(200)
      .json({ message: "Connection request " + status, data }, { new: true });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
