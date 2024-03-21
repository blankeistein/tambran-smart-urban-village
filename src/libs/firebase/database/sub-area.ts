import { type DataSnapshot, push, ref, update, onValue } from "firebase/database"
import { db } from "../app"

type LatLng = {
  lat: number,
  lng: number
}

export type Area = {
  name: string,
  paths: LatLng[],
}

export const listen = (onSuccess: (snap: DataSnapshot) => void, onFailure: (e: Error) => void) => {
  const dbRef = ref(db, "subArea");

  return onValue(dbRef, onSuccess, onFailure);
}

// @ts-ignore
export const addSubArea = ({ name, paths, color }) => {
  const dbRef = ref(db, "subArea");

  const key = push(dbRef).key;

  const updates = {}
  // @ts-ignore
  updates[key + "/name"] = name;
  // @ts-ignore
  updates[key + "/paths"] = paths;
  // @ts-ignore
  updates[key + "/color"] = color;

  return update(dbRef, updates);
}