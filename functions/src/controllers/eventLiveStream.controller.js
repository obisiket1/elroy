import EventLiveStream from '../db/models/eventLiveStream.model.js'
import Event from "../db/models/event.model.js";
import Response from '../utils/response.utils.js'
import Mux from '@mux/mux-node';
import dotenv from "dotenv";

dotenv.config();

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);
const { Webhooks } = Mux;

const webhookSecret = process.env.WEBHOOK_SECRET;
// bodyParser.raw({ type: 'application/json' });

export default class EventLiveStreamController {
  static async getStreamDetails (req, res) {
    try {
      const { eventId } = req.params;
      const eventLiveStream = await EventLiveStream.findOne({ eventId });

      return Response.Success(res, {
        eventLiveStream,
      });
      
    } catch (error) {
      Response.InternalServerError(res, 'Error adding stream')
    }
  };

  static async addLiveStream (req, res) {
    try {
      const { eventId } = req.params;
      const { id: userId } = req.data;

      const liveStream = await EventLiveStream.findOne({
        eventId: eventId,
      });

      const event = await Event.findById(eventId);

      if (liveStream) {
        return Response.BadRequestError(res, "live stream already existing")
      }

      const lstream = await Video.LiveStreams.create({
        new_asset_settings: { playback_policy: 'public' },
        playback_policy: 'public',
      });

      if (!lstream) {
        return Response.InternalServerError(res, "live stream could not be created")
      }

      const eventLiveStream = await EventLiveStream.create({
        playbackIds: lstream.playback_ids.map((e) => e.id),
        streamKey: lstream.stream_key,
        status: lstream.status,
        title: req.body.title || `${event.title} - LiveStream`,
        streamId: lstream.id,
        eventId,
        userId
      });

      return Response.Success(res, {
        eventLiveStream, 
        streamRMTPs: [
          `rtmps://global-live.mux.com:443/app/${lstream.stream_key}`,
          `rtmps://global-live.mux.com/app/${lstream.stream_key}`
        ] 
      });

    } catch (err) {
      console.log(err );
      Response.InternalServerError(res, 'Error adding stream')
    }
  }

  static async deleteLiveStream (req, res) {
    try {
      const { eventId } = req.params;

      await EventLiveStream.deleteOne({
        eventId: eventId,
      });

      return Response.Success(res, "livestream deleted successfully")
    } catch (err) {
      Response.InternalServerError(res, err)
    }
  }

  static async webhookStream (req, res) {
    try {
      const sig = req.headers['mux-signature'];
      // will raise an exception if the signature is invalid
      const isValidSignature = Webhooks.verifyHeader(
        req.body,
        sig,
        webhookSecret
      );
      console.log('Success:', isValidSignature);
      // convert the raw req.body to JSON, which is originally Buffer (raw)
      const jsonFormattedBody = JSON.parse(req.body);

      switch (jsonFormattedBody.type) {
        case "video.live_stream.created":
          EventLiveStreamController.handleStreamCreated(jsonFormattedBody);
          break;

        case "video.live_stream.active": 
          EventLiveStreamController.handleStreamIsReady(jsonFormattedBody);
          break;

        case "video.live_stream.deleted":
          EventLiveStreamController.handleStreamDeleted(jsonFormattedBody);
          break;

        default:
          break;
      }
      // await doSomething();
      res.json({ received: true });
    } catch (err) {
      // On error, return the error message
      return res.status(400).send(`Webhook Error: ${err.message}`);
    };
  }

  static handleStreamCreated (request) {}
  static handleStreamDeleted (request) {}

  static async handleStreamIsReady (request) {
    const eventStream = await EventLiveStream.findOne({
      streamKey: request.stream_key
    });

    if (!eventStream) {
      return console.log("no stream found");
    }

    await EventLiveStream.updateOne({ _id: eventStream._id }, {
      state: "active"
    });
  }
}
