import { DataSnapshot, equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { db } from "../app";

export const listenByPlace = (
  placeId: string, 
  onSuccess: (snap: DataSnapshot) => void, 
  onFailure: (err: Error) => void
) => {
  const dbRef = ref(db, "peoples")

  return onValue(query(dbRef, equalTo(placeId), orderByChild("place")), onSuccess, onFailure);
}