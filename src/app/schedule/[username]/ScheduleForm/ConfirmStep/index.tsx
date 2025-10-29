import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./style";
import { Calendar, Clock } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .nonempty("Campo nome não pode estar vazio."),
  email: z
    .email("Digite um email valido")
    .nonempty("Campo e-mail não pode estar vazio."),
  observation: z
    .string()
    .min(10, "Observações minimo 10 caracteres")
    .max(200, "Máximo de 200 caracteres")
    .nullable(),
});

type ConfirmFormSchema = z.infer<typeof confirmFormSchema>;

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  });
  function handleConfirmScheduling(data: ConfirmFormSchema) {
    console.log("Form");
  }
  return (
    <ConfirmForm as="form" onSubmit={handleConfirmScheduling}>
      <FormHeader>
        <Text>
          <Calendar />
          22 de setembro de 2025
        </Text>
        <Text>
          <Clock />
          18:00
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome Completo</Text>
        <TextInput placeholder="Seu nome completo" {...register("name")} />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">E-mail</Text>
        <TextInput
          placeholder="E-mail que você mais usa - meuemail@endereco.com"
          {...register("email")}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea
          placeholder="Seu nome completo"
          {...register("observation")}
        />
        {errors.observation && (
          <FormError>{errors.observation.message}</FormError>
        )}
      </label>

      <FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
