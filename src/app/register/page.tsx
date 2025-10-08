"use client";

import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, Header } from "./style";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Register() {
  const {} = useForm();
  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form">
        <label>
          <Text>Nome de usuário</Text>
          <TextInput prefix="ignite.com/" placeholder="username" />
        </label>

        <label>
          <Text>Nome completo</Text>
          <TextInput placeholder="Nome completo" />
        </label>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
