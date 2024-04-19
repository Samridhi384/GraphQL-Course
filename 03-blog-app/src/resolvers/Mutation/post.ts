import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayLoadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "User UnAuthenticated",
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You should provide both a title and contents",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    };
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "User UnAuthenticated",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "You should provide either a title or contents to update",
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "No post found",
          },
        ],
        post: null,
      };
    }

    const payloadToUpdate: { title?: string; content?: string } = {};

    if (title) {
      payloadToUpdate.title = title;
    }

    if (content) {
      payloadToUpdate.content = content;
    }
    // let payloadToUpdate = {
    //   title,
    //   content,
    // };

    // if (!title) delete payloadToUpdate.title;
    // if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: payloadToUpdate,
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postDelete: async (
    _: any,
    { postId }: { postId: String },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "User UnAuthenticated",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "No post found",
          },
        ],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post: existingPost,
    };
  },

  postPublish: async (
    _: any,
    { postId }: { postId: String },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "User UnAuthenticated",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: true,
        },
      }),
    };
  },

  postUnPublish: async (
    _: any,
    { postId }: { postId: String },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "User UnAuthenticated",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: false,
        },
      }),
    };
  },
};
