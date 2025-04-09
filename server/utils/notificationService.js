const User = require("../models/User");
const sendNotificationEmail = require("./sendNotificationEmail");
const { io } = require("../server");

const createNotification = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const newNotification = {
      ...notification,
      createdAt: new Date(),
      read: false,
    };

    user.notifications.unshift(newNotification);
    await user.save();

    // Try-catch to handle any socket.io errors in serverless
    try {
      // Send real-time notification (safe with our mock io in serverless)
      io.to(userId).emit("notification", newNotification);
    } catch (socketError) {
      console.error("Socket notification error:", socketError);
      // Continue execution - don't let socket errors disrupt the flow
    }

    // Send email if user has enabled relevant notification
    try {
      if (
        user.emailPreferences &&
        user.emailPreferences[getEmailPreferenceKey(notification.type)]
      ) {
        await sendNotificationEmail(
          user.email,
          getNotificationEmailSubject(notification.type),
          notification.text
        );
      }
    } catch (emailError) {
      console.error("Email notification error:", emailError);
      // Continue execution - don't let email errors disrupt the flow
    }

    return newNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Return null instead of throwing to prevent function failures
    return null;
  }
};

const getEmailPreferenceKey = (type) => {
  const preferenceMap = {
    follow: "newFollower",
    like: "blogLiked",
    comment: "newComment",
    mention: "newComment",
  };
  return preferenceMap[type] || "blogLiked";
};

const getNotificationEmailSubject = (type) => {
  const subjectMap = {
    follow: "New Follower on BlogVerse",
    like: "Someone liked your post",
    comment: "New comment on your post",
    mention: "You were mentioned in a comment",
  };
  return subjectMap[type] || "New notification from BlogVerse";
};

module.exports = {
  createNotification,
};
