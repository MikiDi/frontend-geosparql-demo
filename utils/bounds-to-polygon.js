export default function bboxToWKTPoly(llbounds) {
  const corners = [
    llbounds.getSouthWest(),
    llbounds.getNorthWest(),
    llbounds.getNorthEast(),
    llbounds.getSouthEast(),
    llbounds.getSouthWest(),
  ].map(c => `${c.lng} ${c.lat}`);
  const poly = `POLYGON ((${corners.join(',')}))`;
  return poly;
}
