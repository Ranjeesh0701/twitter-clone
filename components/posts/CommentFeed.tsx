"use client";

import { comment } from "postcss";
import CommentItem from "./CommentItem";

interface CommentFeedProps {
  comments?: Record<string, any>[];
}

export const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem key={comment.id} data={comment} />
      ))}
    </>
  );
};
