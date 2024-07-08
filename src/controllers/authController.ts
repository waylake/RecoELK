import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required" });
      return;
    }

    try {
      const user = await this.authService.registerUser(req.body);
      res
        .status(201)
        .json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.loginUser(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId; // Assuming you have middleware that adds userId to the request
      const user = await this.authService.getUserById(userId);
      if (user) {
        res.json({
          user: { _id: user._id, name: user.name, email: user.email },
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  };
}
