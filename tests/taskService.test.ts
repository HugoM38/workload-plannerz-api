import { mock, instance, when, verify, anything, reset } from "ts-mockito";
import mongoose from "mongoose";
import Task from "../src/models/taskModel";
import Team from "../src/models/teamModel";
import userModel from "../src/models/userModel";
import {
  createTask,
  getTasksOfATeamByUserId,
  getTasksOfATeamById,
} from "../src/services/taskService";

describe("TaskService", () => {
  let taskId: string;
  let taskObjectId: mongoose.Types.ObjectId;
  let teamId: string;
  let teamObjectId: mongoose.Types.ObjectId;
  let userId: string;
  let userObjectId: mongoose.Types.ObjectId;

  beforeAll(() => {
    taskId = "60d0fe4f5311236168a109cb";
    taskObjectId = new mongoose.Types.ObjectId(taskId);
    teamId = "60d0fe4f5311236168a109cc";
    teamObjectId = new mongoose.Types.ObjectId(teamId);
    userId = "60d0fe4f5311236168a109ca";
    userObjectId = new mongoose.Types.ObjectId(userId);
  });

  beforeEach(() => {
    reset();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof userModel>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };
      when(mockedTeamModel.findOne(anything())).thenResolve(teamStub);

      const userStub: any = {
        _id: userObjectId,
      };
      when(mockedUserModel.findOne(anything())).thenResolve(userStub);

      Team.findOne = instance(mockedTeamModel).findOne;
      userModel.findOne = instance(mockedUserModel).findOne;

      const saveMock = jest.fn().mockResolvedValue({
        _id: taskObjectId,
        name: "Test Task",
        owner: userObjectId,
        team: teamObjectId,
        priority: 1,
        timeEstimation: 5,
        dueDate: Date.now() + 86400000,
        state: "En cours",
        creationDate: Date.now(),
      });

      Task.prototype.save = saveMock;

      const task = await createTask(
        "Test Task",
        userId,
        teamId,
        1,
        5,
        Date.now() + 86400000,
        userId,
      );

      expect(task).toBeDefined();
      expect(task.name).toBe("Test Task");
      verify(mockedTeamModel.findOne(anything())).once();
      verify(mockedUserModel.findOne(anything())).once();
      expect(saveMock).toHaveBeenCalled();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findOne(anything())).thenResolve(null);

      Team.findOne = instance(mockedTeamModel).findOne;

      await expect(
        createTask(
          "Test Task",
          userId,
          teamId,
          1,
          5,
          Date.now() + 86400000,
          userId,
        ),
      ).rejects.toThrow("Équipe non trouvée");

      verify(mockedTeamModel.findOne(anything())).once();
    });

    it("should throw an error if user is not a member of the team", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };
      when(mockedTeamModel.findOne(anything())).thenResolve(teamStub);

      Team.findOne = instance(mockedTeamModel).findOne;

      await expect(
        createTask(
          "Test Task",
          userId,
          teamId,
          1,
          5,
          Date.now() + 86400000,
          userId,
        ),
      ).rejects.toThrow("Vous n'êtes pas membre de cette équipe");

      verify(mockedTeamModel.findOne(anything())).once();
    });

    it("should throw an error if due date is in the past", async () => {
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };
      when(mockedTeamModel.findOne(anything())).thenResolve(teamStub);

      Team.findOne = instance(mockedTeamModel).findOne;

      await expect(
        createTask(
          "Test Task",
          userId,
          teamId,
          1,
          5,
          Date.now() - 86400000,
          userId,
        ),
      ).rejects.toThrow("La date d'échéance doit être après la date actuelle");

      verify(mockedTeamModel.findOne(anything())).once();
    });

    it("should throw an error if owner is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof userModel>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };
      when(mockedTeamModel.findOne(anything())).thenResolve(teamStub);

      when(mockedUserModel.findOne(anything())).thenResolve(null);

      Team.findOne = instance(mockedTeamModel).findOne;
      userModel.findOne = instance(mockedUserModel).findOne;

      await expect(
        createTask(
          "Test Task",
          "111111111111111111111111",
          teamId,
          1,
          5,
          Date.now() + 86400000,
          userId,
        ),
      ).rejects.toThrow("Utilisateur non trouvé");

      verify(mockedTeamModel.findOne(anything())).once();
      verify(mockedUserModel.findOne(anything())).once();
    });
  });

  describe("getTasksOfATeamByUserId", () => {
    it("should return tasks for a valid user and team", async () => {
      const mockedTaskModel = mock<typeof Task>();
      const mockedTeamModel = mock<typeof Team>();
      const mockedUserModel = mock<typeof userModel>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };
      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      const userStub: any = {
        _id: userObjectId,
      };
      when(mockedUserModel.findOne(anything())).thenResolve(userStub);

      const taskStub: any = {
        _id: taskObjectId,
        name: "Test Task",
        owner: userObjectId,
        team: teamObjectId,
        priority: 1,
        timeEstimation: 5,
        dueDate: Date.now() + 86400000,
        state: "En cours",
        creationDate: Date.now(),
      };
      when(mockedTaskModel.find(anything())).thenResolve([taskStub]);

      Task.find = instance(mockedTaskModel).find;
      Team.findById = instance(mockedTeamModel).findById;
      userModel.findOne = instance(mockedUserModel).findOne;

      const tasks = await getTasksOfATeamByUserId(userId, teamId, userId);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe("Test Task");
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedUserModel.findOne(anything())).once();
      verify(mockedTaskModel.find(anything())).once();
    });

    it("should throw an error if user is not found", async () => {
      const mockedUserModel = mock<typeof userModel>();

      when(mockedUserModel.findOne(anything())).thenResolve(null);

      userModel.findOne = instance(mockedUserModel).findOne;

      await expect(
        getTasksOfATeamByUserId(userId, teamId, userId),
      ).rejects.toThrow("Utilisateur non trouvé");

      verify(mockedUserModel.findOne(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedUserModel = mock<typeof userModel>();
      const mockedTeamModel = mock<typeof Team>();

      const userStub: any = {
        _id: userObjectId,
      };
      when(mockedUserModel.findOne(anything())).thenResolve(userStub);

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      userModel.findOne = instance(mockedUserModel).findOne;
      Team.findById = instance(mockedTeamModel).findById;

      await expect(
        getTasksOfATeamByUserId(userId, teamId, userId),
      ).rejects.toThrow("Équipe non trouvée");

      verify(mockedUserModel.findOne(anything())).once();
      verify(mockedTeamModel.findById(anything())).once();
    });

    it("should throw an error if requester is not a member of the team", async () => {
      const mockedUserModel = mock<typeof userModel>();
      const mockedTeamModel = mock<typeof Team>();

      const userStub: any = {
        _id: userObjectId,
      };
      when(mockedUserModel.findOne(anything())).thenResolve(userStub);

      const teamStub: any = {
        _id: teamObjectId,
        members: [],
      };
      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      userModel.findOne = instance(mockedUserModel).findOne;
      Team.findById = instance(mockedTeamModel).findById;

      await expect(
        getTasksOfATeamByUserId(userId, teamId, userId),
      ).rejects.toThrow("Vous n'êtes pas membre de cette équipe");

      verify(mockedUserModel.findOne(anything())).once();
      verify(mockedTeamModel.findById(anything())).once();
    });
  });

  describe("TaskService - getTasksOfATeamById", () => {
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

    it("should return tasks for a valid team and requester", async () => {
      const mockedTaskModel = mock<typeof Task>();
      const mockedTeamModel = mock<typeof Team>();

      const teamStub: any = {
        _id: teamObjectId,
        members: [userObjectId],
      };
      when(mockedTeamModel.findById(anything())).thenResolve(teamStub);

      const taskStub: any = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Task",
        owner: userObjectId,
        team: teamObjectId,
        priority: 1,
        timeEstimation: 5,
        dueDate: Date.now() + 86400000,
        state: "En cours",
        creationDate: Date.now(),
      };
      when(mockedTaskModel.find(anything())).thenResolve([taskStub]);

      Team.findById = instance(mockedTeamModel).findById;
      Task.find = instance(mockedTaskModel).find;

      const tasks = await getTasksOfATeamById(teamId, userId);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe("Test Task");
      verify(mockedTeamModel.findById(anything())).once();
      verify(mockedTaskModel.find(anything())).once();
    });

    it("should throw an error if team is not found", async () => {
      const mockedTeamModel = mock<typeof Team>();

      when(mockedTeamModel.findById(anything())).thenResolve(null);

      Team.findById = instance(mockedTeamModel).findById;

      await expect(getTasksOfATeamById(teamId, userId)).rejects.toThrow(
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

      await expect(getTasksOfATeamById(teamId, userId)).rejects.toThrow(
        "Vous n'êtes pas membre de cette équipe",
      );

      verify(mockedTeamModel.findById(anything())).once();
    });
  });
});
