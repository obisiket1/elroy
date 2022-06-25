import chai_ from "chai";
import chaiHttp from "chai-http";
import Sinonchai from "sinon-chai";
import userUtils from "../../utils/user.utils.js";
import Users_ from "../../db/models/user.model.js";
import mongoose from "mongoose";

import app_ from "../../index.js";

chai_.should();
chai_.use(Sinonchai);
chai_.use(chaiHttp);

const validUser_ = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@mail.com",
  password: "12345678",
};
const validToken_ = userUtils.generateToken(validUser_._id, validUser_.firstName);

export const chai = chai_;
export const app = app_;
export const validUser = validUser_;
export const validToken = validToken_;
export const Users = Users_;
