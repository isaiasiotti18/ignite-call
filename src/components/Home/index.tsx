"use client";

import { Heading, Text } from "@ignite-ui/react";

import { Container, Hero, Preview } from "./style";

import Image from "next/image";

import PreviewImg from "../../../public/assets/app-preview.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";

export default function HomeComponent() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado.</Heading>
        <Text size="lg">
          Conecte o seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={PreviewImg}
          height={400}
          quality={100}
          priority
          alt="Imagem que mostrando a aplicação por dentro."
        />
      </Preview>
    </Container>
  );
}
