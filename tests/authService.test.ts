import mongoose from "mongoose";
import User from "../src/models/userModel";
import * as AuthService from "../src/services/authService";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
  });

  describe("register", () => {
    it("should throw an error if user already exists", async () => {
      const mockedUser = new User({
        firstname: "Jane",
        lastname: "Smith",
        job: "Tester",
        email: "existing@example.com",
        password: "hashedPassword",
      });

      await mockedUser.save();

      await expect(
        AuthService.register(
          "Jane",
          "Smith",
          "Tester",
          "existing@example.com",
          "password",
        ),
      ).rejects.toThrow("Utilisateur déjà existant");
    });
  });

  describe("login", () => {
    it("should throw an error if user is not found", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      await expect(
        AuthService.login("nonexistent@example.com", "password"),
      ).rejects.toThrow("Utilisateur non trouvé");
      expect(User.findOne).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
    });
  });
});
