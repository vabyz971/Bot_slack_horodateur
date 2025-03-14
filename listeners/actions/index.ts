import type { App } from '@slack/bolt';
import sampleActionCallback from './sample-action';
import handleFormActionCallbacks from './handleForm-action';

const register = (app: App) => {
  app.action('sample_action_id', sampleActionCallback);
  app.action(/form\..*/,handleFormActionCallbacks);
};

export default { register };
