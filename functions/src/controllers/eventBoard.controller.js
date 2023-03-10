import EventBoard from "../db/models/eventBoard.model.js";
import Response from "../utils/response.utils.js";
import StorageUtils from "../utils/storage.utils.js";

export default class EventBoardController {
  static async addBoard(req, res) {
    try {
      const { type, name, content: content_ } = req.body;
      const { eventId } = req.params;
      const { id: userId } = req.data;

      let content = content_;

      if (type !== "note") {
        let file = await StorageUtils.uploadFile(
          req.files[type][0],
          `events/${eventId}/boards/${type}s`
        );
        content = file.Location;
      }

      const eventBoard = await EventBoard.create({
        type,
        name,
        eventId,
        userId,
        content,
      });
      Response.Success(res, { eventBoard });
    } catch (err) {
      Response.InternalServerError(res, "Error adding event board");
    }
  }

  static async editBoard(req, res) {
    try {
      const { type, name, content: content_ } = req.body;
      const { eventId, eventBoardId } = req.params;

      let content = content_;

      if (type !== "note") {
        let file = await StorageUtils.uploadFile(
          req.files[type][0],
          `events/${eventId}/boards/${type}s`
        );
        content = file.Location;
      }

      const eventBoard = await EventBoard.findByIdAndUpdate(eventBoardId, {
        type,
        name,
        eventId,
        content,
      });
      Response.Success(res, { eventBoard });
    } catch (err) {
      console.log(err);
      Response.InternalServerError(res, "Error editing event board");
    }
  }

  static async fetchBoard(req, res) {
    try {
      const { eventId, eventBoardId: _id } = req.params;

      const eventBoard = await EventBoard.findOne({ eventId, _id });

      Response.Success(res, { eventBoard });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching event boards");
    }
  }

  static async fetchBoards(req, res) {
    try {
      const { eventId } = req.params;

      const eventBoards = await EventBoard.find({ eventId });

      Response.Success(res, { eventBoards });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching event boards");
    }
  }

  static async deleteBoard(req, res) {
    try {
      const { eventBoardId } = req.params;

      const deletedEventBoard = await EventBoard.findByIdAndDelete(
        eventBoardId
      );

      Response.Success(res, { deletedEventBoard });
    } catch (err) {
      Response.InternalServerError(res, "Error deleting event board");
    }
  }

  static async deleteBoards(req, res) {
    try {
      const { eventBoardIds } = req.body;
      const { eventId } = req.params;
      const { id: userId } = req.data;

      const deletedEventBoards = await EventBoard.deleteMany({
        userId,
        _id: { $in: eventBoardIds },
      });
      const { deletedCount: count } = deletedEventBoards;
      const diff = eventBoardIds.length - count;

      Response.Success(res, {
        message: `${count} event board(s) deleted successfully.${
          diff !== 0
            ? ` ${diff} event board(s) could not be deleted likely because you're not the creator`
            : ""
        }`,
      });
    } catch (err) {
      Response.InternalServerError(res, "Error deleting event boards");
    }
  }
}
