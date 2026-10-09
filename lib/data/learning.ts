/**
 * Data access for study material, free classes and the contact page.
 * Today it reads typed content files; later each function calls the Vidyansh API
 * (planned endpoints noted) without any change to the pages using it.
 */
import { studyMaterialPage, studyMaterials } from "@/content/study-material";
import { freeClassesPage, nextLiveClass, programme, recordedLectures } from "@/content/free-classes";
import { contactPage } from "@/content/contact-page";
import type { ContactPage, LiveClass, ProgrammeEntry, RecordedLecture, StudyMaterial, StudyMaterialPage } from "@/lib/learning-types";

/** GET /study-material */
export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  return studyMaterials;
}

/** GET /study-material?availability=free */
export async function getFreeStudyMaterials(): Promise<StudyMaterial[]> {
  return studyMaterials.filter((m) => m.availability === "free");
}

export async function getStudyMaterialPage(): Promise<StudyMaterialPage> {
  return studyMaterialPage;
}

/** GET /free-classes/next */
export async function getNextLiveClass(): Promise<LiveClass | null> {
  return nextLiveClass;
}

/** GET /free-classes/programme?week=current */
export async function getProgramme(): Promise<ProgrammeEntry[]> {
  return programme;
}

/** GET /free-classes/recordings */
export async function getRecordedLectures(): Promise<RecordedLecture[]> {
  return recordedLectures;
}

export async function getFreeClassesPage() {
  return freeClassesPage;
}

/** GET /pages/contact */
export async function getContactPage(): Promise<ContactPage> {
  return contactPage;
}
