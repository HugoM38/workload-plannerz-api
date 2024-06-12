import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (firstname: string, lastname: string, job: string, email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user) throw new Error('User already exists');
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ firstname, lastname, job, email, password: hashedPassword });
  return await newUser.save();
};

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { token, user };
};

export { register, login };