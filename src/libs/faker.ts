import { fakerID_ID as faker } from "@faker-js/faker";

export function createFamilyCard(): string {
  return faker.string.numeric(16);
}

const job = [
  "Guru",
  "Wiraswasta",
  "Dokter",
  "Polisi",
  "Tentara",
  "Pedagang",
  "Mahasiswa",
  "Pelajar",
  "Petani",
  "Pengangguran",
]

export type People = {
  name: string,
  gender: string,
  birthDate: number,
  job: string,
  place: string,
  familyId: string,
}

export function createFamily(familyId: string, place: string, total: number): People[] {
  const containerFamily: People[] = [];
  for(const _ of Array(total).fill(null)) {
    const gender = faker.person.sex() as "female" || "male";
    const name = faker.person.fullName({ sex: gender });
    const birthDate = faker.date.birthdate({ min: 1978, max: 2005 }).getTime();
    const userJob = faker.helpers.arrayElement(job);

    const peopleInstance: People = {
      name,
      gender: (gender === "female") ? "Perempuan" : "Laki Laki",
      birthDate,
      job: userJob,
      familyId,
      place,
    }

    containerFamily.push(peopleInstance)
  }

  return containerFamily;
}