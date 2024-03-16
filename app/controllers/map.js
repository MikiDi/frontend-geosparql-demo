import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { service } from '@ember/service';

export default class MapController extends Controller {
  @service router;

  @tracked lat;
  @tracked lng;
  @tracked zoom;
  @tracked bounds;

  @action
  updateCenter(e) {
    const map = e.target;
    const lat = map.getCenter().lat;
    const lng = map.getCenter().lng;
    const zoom = map.getZoom();
    const initialLoad = !this.bounds;
    this.bounds = map.getBounds();
    if (initialLoad) {
      this.router.refresh('map')
    } else {
      this.router.transitionTo(zoom, lat, lng);
    }
  }
}
