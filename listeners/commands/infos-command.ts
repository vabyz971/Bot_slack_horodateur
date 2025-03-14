import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";

const InfosCommandCallback = async ({
  ack,
  client,
  respond,
  logger,
}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    await respond({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Information :spiral_note_pad:",
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
                  text: "Details: ",
                },
              ],
            },
            {
              type: "rich_text_list",
              style: "bullet",
              indent: 0,
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: "Nom: ",
                    },
                    {
                      type: "text",
                      text: "@Horodateur",
                    },
                  ],
                },
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: "Version: ",
                    },
                    {
                      type: "text",
                      text: "0.2",
                    },
                  ],
                },
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: "Autheur: ",
                    },
                    {
                      type: "link",
                      url: "https://github.com/vabyz971",
                      text: "Vabyz971",
                      style: {
                        bold: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
};

export default InfosCommandCallback;
