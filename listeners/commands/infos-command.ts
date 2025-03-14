import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs
} from "@slack/bolt";


const listCommand =[
  {
    name: "infos",
    description: "Affiche les informations du serveur",
  }
]




const InfosCommandCallback = async ({
  ack,
  client,
  respond,
  logger,
}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {

    await ack();
    await respond({
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "This is a header block",
            "emoji": true
          }
        }
      ]
    });
  } catch (error) {
    logger.error(error);
  }
};

export default InfosCommandCallback;
