import Route from '@ember/routing/route';

import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  beforeModel(/* transition */) {
    this.router.transitionTo('map', 14, 50.89, 4.48);
  }
}
