"use client";

import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Container, Header } from "../style";
import { ArrowRight } from "lucide-react";
import { ConnectBox, ConnectItem } from "./style";

export default function Register() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte a sua agenda.</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            <Button variant="secondary" size="sm">
              Conectar
              <ArrowRight />
            </Button>
          </ConnectItem>

          <Button type="submit">
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Header>
    </Container>
  );
}
