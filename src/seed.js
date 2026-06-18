import { db } from './firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import { projectsData } from './data/projectsData.js';

async function seedProjects() {
  console.log("Seeding projects to Firestore...");
  try {
    for (const project of projectsData) {
      // Use the project ID as the document ID
      await setDoc(doc(db, "projects", project.id), project);
      console.log(`Added project: ${project.title}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding:", error);
  }
}

seedProjects();
