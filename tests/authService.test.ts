import { mock } from 'ts-mockito';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../src/models/userModel';
import * as AuthService from '../src/services/authService';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('AuthService', () => {
    let mongoServer: MongoMemoryServer;
    let mockedUserModel: typeof User;

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
        mockedUserModel = mock<typeof User>();
        jest.clearAllMocks();
        await User.deleteMany({});
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@example.com',
                job: 'Developer',
                password: 'password123',
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

            const result = await AuthService.register(newUser.firstname, newUser.lastname, newUser.job, newUser.email, newUser.password);

            const userObject = result.user.toObject() as IUser; // Cast result.user.toObject() to IUser
            expect(userObject).toMatchObject({
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@example.com',
                job: 'Developer',
            });
            expect((userObject._id as mongoose.Types.ObjectId).toString()).toBe((result.user._id as mongoose.Types.ObjectId).toString());
            expect(result.token).toBe('mockedToken');
        });

        it('should throw an error if user already exists', async () => {
            const mockedUser = new User({
                firstname: 'Jane',
                lastname: 'Smith',
                job: 'Tester',
                email: 'existing@example.com',
                password: 'hashedPassword',
            });

            await mockedUser.save();

            await expect(AuthService.register('Jane', 'Smith', 'Tester', 'existing@example.com', 'password')).rejects.toThrow('User already exists');
        });
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            const userId = new mongoose.Types.ObjectId();
            const plainPassword = 'password';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValue({
                _id: userId,
                firstname: 'John',
                lastname: 'Doe',
                job: 'Developer',
                email: 'test@example.com',
            } as any);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

            const result = await AuthService.login('test@example.com', plainPassword);

            expect(result.token).toBe('mockedToken');
            expect(result.user).toBeTruthy(); // Ensure user object is truthy
            expect((result.user._id as mongoose.Types.ObjectId).toString()).toBe(userId.toString()); // Ensure userId is converted to string
            expect(result.user.firstname).toBe('John');
            expect(result.user.lastname).toBe('Doe');
            expect(result.user.job).toBe('Developer');
            expect(result.user.email).toBe('test@example.com');
            expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
        });

        it('should throw an error if user is not found', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);
            await expect(AuthService.login('nonexistent@example.com', 'password')).rejects.toThrow('User not found');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
        });

        it('should throw an error if credentials are invalid', async () => {
            const userId = new mongoose.Types.ObjectId();
            const hashedPassword = await bcrypt.hash('password123', 10); // Hash the password correctly

            const mockedUser = new User({
                _id: userId,
                email: 'test@example.com',
                password: hashedPassword,
                firstname: 'John',
                lastname: 'Doe',
                job: 'Tester',
            });
            await mockedUser.save();

            jest.spyOn(User, 'findOne').mockResolvedValue(mockedUser);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(AuthService.login('test@example.com', 'invalidPassword')).rejects.toThrow('Invalid credentials');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('invalidPassword', hashedPassword);
        });

    });
});