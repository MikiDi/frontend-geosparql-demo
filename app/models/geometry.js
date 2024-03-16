import {
  solid,
  string,
  integer,
  float,
  belongsTo,
  hasMany,
  defaultGraph
} from 'ember-solid/models/semantic-model';
import SemanticModel from 'frontend-geosparql/models/semantic-model';
import rdflib from 'rdflib';
import Wkt from 'wicket';
const wicket = new Wkt.Wkt();

export default class Geometry extends SemanticModel {
  rdfType = rdflib.sym('http://www.opengis.net/ont/geosparql#Geometry');
  modelName = 'geometry';

  @string({ predicate: 'http://www.opengis.net/ont/geosparql#asWKT' })
  wkt;

  get js() {
    return wicket.read(this.wkt).components[0];
  }
}
