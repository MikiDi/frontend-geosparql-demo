import EmberRouter from '@ember/routing/router';
import config from 'frontend-geosparql/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('map', { path: '/:zoom/:lat/:lng' });
});
