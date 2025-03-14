import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from  "@slack/bolt";
import { PlainTextOption } from "@slack/types";


// tableau d'option de 1 à 22
const selecteCompetencesOption = Array.from({ length: 22 }, (_, i) => ({
  text: {
    type: "plain_text",
    text: `Competence ${i + 1}`,
    emoji: true,
  },
  value: `compétence ${i + 1}`,
}) as PlainTextOption);

const appHomeOpenedCallback = async ({
  client,
  event,
  logger,
}: AllMiddlewareArgs & SlackEventMiddlewareArgs<"app_home_opened">) => {
  // Ignore the `app_home_opened` event for anything but the Home tab
  if (event.tab !== "home") return;

  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Horodateur",
              emoji: false,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "Indiquez votre présence à tous les cours (période de 3 heures)",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "form_horodateur",
            element: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Arrivée",
                    emoji: true,
                  },
                  value: "Arrivée",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Départ hâtif",
                    emoji: true,
                  },
                  value: "Départ hâtif",
                },
              ],
              action_id: "form.horodateur",
            },
            label: {
              type: "plain_text",
              text: "Horodateur",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "form_periode",
            element: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "AM",
                    emoji: true,
                  },
                  value: "AM",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "PM",
                    emoji: true,
                  },
                  value: "PM",
                },
              ],
              action_id: "form.periode",
            },
            label: {
              type: "plain_text",
              text: "Période",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "form_presence",
            element: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "En classe",
                    emoji: true,
                  },
                  value: "En classe",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "À distance",
                    emoji: true,
                  },
                  value: "À distance",
                },
              ],
              action_id: "form.presence",
            },
            label: {
              type: "plain_text",
              text: "Présence",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "form_competence",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select options",
                emoji: true,
              },
              options: selecteCompetencesOption,
              action_id: "form.competence",
            },
            label: {
              type: "plain_text",
              text: "Compétence travaillée durant la période",
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "As-tu quelque chose à ajouter?",
              emoji: true,
            },
          },
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "Du genre, « ouin, j'avais oublié de puncher en arrivant mais je suis arrivé à 8h30 », ou bien « je vais devoir quitter entre 10h et 10h30 à cause d'un rendez-vous chez le blablabla... ». Tu vois le genre?",
                  },
                  {
                    type: "text",
                    text: "Tu peux l'écrire ici dans la section Note. ",
                    style: {
                      bold: true,
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "input",
            block_id: "form_note",
            element: {
              type: "plain_text_input",
              action_id: "form.note",
            },
            label: {
              type: "plain_text",
              text: "Note",
              emoji: true,
            },
          },
          {
            type: "actions",
            block_id: "form_submit",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Valider",
                  emoji: true,
                },
                value: "submit",
                action_id: "form.submit",
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

export default appHomeOpenedCallback;
