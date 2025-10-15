"use client";

import { Button, Text, TextInput } from "@ignite-ui/react";
import { ErrorField, Form } from "./styles";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username precisa ter pelo menos 3 caracteres.")
    .regex(/^[a-zA-Z_\-]+$/, "Não pode ter caracteres especiais e nem números.")
    .max(20, "Máximo 20 caracteres")
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  async function handleClaimUsername(data: ClaimUsernameFormSchema) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu usuário"
          {...register("username")}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <ErrorField>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o username desejado."}
        </Text>
      </ErrorField>
    </>
  );
}
