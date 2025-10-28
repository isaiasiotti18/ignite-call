import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormHeader } from "./style";
import { Calendar, Clock } from "lucide-react";

export function ConfirmStep() {
  function handleConfirmScheduling() {
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
        <TextInput placeholder="Seu nome completo" />
      </label>

      <label>
        <Text size="sm">E-mail</Text>
        <TextInput placeholder="E-mail que você mais usa - meuemail@endereco.com" />
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea placeholder="Seu nome completo" />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>

        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  );
}
