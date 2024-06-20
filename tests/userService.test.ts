import { mock, instance, when, verify, anyString, anything } from "ts-mockito";
import mongoose from "mongoose";
import userModel, { IUser } from "../src/models/userModel";
import Team, { ITeam } from "../src/models/teamModel";
import { getTeamsByUser, getUserById } from "../src/services/userService";

describe("UserService", () => {
  let userId: string;
  let userObjectId: mongoose.Types.ObjectId;

  beforeAll(() => {
    userId = "60d0fe4f5311236168a109ca";
    userObjectId = new mongoose.Types.ObjectId(userId);
  });

  describe("getTeamsByUser", () => {
    it("should return teams for a valid user", async () => {
      // Mock userModel and Team
      const mockedUserModel = mock<typeof userModel>();
      const mockedTeamModel = mock<typeof Team>();

      // Create a user stub that matches the IUser interface and mongoose.Document
      const mockedUser: any = {
        _id: userObjectId,
        firstname: "John",
        lastname: "Doe",
        job: "Developer",
        email: "john.doe@example.com",
        password: "password",
      };

      when(mockedUserModel.findOne(anything())).thenResolve(mockedUser);

      // Create a team stub that matches the ITeam interface and mongoose.Document
      const mockedTeam: any = {
        _id: new mongoose.Types.ObjectId(),
        name: "Team A",
        owner: userObjectId,
        members: [userObjectId],
      };

      when(mockedTeamModel.find(anything())).thenResolve([mockedTeam]);

      // Use the mocked instances
      userModel.findOne = instance(mockedUserModel).findOne;
      Team.find = instance(mockedTeamModel).find;

      const teams = await getTeamsByUser(userId);

      expect(teams).toHaveLength(1);
      expect(teams[0].name).toBe("Team A");

      verify(mockedUserModel.findOne(anything())).once();
      verify(mockedTeamModel.find(anything())).once();
    });

    it("should throw an error if user is not found", async () => {
      const mockedUserModel = mock<typeof userModel>();

      when(mockedUserModel.findOne(anything())).thenResolve(null);

      userModel.findOne = instance(mockedUserModel).findOne;

      await expect(getTeamsByUser(userId)).rejects.toThrow(
        "Utilisateur non trouvé",
      );

      verify(mockedUserModel.findOne(anything())).once();
    });
  });

  describe("getUserById", () => {
    it("should return user for a valid userId", async () => {
      const mockedUserModel = mock<typeof userModel>();

      const mockedUser: any = {
        _id: userObjectId,
        firstname: "John",
        lastname: "Doe",
        job: "Developer",
        email: "john.doe@example.com",
        password: "password",
      };

      when(mockedUserModel.findOne(anything())).thenResolve(mockedUser);

      userModel.findOne = instance(mockedUserModel).findOne;

      const user = await getUserById(userId);

      expect(user).toBeDefined();
      expect(user.email).toBe("john.doe@example.com");

      verify(mockedUserModel.findOne(anything())).once();
    });

    it("should throw an error if user is not found", async () => {
      const mockedUserModel = mock<typeof userModel>();

      when(mockedUserModel.findOne(anything())).thenResolve(null);

      userModel.findOne = instance(mockedUserModel).findOne;

      await expect(getUserById(userId)).rejects.toThrow(
        "Utilisateur non trouvé",
      );

      verify(mockedUserModel.findOne(anything())).once();
    });
  });
});
