"use client";

import { ScheduleForm } from "./ScheduleForm";
import { Container, UserHeader } from "./style";
import { Avatar, Heading, Text } from "@ignite-ui/react";

interface ScheduleProps {
  user: {
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  };
}

export function Schedule({ user: { name, bio, avatarUrl } }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={avatarUrl} />
        <Heading>{name}</Heading>
        <Text>{bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  );
}
