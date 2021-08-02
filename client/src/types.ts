export interface ThingToBring {
  _id: string;
  title: string;
  description: string;
  creatorId: string;
  minimumAmount: number;
  usersBringing: string[];
}

export interface Group {
  _id: string;
  description: string;
  title: string;
  thingsToBring: string[];
}

export interface User {
  _id: string;
  username: string;
  savedGroups: string[];
}
