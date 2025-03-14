import type {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import axios from "axios";
import * as dotenv from "dotenv";
import { FormState } from "../types/TypeHorodateForm";
import { GoogleForm } from "../types/TypeGoogleForm";

dotenv.config();

// Fonction d'extraction corrigée
const extractFormState = (
  values: Record<string, Record<string, any>>
): FormState => {
  return {
    user: "",
    horodateur:
      values.form_horodateur?.["form.horodateur"]?.selected_option?.value,
    periode: values.form_periode?.["form.periode"]?.selected_option?.value,
    presence: values.form_presence?.["form.presence"]?.selected_option?.value,
    competence:
      values.form_competence?.["form.competence"]?.selected_option?.value,
    note: values.form_note?.["form.note"]?.value,
  };
};

const config: GoogleForm = {
  formId: String(process.env.GOOGLE_FORM_ID), // ID du formulaire depuis l'URL
  entryIds: {
    user: "entry.970188774",
    horodateur: "", // À remplacer avec vos IDs
    periode: "",
    presence: "",
    competence: "",
    note: "",
  },
};

const handleFormActionCallbacks = async ({
  ack,
  client,
  body,
  logger,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    await ack();
    if (!body.view) return;

    // Récupérer l'état complet
    const state = extractFormState(body.view?.state.values);

    // Verification des données
    if (validateForm(state) && body.actions[0].action_id === "form.submit") {
      const submission = {
        ...state,
        competences: state.competence ? [state.competence] : [],
      };

      // Envoie des donnée au google form
      const success = await submitToGoogleForm(state, config);

      if (success) {
        // Confirmation à l'utilisateur
        await client.chat.postEphemeral({
          channel: body.user.id,
          user: body.user.id,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `✅ Soumission réussie !\n*Détails :*
    • User : ${submission.user}
    • Horodateur : ${submission.horodateur}
    • Période : ${submission.periode}
    • Présence : ${submission.presence}
    • Compétence : ${submission.competence || ""}
    • Note : ${submission.note || ""}`,
              },
            },
          ],
        });
      } else {
        await client.chat.postEphemeral({
          channel: body.user.id,
          user: body.user.id,
          text: "❌ Erreur lors de l'enregistrement",
        });
      }
    } else {
      await client.chat.postEphemeral({
        channel: body.user.id,
        user: body.user.id,
        text: "❌ Veuillez remplir tous les champs obligatoires",
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

export function validateForm(formData: FormState) {
  if (
    formData.horodateur &&
    formData.periode &&
    formData.presence &&
    formData.competence
  ) {
    return true;
  }
  return false;
}

export async function submitToGoogleForm(
  formData: FormState,
  config: GoogleForm
) {
  const baseUrl = `https://docs.google.com/forms/d/e/${config.formId}/formResponse`;

  const params = new URLSearchParams({
    // Nécessaire pour la soumission
    [config.entryIds.user]: "Jahleel Lacascade",
    /*
    [config.entryIds.horodateur]: formData.horodateur,
    [config.entryIds.periode]: formData.periode,
    [config.entryIds.presence]: formData.presence,
    [config.entryIds.competence]: formData.competence,
    [config.entryIds.note]: formData.note,*/
  });

  console.log(params)

  try {
    const response = await axios.post(baseUrl, ("entry.970188774 : Xavier, Dalyna"), {
      params : ("entry.970188774 : Xavier, Dalyna"),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Erreur Google Form:", error);
    return false;
  }
}

export default handleFormActionCallbacks;
