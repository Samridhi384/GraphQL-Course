import { Context } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SECRET_KEY } from "../../keys";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayLoad {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayLoad> => {
    const { email, password } = credentials;
    const isValidEmail = validator.isEmail(email);

    if (!isValidEmail) {
      return {
        userErrors: [
          {
            message: "You should provide a vaild email",
          },
        ],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password",
          },
        ],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    return {
      userErrors: [],
      token: await JWT.sign(
        {
          userId: user.id,
        },
        JSON_SECRET_KEY,
        {
          expiresIn: 3600000,
        }
      ),
    };
  },

  signin: async (
    _: any,
    { credentials }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayLoad> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [{ message: "Invalid user credentials" }],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [{ message: "Invalid user credentials" }],
        token: null,
      };
    }

    return {
      userErrors: [],
      token: await JWT.sign({ userId: user.id }, JSON_SECRET_KEY, {
        expiresIn: 3600000,
      }),
    };
  },
};
