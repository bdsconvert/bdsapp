import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, where, limit, doc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzf-SzZyk_UdU7jwjaccHjeCPQXIdfxtY",
  authDomain: "bdsapp-21.firebaseapp.com",
  databaseURL: "https://bdsapp-21-default-rtdb.firebaseio.com",
  projectId: "bdsapp-21",
  storageBucket: "bdsapp-21.appspot.com",
  messagingSenderId: "705002556975",
  appId: "1:705002556975:web:3194bbec5b39ff4d0f40da",
  measurementId: "G-4QMY1LSYKM"
};

export const fbapp = initializeApp(firebaseConfig);
export const authObj = { auth: getAuth(fbapp), bdsuser: null };
export const fbdb = getFirestore(fbapp);

onAuthStateChanged(authObj.auth, (user) => {
  if (user) {
    authObj.bdsuser = user.email;
    document.getElementById("loggedinuser").innerHTML = `<i class="material-icons left" page-link id="profile">person_outline</i>${user.email}`;
    console.log(`Current User => ${authObj.bdsuser}`);
    document.querySelectorAll(".logged-in").forEach((item) => (item.style.display = "block"));
    document.querySelectorAll(".logged-out").forEach((item) => (item.style.display = "none"));
  } else {
    authObj.bdsuser = "";
    document.getElementById("loggedinuser").innerHTML = "";
    document.querySelectorAll(".logged-in").forEach((item) => (item.style.display = "none"));
    document.querySelectorAll(".logged-out").forEach((item) => (item.style.display = "block"));
  }
});

export const GetWorqueueFiles = (keyword) => {
  console.log("Getting Userfiles...");
  keyword = keyword.trim().length > 0 ? keyword : "";
  return new Promise((resolve) => {
    // onSnapshot(query(collection(fbdb, authObj.bdsuser), where("filename", ">=", keyword), where("filename", "<=", keyword + "\uf8ff"), where("filetype", "==", "Dat"), limit(10)), (docs) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser), where("filename", ">=", keyword), where("filename", "<=", keyword + "\uf8ff"), limit(10)), (docs) => {
      const userfiles = [];
      docs.forEach((doc) => {
        console.log(doc.data().filetype);
        if (doc.data().filetype !== "Dat") {
          userfiles.push({
            filename: doc.id,
            filetype: doc.data().filetype,
            timestamp: doc.data().timestamp ? doc.data().timestamp : Date.now(),
            fields: doc.data().fields ? doc.data().fields : [],
            templates: doc.data().templates ? doc.data().templates : {},
            keyword: keyword
          });
        }
      });
      localStorage.removeItem("userfiles");
      localStorage.setItem(`userfiles`, JSON.stringify(userfiles));
      resolve();
    });
  });
};

export const GetOnixFiles = () => {
  console.log("Getting Onix Files...");
  return new Promise((resolve) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser), where("filetype", "==", "Dat"), limit(25)), (docs) => {
      const onixfiles = [];
      docs.forEach((doc) => {
        onixfiles.push(doc.id);
      });
      localStorage.removeItem("onixfiles");
      localStorage.setItem(`onixfiles`, JSON.stringify(onixfiles));
      resolve();
    });
  });
};

export const GetTitles = (fileid, keyword, lmt) => {
  console.log(`Getting titles for ${fileid}`);
  const titles = [];
  keyword = keyword.trim().length > 0 ? keyword : "";
  return new Promise(async (resolve) => {
    let q = null;
    if (limit === 0) {
      q = query(collection(fbdb, authObj.bdsuser, fileid, "Titles"), where("Title", ">=", keyword), where("Title", "<=", keyword + "\uf8ff"));
    } else {
      q = query(collection(fbdb, authObj.bdsuser, fileid, "Titles"), where("Title", ">=", keyword), where("Title", "<=", keyword + "\uf8ff"), limit(lmt));
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const title = doc.data();
      title.fileid = fileid;
      title.keyword = keyword;
      titles.push(title);
    });
    localStorage.setItem(`titles`, JSON.stringify(titles));
    resolve();
  });
};

export const GetContents = (fileid, titleid) => {
  return new Promise((resolve) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser, fileid, "Titles", titleid, "Contents"), limit(2)), (docs) => {
      docs.forEach((doc) => {
        if (doc.id === "json") localStorage.setItem(`json`, doc.data().json); //return resolve(JSON.parse(doc.data().json));
        if (doc.id === "xml") localStorage.setItem(`xml`, doc.data().xml);
      });
      resolve();
    });
  });
};

export const SaveExportTemplate = async (fileid, et) => {
  await setDoc(doc(collection(fbdb, authObj.bdsuser), fileid), { templates: et }, { merge: true });
};

export const SaveUserFile = async (userfile) => {
  // Set Userfile collection
  await setDoc(doc(collection(fbdb, authObj.bdsuser), userfile.filename), userfile, { merge: true });
};

export const SaveTitleContents = async (fileid, title, content) => {
  await setDoc(doc(collection(fbdb, authObj.bdsuser), fileid, "Titles", title.RecordReference), title);
  await setDoc(doc(collection(fbdb, authObj.bdsuser), fileid, "Titles", title.RecordReference, "Contents", "json"), { json: content.json });
  await setDoc(doc(collection(fbdb, authObj.bdsuser), fileid, "Titles", title.RecordReference, "Contents", "xml"), { xml: content.xml });
};
