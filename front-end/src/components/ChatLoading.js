import React from "react";
import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </Stack>
  );
};

export default ChatLoading;
