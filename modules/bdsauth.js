import { authObj } from '../index.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

  onAuthStateChanged(authObj.auth, (user) => {
    if (user) {
      authObj.bdsuser = user;
      //alert (`${authObj.bdsuser.email} Logged In Successfully!`);
      // Show logged in menu
      //document.querySelectorAll(".profile").forEach(item => item.innerHTML = `${authObj.bdsuser.email}`);
      //document.querySelectorAll(".workqueue").forEach(item => item.innerHTML = `Workqueue`);

      document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
      document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');      
      // Redirect to Workqueue
    	document.querySelector('.workqueue').click();
    }
    else {
      alert('User Signed Out');
      authObj.bdsuser = '';

      // Show logged out menu
      document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
      document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
      // Redict to Home
    	document.querySelector('.home').click();
    }
  });

  // SignUp
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    createUserWithEmailAndPassword(authObj.auth, email, password)
      .then (cred => {
        M.Modal.getInstance(document.querySelector('#signup')).close();
        signupForm.reset();
        alert (`${cred.user} Created Successfully`);
      })
      .catch (err => {
        alert(err.message);
      });
  });

  // SignIn
  const signonForm = document.querySelector('#signon-form');
  signonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signonForm['signon-email'].value;
    const password = signonForm['signon-password'].value;
    signInWithEmailAndPassword(authObj.auth, email, password)
      .then (cred => {
        M.Modal.getInstance(document.querySelector('#signon')).close();
        signonForm.reset();
      })
      .catch (err => {
        alert(err.message);
      });
  });

  const signout = document.querySelectorAll('.signout');
  signout.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(authObj.auth).then(() => {}).catch((err) => alert(err.message));
    })  
  });

  // const profile = document.querySelectorAll('.profile');
  // profile.forEach(item => {
  //   item.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     alert('Profile!');
  //   })
  // });

