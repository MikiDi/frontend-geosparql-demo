import { DataFactory } from 'rdflib';

const df = DataFactory;
/*
 * FOR DEMO PURPOSES ONLY !!
 */
export default function sparqlJsonToQuads(
  result,
  defaultGraph = df.namedNode('http://default')
) {
  const quads = [];
  for (const binding of result.results.bindings) {
    const s = df.namedNode(binding.s.value);
    const p = df.namedNode(binding.p.value);
    let o;
    if (binding.o.type === 'uri') {
      o = df.namedNode(binding.o.value);
    } else {
      o = df.literal(binding.o.value, binding.o.datatype);
    }
    const quad = df.quad(s, p, o, defaultGraph);
    quads.push(quad);
  }
  return quads;
}
