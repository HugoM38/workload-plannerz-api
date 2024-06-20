import { mock, instance, when, verify, anything, reset } from "ts-mockito";
import mongoose from "mongoose";
import Team, { ITeam } from "../src/models/teamModel";
import User, { IUser } from "../src/models/userModel";
import Task from "../src/models/taskModel";
import {
  createTeam,
  getTeamMembersById,
  getNonMembersInTeam,
  getMemberWorkloadById,
  getTeamWorkloadById,
} from "../src/services/teamService";

describe("TeamService", () => {
  let teamId: string;
  let teamObjectId: mongoose.Types.ObjectId;
  let userId: string;
  let userObjectId: mongoose.Types.ObjectId;
  let newMemberId: string;
  let newMemberObjectId: mongoose.Types.ObjectId;

  beforeAll(() => {
    teamId = "60d0fe4f5311236168a109cc";
    teamObjectId = new mongoose.Types.ObjectId(teamId);
    userId = "60d0fe4f5311236168a109ca";
    userObjectId = new mongoose.Types.ObjectId(userId);
    newMemberId = "60d0fe4f5311236168a109cd";
    newMemberObjectId = new mongoose.Types.ObjectId(newMemberId);
  });

  beforeEach(() => {
    reset();
  });

  describe("createTeam", () => {
    it("should create a team successfully", async () => {
      const mockedUserModel = mock<typeof User>();
      const mockedTeamModel = mock<ITeam>();

      when(mockedUserModel.findOne(anything())).thenResolve({
        _id: userObjectId,
      } as mongoose.Document<unknown, {}, IUser> &
        IUser & { _id: mongoose.Types.ObjectId });

      when(mockedTeamModel.save()).thenResolve({
        _id: teamObjectId,
        name: "Test Team",
        owner: userObjectId,
        members: [userObjectId],
      } as mongoose.Document<unknown, {}, ITeam> &
        ITeam & { _id: mongoose.Types.ObjectId });

      User.findOne = instance(mockedUserModel).findOne;
      Team.prototype.save = instance(mockedTeamModel).save;

      const team = await createTeam("Test Team", userId);

      expect(team).toBeDefined();
      expect(team.name).toBe("Test Team");
      expect(team.owner).toBe(userObjectId);
      expect(team.members).toContain(userObjectId);
      verify(mockedUserModel.findOne(anything())).once();
      verify(mockedTeamModel.save()).once();
    });

    it("should throw an error if user is not found", async () => {
      const mockedUserModel = mock<typeof User>();

      when(mockedUserModel.findOne(anything())).thenResolve(null);

      User.findOne = instance(mockedUserModel).findOne;

      await expect(createTeam("Test Team", userId)).rejects.toThrow(
        "Utilisateur non trouvé",
      );

      verify(mockedUserModel.findOne(anything())).once();
    });
  });
  describe("getTeamMembersById", () => {
    let teamId: string;
    let teamObjectId: mongoose.Types.ObjectId;
    let userId: string;
    let userObjectId: mongoose.Types.ObjectId;

    beforeAll(() => {
      teamId = "60d0fe4f5311236168a109cc";
      teamObjectId = new mongoose.Types.ObjectId(teamId);
      userId = "60d0fe4f5311236168a109ca";
      userObjectId = new mongoose.Types.ObjectId(userId);
    });

    beforeEach(() => {
      reset();
    });

    it("should return team members successfully", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof User>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };

      const userStub: any = {
        _id: userObjectId,
        firstname: "John",
        lastname: "Doe",
        job: "Developer",
        email: "john.doe@example.com",
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedUserModel.find(anything())).thenResolve([userStub]);

      Team.findById = instance(mockedTeamModel).findById;
      User.find = instance(mockedUserModel).find;

      const members = await getTeamMembersById(teamId, userId);

      expect(members).toBeDefined();
      expect(members).toHaveLength(1);
      expect(members[0].email).toBe("john.doe@example.com");
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.find(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getTeamMembersById(teamId, userId)).rejects.toThrow(
        "Équipe non trouvée",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if requester is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getTeamMembersById(teamId, userId)).rejects.toThrow(
        "Vous n'êtes pas membre de cette équipe",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });
  });

  describe("getNonMembersInTeam", () => {
    let teamId: string;
    let teamObjectId: mongoose.Types.ObjectId;
    let userId: string;
    let userObjectId: mongoose.Types.ObjectId;
    let nonMemberId: string;
    let nonMemberObjectId: mongoose.Types.ObjectId;

    beforeAll(() => {
      teamId = "60d0fe4f5311236168a109cc";
      teamObjectId = new mongoose.Types.ObjectId(teamId);
      userId = "60d0fe4f5311236168a109ca";
      userObjectId = new mongoose.Types.ObjectId(userId);
      nonMemberId = "60d0fe4f5311236168a109cd";
      nonMemberObjectId = new mongoose.Types.ObjectId(nonMemberId);
    });

    beforeEach(() => {
      reset();
    });

    it("should return non-members of the team successfully", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof User>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };

      const nonMemberStub: any = {
        _id: nonMemberObjectId,
        firstname: "Jane",
        lastname: "Doe",
        job: "Designer",
        email: "jane.doe@example.com",
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedUserModel.find(anything())).thenResolve([nonMemberStub]);

      Team.findById = instance(mockedTeamModel).findById;
      User.find = instance(mockedUserModel).find;

      const nonMembers = await getNonMembersInTeam(teamId, userId);

      expect(nonMembers).toBeDefined();
      expect(nonMembers).toHaveLength(1);
      expect(nonMembers[0].email).toBe("jane.doe@example.com");
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.find(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getNonMembersInTeam(teamId, userId)).rejects.toThrow(
        "Équipe non trouvée",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if requester is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getNonMembersInTeam(teamId, userId)).rejects.toThrow(
        "Vous n'êtes pas membre de cette équipe",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });
  });
  describe("getMemberWorkloadById", () => {
    let teamId: string;
    let teamObjectId: mongoose.Types.ObjectId;
    let userId: string;
    let userObjectId: mongoose.Types.ObjectId;
    let requesterId: string;
    let requesterObjectId: mongoose.Types.ObjectId;

    beforeAll(() => {
      teamId = "60d0fe4f5311236168a109cc";
      teamObjectId = new mongoose.Types.ObjectId(teamId);
      userId = "60d0fe4f5311236168a109ca";
      userObjectId = new mongoose.Types.ObjectId(userId);
      requesterId = "60d0fe4f5311236168a109cb";
      requesterObjectId = new mongoose.Types.ObjectId(requesterId);
    });

    beforeEach(() => {
      reset();
    });

    it("should return the workload of a member successfully", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof User>();
      const mockedTaskModel = mock<typeof Task>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId, requesterObjectId],
      };

      const userStub: any = {
        _id: userObjectId,
      };

      const taskStub: any = [
        {
          _id: new mongoose.Types.ObjectId(),
          owner: userObjectId,
          team: teamObjectId,
          timeEstimation: 5,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          owner: userObjectId,
          team: teamObjectId,
          timeEstimation: 3,
        },
      ];

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedUserModel.findById(anything())).thenResolve(userStub);
      when(mockedTaskModel.find(anything())).thenResolve(taskStub);

      Team.findById = instance(mockedTeamModel).findById;
      User.findById = instance(mockedUserModel).findById;
      Task.find = instance(mockedTaskModel).find;

      const workload = await getMemberWorkloadById(teamId, userId, requesterId);

      expect(workload).toBe(8);
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.findById(anything())).once();
      verify(mockedTaskModel.find(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(
        getMemberWorkloadById(teamId, userId, requesterId),
      ).rejects.toThrow("Équipe non trouvée");

      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if requester is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(
        getMemberWorkloadById(teamId, userId, requesterId),
      ).rejects.toThrow("Vous n'êtes pas membre de cette équipe");

      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if user is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof User>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [requesterObjectId],
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedUserModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;
      User.findById = instance(mockedUserModel).findById;

      await expect(
        getMemberWorkloadById(teamId, userId, requesterId),
      ).rejects.toThrow("Utilisateur non trouvé");

      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.findById(anything())).once();
    });

    it("should throw an error if user is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof User>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [requesterObjectId],
      };

      const userStub: any = {
        _id: userObjectId,
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedUserModel.findById(anything())).thenResolve(userStub);

      Team.findById = instance(mockedTeamModel).findById;
      User.findById = instance(mockedUserModel).findById;

      await expect(
        getMemberWorkloadById(teamId, userId, requesterId),
      ).rejects.toThrow("L'utilisateur n'est pas membre de cette équipe");

      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.findById(anything())).once();
    });
  });
  describe("getTeamWorkloadById", () => {
    let teamId: string;
    let teamObjectId: mongoose.Types.ObjectId;
    let requesterId: string;
    let requesterObjectId: mongoose.Types.ObjectId;

    beforeAll(() => {
      teamId = "60d0fe4f5311236168a109cc";
      teamObjectId = new mongoose.Types.ObjectId(teamId);
      requesterId = "60d0fe4f5311236168a109cb";
      requesterObjectId = new mongoose.Types.ObjectId(requesterId);
    });

    beforeEach(() => {
      reset();
    });

    it("should return the workload of the team successfully", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedTaskModel = mock<typeof Task>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [requesterObjectId],
      };

      const taskStub: any = [
        {
          _id: new mongoose.Types.ObjectId(),
          team: teamObjectId,
          timeEstimation: 5,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          team: teamObjectId,
          timeEstimation: 3,
        },
      ];

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);
      when(mockedTaskModel.find(anything())).thenResolve(taskStub);

      Team.findById = instance(mockedTeamModel).findById;
      Task.find = instance(mockedTaskModel).find;

      const workload = await getTeamWorkloadById(teamId, requesterId);

      expect(workload).toBe(8);
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedTaskModel.find(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getTeamWorkloadById(teamId, requesterId)).rejects.toThrow(
        "Équipe non trouvée",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if requester is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };

      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getTeamWorkloadById(teamId, requesterId)).rejects.toThrow(
        "Vous n'êtes pas membre de cette équipe",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });
  });
});
