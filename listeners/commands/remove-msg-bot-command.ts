import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";

const RemoveMsgBotCommandCallback = async ({
  ack,
  client,
  command,
  respond,
  context,
  logger,
}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    // Vérifier les permissions
    if (command.user_id !== String(process.env.SLACK_ADMIN_USER)) {
      return respond("❌ Action réservée aux admins");
    }

    // Récupérer l'historique
    let hasMore = true;
    let latest: string | undefined;

    while (hasMore) {
      const result = await client.conversations.history({
        channel: String(process.env.SLACK_CHANNEL_BOT),
        latest,
        limit: 200,
      });

      if (!result.messages) break;

      // Supprimer chaque message
      for (const message of result.messages) {
        if (message.ts) {
          await client.chat.delete({
            channel: String(process.env.SLACK_CHANNEL_BOT),
            ts: message.ts,
          });
          console.log(`Message ${message.ts} supprimé`);
        }
      }
      
      hasMore = result.has_more ?? false;
      latest = result.messages[result.messages.length - 1]?.ts;
    }
  } catch (error) {
    logger.error(error);
  }
};

export default RemoveMsgBotCommandCallback;
