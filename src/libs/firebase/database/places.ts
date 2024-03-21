import { DataSnapshot, onValue, push, ref, update } from "firebase/database"
import { db } from "../app"
import { createFamily, createFamilyCard } from "@/libs/faker";
import { faker } from "@faker-js/faker";

export const generatePlace = (lat: number, lng: number) => {
  const placeRef = ref(db, "places");
  const placeId = push(placeRef).key;
  const updatesPlace = {}
  // @ts-ignore
  updatesPlace[placeId + "/id"] = placeId;
  // @ts-ignore
  updatesPlace[placeId + "/location"] = { lat, lng };
  // @ts-ignore
  updatesPlace[placeId + "/type"] = "house";

  const familyId = createFamilyCard();
  const familyRef = ref(db, "familyCard");
  
  const updatesFamilyCard = {};
  // @ts-ignore
  updatesFamilyCard[familyId] = true;

  const totalFamily = faker.number.int({ min: 1, max: 8 });
  const peoples = createFamily(familyId, placeId!, totalFamily);

  const peoplesRef = ref(db, "peoples");
  const updatesPeoples = {}
  for(const people of peoples) {
    const peopleKey = push(peoplesRef).key;
    if(peopleKey) {
      // @ts-ignore
      updatesPeoples[peopleKey] = people;
    }
  }

  return Promise.all([
    update(placeRef, updatesPlace),
    update(familyRef, updatesFamilyCard),
    update(peoplesRef, updatesPeoples),
  ])
}

export const listen = (onSuccess: (snap: DataSnapshot) => void, onFailure: (err: Error) => void) => {
  const dbRef = ref(db, "places")

  return onValue(dbRef, onSuccess, onFailure);
}