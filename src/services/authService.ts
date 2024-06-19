import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (
  firstname: string,
  lastname: string,
  job: string,
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email });
  if (user) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    job,
    email,
    password: hashedPassword,
  });

  const userCreated = await newUser.save();

  const token = jwt.sign(
    { id: userCreated._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );


  return { token, user: userCreated };
};

const login = async (email: string, password: string) => {
  const findUser = await User.findOne({ email });
  if (!findUser) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: findUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );
  return { token, user: findUser };
};

export { register, login };
