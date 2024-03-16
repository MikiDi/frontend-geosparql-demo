import {
  solid,
  string,
  integer,
  float,
  belongsTo,
  hasMany,
  defaultGraph
} from 'ember-solid/models/semantic-model';
import rdflib from 'rdflib';
import SemanticModel from 'frontend-geosparql/models/semantic-model';

export default class Charger extends SemanticModel {
  rdfType = rdflib.sym('http://schema.mobivoc.org/#Charger');
  modelName = 'charger';

  @string({ predicate: 'http://purl.org/dc/terms/identifier' })
  identifier;

  @integer({ predicate: 'http://schema.mobivoc.org/#chargerQuantity'})
  chargerQuantity;

  @string({ predicate: 'http://schema.org/address' })
  address;

  @float({ predicate: 'http://schema.mobivoc.org/#powerInKW' })
  power;

  @belongsTo({
    model: 'geometry',
    predicate: 'http://www.opengis.net/ont/geosparql#hasGeometry',
  })
  geometry; // gr:Offering
}
