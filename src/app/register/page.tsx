"use client";

import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, Header } from "./style";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username precisa ter pelo menos 3 caracteres.")
    .regex(/^[a-zA-Z_\-]+$/, "Não pode ter caracteres especiais e nem números.")
    .max(20, "Máximo 20 caracteres")
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, "Nome precisa ter pelo menos 3 letras.")
    .regex(
      /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]+$/i,
      "Não pode ter caracteres especiais e nem números."
    ),
});

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function Register() {
  const router = useRouter();

  const query = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  useEffect(() => {
    if (query.get("username")) {
      setValue("username", String(query.get("username")));
    }
  }, [query.get("username"), setValue]);

  async function handleRegister(data: RegisterFormSchema) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.statusText) {
        alert(err.response.statusText);
      }
    }
  }

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

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text>Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="username"
            {...register("username")}
          />

          {errors.username && (
            <Text size="sm" style={{ color: "#ff2c2c" }}>
              {errors.username.message}
            </Text>
          )}
        </label>

        <label>
          <Text>Nome completo</Text>
          <TextInput placeholder="Nome completo" {...register("name")} />

          {errors.name && (
            <Text size="sm" style={{ color: "#ff2c2c" }}>
              {errors.name.message}
            </Text>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
