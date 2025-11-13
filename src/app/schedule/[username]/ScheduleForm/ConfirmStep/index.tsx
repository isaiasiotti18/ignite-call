import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./style";
import { Calendar, Clock } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .nonempty("Campo nome não pode estar vazio."),
  email: z
    .email("Digite um email valido")
    .nonempty("Campo e-mail não pode estar vazio."),
  observations: z
    .string()
    .min(10, "Observações minimo 10 caracteres")
    .max(200, "Máximo de 200 caracteres")
    .nullable(),
});

type ConfirmFormSchema = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormSchema>({
    resolver: zodResolver(confirmFormSchema),
  });

  const router = useRouter();

  const params = useParams<{ username: string }>();
  const username = params.username;

  async function handleConfirmScheduling(data: ConfirmFormSchema) {
    const { email, name, observations } = data;
    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    });

    onCancelConfirmation();
  }

  const describedDate = format(schedulingDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const describedTime = format(schedulingDate, "HH:mm'h'", {
    locale: ptBR,
  });

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <Calendar />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
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
          {...register("observations")}
        />
        {errors.observations && (
          <FormError>{errors.observations.message}</FormError>
        )}
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
