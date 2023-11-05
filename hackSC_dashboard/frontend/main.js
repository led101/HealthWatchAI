import {
  getFirestore,
  doc,
  onSnapshot,
  orderBy,
  limit,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const timeline = document.getElementById("timeline");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPLKGbQaiplsIRM2JRTHAp37WPjrMG65E",
  authDomain: "hacksc-fb205.firebaseapp.com",
  projectId: "hacksc-fb205",
  storageBucket: "hacksc-fb205.appspot.com",
  messagingSenderId: "352258782420",
  appId: "1:352258782420:web:49d52b21e68854c10bf741",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();
const storage = getStorage(app);
const db = getFirestore(app);

const patientId = "O8v7r7tTruvpQgSEZ9K7";

const unsubPatient = onSnapshot(doc(db, "patients", patientId), (doc) => {
  console.log("in unsubPatient");
  console.log("Current data: ", doc.data());
  if (doc.data().status_is_normal) {
    patientStatus.textContent = "Status: Normal";
    patientStatus.className = "text-green-500 font-bold";
  } else {
    patientStatus.textContent = "Status: Abnormal";
    patientStatus.className = "text-red-500 font-bold";
  }

  onTranscriptionUpdate(doc.data());
  onDetailsandImageUpdate(doc.data());
  onLastUpdated(doc.data());

});

function onTranscriptionUpdate(documentData) {
  if (documentData) {
    // Update the speech transcription
    const speechTranscriptionElement = document.getElementById("transcription");
    if (speechTranscriptionElement) {
      speechTranscriptionElement.textContent =
        documentData.transcription;
    }
  }
}

function onDetailsandImageUpdate(documentData) {
  if (documentData) {
    // Update the details
    const detailsElement = document.getElementById("details");
    if (detailsElement) {
      detailsElement.textContent = documentData.details;
    }

    const imageElement = document.getElementById("patientImage");
    if (imageElement) {
      const photoRef = ref(storage, documentData.image);
      getDownloadURL(photoRef)
        .then((url) => {
          // If you need to perform operations with the URL, do it here
          // For example, setting it as the src of an image:
          imageElement.src = url;
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error getting download URL: ", error);
        });
    }
  }
}

function onStatusUpdate(documentData) {
  if (documentData) {
    const patientStatus = document.getElementById("patientStatus");
    if (patientStatus) {
      if (documentData.status_is_normal) {
        patientStatus.textContent = "Status: Normal";
        patientStatus.className = "text-green-500 font-bold";
      } else {
        patientStatus.textContent = "Status: Abnormal";
        patientStatus.className = "text-red-500 font-bold";
      }
    }
  }
}

function onLastUpdated(documentData) {
  if (documentData) {
    // console.log("time", documentData.time_added)
    const timeAddedElement = document.getElementById("time_updated");
    if (timeAddedElement) {
      const timeAdded = new Date(documentData.time_added.toDate());
      timeAddedElement.textContent = "Last updated: " + timeSince(timeAdded);
    }
  } else {
    // Handle the case where there is no document
    console.log("No document data received");
  }
}

// for (let i = 0; i < 10; i++) {
//   let timePoint = document.createElement("div");
//   timePoint.className = "mx-2 cursor-pointer";
//   timePoint.textContent = `${i * 30}s ago`;
//   timePoint.dataset.time = i * 30;
//   timePoint.onclick = onTimelineClick;
//   timeline.appendChild(timePoint);
// }

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}
