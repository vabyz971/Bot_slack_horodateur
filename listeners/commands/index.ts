import type { App } from "@slack/bolt";
import InfosCommandCallback from "./infos-command";
import RemoveMsgBotCommandCallback from "./remove-msg-bot-command";

const register = (app: App) => {
  app.command("/infos", InfosCommandCallback);
  app.command("/clean-channel", RemoveMsgBotCommandCallback);
};

export default { register };
