import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;

  async beforeModel() {
    super.init(...arguments);
    return this.intl.setLocale(['en-us']);
  }
}
