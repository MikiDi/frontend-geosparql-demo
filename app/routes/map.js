import Route from '@ember/routing/route';
import boundsToPolygon from 'frontend-geosparql/utils/bounds-to-polygon';
import rdflib from 'rdflib';
import { inject as service } from '@ember/service';
import sparqlJsonToQuads from 'frontend-geosparql/utils/sparql-json-to-quads';

export default class MapRoute extends Route {
  @service store;

  async model(params) {
    this.lat = params.lat;
    this.lng = params.lng;
    this.zoom = params.zoom;

    const controller = this.controllerFor('map');
    if (controller && controller.bounds) {
      console.log('Got Bounds!', controller.bounds);
      const polygon = boundsToPolygon(controller.bounds);

      const quads = await this.queryContainingFeatures(polygon);
      const graph = rdflib.graph();
      graph.addAll(quads);

      this.store.store.graph = graph;

      return this.store.all('charger');
    } else {
      console.log('No bounds yet!');
    }
  }

  /*
   * @argument envelope: WKT string
   */
  async queryContainingFeatures(envelope, center) {
    /*
     * Comments for below query:
     * - bif:st_transform, this function has the same functionality as geof:transform, but Virtuoso doesn't support it yet
     * - the cast to string of wgs84Wkt. This is because Virtuoso serializes invalid json for a wktString datatype string
     */
    const query = `
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX mobivoc: <http://schema.mobivoc.org/#>

    CONSTRUCT {
        ?feature ?fp ?fo .
        ?geometry ?gp ?go .
        ?geometry geo:asWKT ?wgs84WktString .
    }
    WHERE {
        ?feature ?fp ?fo .
        ?geometry ?gp ?go .
        FILTER (?gp != geo:asWKT)
        {
            SELECT ?geometry ?feature ?wgs84Wkt ?wgs84WktString
            WHERE {
                ?feature a mobivoc:Charger ;
                    geo:hasGeometry ?geometry .
                ?geometry a geo:Geometry ;
                    geo:asWKT ?origCrsWkt .
                BIND(bif:st_transform (?origCrsWkt, 4326) AS ?wgs84Wkt)
                BIND(STR(?wgs84Wkt) as ?wgs84WktString)
                BIND("${envelope}"^^geo:wktLiteral AS ?envelope)
                FILTER(geof:sfContains(?envelope, ?wgs84Wkt))
            }
            LIMIT 300
        }
    }`;

    const endpoint = `/sparql?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' }
      // Turtle is not an option.
      // For now mu-auth returns sparql result application/json no matter what
    });
    const sparqlJson = await response.json();
    const quads = sparqlJsonToQuads(sparqlJson);
    return quads;
  }

  async setupController(controller, model) {
    super.setupController(...arguments);
    controller.lat = parseFloat(this.lat);
    controller.lng = parseFloat(this.lng);
    controller.zoom = parseInt(this.zoom);
  }

}
