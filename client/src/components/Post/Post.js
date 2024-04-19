import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const POST_PUBLISH = gql`
  mutation PostPublish($postId: ID!) {
    postPublish(postId: $postId) {
      post {
        title
      }
      userErrors {
        message
      }
    }
  }
`;

const POST_UNPUBLISH = gql`
  mutation PostUnPublish($postId: ID!) {
    postUnPublish(postId: $postId) {
      post {
        title
      }
      userErrors {
        message
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [postPublish, { data, loading }] = useMutation(POST_PUBLISH);
  const [postUnPublish, { data: unPublishData, loading: unPublishLoading }] =
    useMutation(POST_UNPUBLISH);

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <p
          className="Post__publish"
          onClick={() => {
            postPublish({
              variables: { postId: id },
            });
          }}
        >
          Publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p
          className="Post__publish"
          onClick={() => {
            postUnPublish({
              variables: { postId: id },
            });
          }}
        >
          Unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
