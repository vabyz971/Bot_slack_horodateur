import type {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { FormState } from "../types/TypeFormHorodate";

// Fonction d'extraction corrigée
const extractFormState = (
  values: Record<string, Record<string, any>>
): FormState => {
  return {
    horodateur:
      values.form_horodateur?.["form.horodateur"]?.selected_option?.value,
    periode: values.form_periode?.["form.periode"]?.selected_option?.value,
    presence: values.form_presence?.["form.presence"]?.selected_option?.value,
    competence:
      values.form_competence?.["form.competence"]?.selected_option?.value,
    note: values.form_note?.["form.note"]?.value,
  };
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
    const state = extractFormState(body.view.state.values);

    // Formatage des données
    const submission = {
      date: new Date().toISOString(),
      ...state,
      competences: state.competence ? [state.competence] : [],
    };

    // // Validation des données
    if (
      !state.horodateur ||
      !state.periode ||
      !state.presence ||
      (!state.competence && body.actions[0].action_id === "form.submit")
    ) {
      await client.chat.postEphemeral({
        channel: body.user.id,
        user : body.user.id,
        text: "❌ Veuillez remplir tous les champs obligatoires",
      });
      return;
    } else {
      // Confirmation à l'utilisateur
      await client.chat.postEphemeral({
        channel: body.user.id,
        user : body.user.id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `✅ Soumission réussie !\n*Détails :*
    • Horodateur : ${submission.horodateur}
    • Période : ${submission.periode}
    • Présence : ${submission.presence}
    • Compétence : ${submission.competences.join(", ") || ""}
    • Note : ${submission.note || ""}
    • Date : ${submission.date || ""}`,
            },
          },
        ],
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

export default handleFormActionCallbacks;
