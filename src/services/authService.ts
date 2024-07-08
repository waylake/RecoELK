import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";

export class AuthService {
  public async registerUser(userData: Partial<IUser>): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    await user.save();
    return user;
  }

  public async loginUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }
}
