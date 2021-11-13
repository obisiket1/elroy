import Response from "../utils/response.utils";
import Events from "../db/models/event.model";
import Follow from "../db/models/follow.model";

export default class AnalyticsController {
  static async fetchAnalytics(req, res) {
    try {
      const { id: userId } = req.data;

      const events = await Events.find({ userId }).populate("attendanceCount");

      const reviewsCount = events.reduce(
        (val, a) => val + a.reviewsCount || 0,
        0
      );
      const likesCount = events.reduce((val, a) => val + a.likesCount || 0, 0);
      const viewsCount = events.reduce((val, a) => val + a.viewsCount || 0, 0);

      const followersCount = await Follow.countDocuments({
        followedUserId: userId,
      });

      Response.Success(res, {
        analytics: {
          eventsCount: events.length,
          likesCount,
          reviewsCount,
          viewsCount,
          followersCount,
        },
      });
    } catch (err) {
      console.log(err);
      Response.InternalServerError(res, "Error fetching analytics");
    }
  }
}
