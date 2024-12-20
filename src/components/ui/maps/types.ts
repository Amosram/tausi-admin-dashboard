export interface DbCoordinates {
  x: number;
  y: number;
}

export interface MapCoordinate {
  lat: number;
  lng: number;
}

export type MapCoordinates = MapCoordinate | MapCoordinate[];
