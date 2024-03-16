import SemanticModel, {
  solid,
  string,
  integer,
  float,
  belongsTo,
  hasMany,
  defaultGraph
} from 'ember-solid/models/semantic-model';
import rdflib from 'rdflib';

export default class MySemanticModel extends SemanticModel {
  constructor(options) {
    options.defaultGraph = rdflib.sym('http://default');
    return super(options);
  }
}
