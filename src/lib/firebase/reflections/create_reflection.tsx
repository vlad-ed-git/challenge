"use client";;
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../config";
import { ReflectionReportData, reflectionsCollection } from "@/lib/form_models/reflection_schema";

interface IEditProfileResult {
  success: boolean;
  docId?: string;
  error?: any;
}
const createReflection = async (
  profileId: string,
  values: ReflectionReportData
): Promise<IEditProfileResult> => {
  try {
    // update the time period
    const docRef = doc(collection(db, reflectionsCollection));
    await setDoc(docRef, {
      id: docRef.id,
      createdBy: profileId,
      createdAt: Timestamp.now(),
      ...values,
    });
    return { success: true, docId: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};

export { createReflection };
