import { type DataSnapshot, onValue, push, ref, update } from "firebase/database";
import { db } from "@/libs/firebase/app";

type LatLng = {
  lat: number,
  lng: number
}

export type Area = {
  name: string,
  paths: LatLng[],
}

export const listenArea = (onSuccess: (snap: DataSnapshot) => void, onFailure: (error: Error) => void) => {
  const dbRef = ref(db, "area");

  return onValue(dbRef, onSuccess, onFailure );
}

export const addArea = ({ name, paths }: { name: string, paths: LatLng[] }) => {
  const dbRef = ref(db, "area");
  const key = push(dbRef).key
  
  const updates = {};
  // @ts-ignore
  updates[key + "/name"] = name;
  // @ts-ignore
  updates[key + "/paths"] = paths;

  return update(dbRef, updates);
}