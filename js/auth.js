function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } 
  else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('login-widget-sign-in').disabled = false;
    });
  }
}
function handleSignUp() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  var uaffiliation = document.getElementById('displayaffiliation').value;
  var uname = document.getElementById('displayname').value;
  var orcidreg = document.getElementById('displayorcid').value;
  if(uaffiliation == "" && uname == "") {
    document.getElementById('userinfoextended').style.display = 'block';
    policyAgreementChange();
    return;
  }
  if (uaffiliation.length < 2) {
    alert('Please enter your affiliation.');
    return;
  }
  if (uname.length < 2) {
    alert('Please enter your name.');
    return;
  }  
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user)=> {
    user.user.updateProfile({
      displayName: uname,
      photoURL: uaffiliation+";"+orcidreg
    }).then(() => {
      console.log("Updated user info: " + uname + " " + uaffiliation)
      document.getElementById('displayaffiliation').value = ""
      document.getElementById('displayname').value = ""
    }).catch((error) => {
      console.log("Error updating user info: " + uname + " " + uaffiliation)
    });
    user.user.sendEmailVerification()  
    firebase.auth().signOut();
    document.getElementById('userinfoextended').style.display = 'none';
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } 
    else {
      alert(errorMessage);
    }
    console.log(error);
  });
}
function sendPasswordReset() {
  var email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } 
    else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}
function deleteAccount() {
  var user = firebase.auth().currentUser;
  user.delete().then(function() {
    alert('Account deleted successfully.');
    document.getElementById('loggedin-area-edit').style.display = 'none';
    document.getElementById('loggedin-area').style.display = 'block';
    document.getElementById('login-signup-area').style.display = 'none';
    userLoggedIn = false;
    formRef.triggerChange();
    document.getElementById('login-info-user').textContent = "Anonymous user";
    document.getElementById('login-widget-sign-up').disabled = false;
    document.getElementById('login-widget-sign-in').textContent = 'Sign in';
    document.getElementById('login-signup-area').style.display = 'block';
    document.getElementById('loggedin-area').style.display = 'none';
    document.getElementById('loggedin-area-name').textContent = "";
    document.getElementById('loggedin-area-email').textContent = "";
    document.getElementById('loggedin-area-affiliation').textContent = "";
  }).catch(function(error) {
    console.log(error);
    alert('Error deleting account.');
  });
}
function sendPasswordReset2() {
  var email = document.getElementById('loggedin-area-email').textContent;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } 
    else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}
function editProfileShow() {
  document.getElementById('displaynameedit').value = firebase.auth().currentUser.displayName;
  if(firebase.auth().currentUser.photoURL != null && firebase.auth().currentUser.photoURL.search(";") != -1) {
    document.getElementById('displayaffiliationedit').value = firebase.auth().currentUser.photoURL.split(";")[0];
    document.getElementById('displayorcidedit').value = firebase.auth().currentUser.photoURL.split(";")[1];
  }
  document.getElementById('loggedin-area-edit').style.display = 'block';
  document.getElementById('loggedin-area').style.display = 'none';
  document.getElementById('login-signup-area').style.display = 'none';
}
function editProfileSave() {
  uname = document.getElementById('displaynameedit').value;
  uaffiliation = document.getElementById('displayaffiliationedit').value.replace(";","");
  orcid = document.getElementById('displayorcidedit').value;
  firebase.auth().currentUser.updateProfile({
    displayName: uname,
    photoURL: uaffiliation + ";" + orcid
  }).then(() => {
    console.log("Updated user info: " + uname + " " + uaffiliation)
    document.getElementById('loggedin-area-name').textContent = uname;
    document.getElementById('loggedin-area-affiliation').textContent = uaffiliation;
    document.getElementById('loggedin-area-orcid').textContent = orcid;
    document.getElementById('loggedin-area-edit').style.display = 'none';
    document.getElementById('loggedin-area').style.display = 'block';
    document.getElementById('login-signup-area').style.display = 'none';
    alert("Update successful");
  }).catch((error) => {
    console.log("Error updating user info: " + uname + " " + uaffiliation);
    alert("Error updating user info: " + uname + " " + uaffiliation);
  });
}
function orcidEditChange() {
  const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  if(document.getElementById('displayorcidedit').value != "") {
    if(pattern.test(document.getElementById('displayorcidedit').value) ) {
      fetchXMLFromURL("https://pub.orcid.org/v3.0/expanded-search/?start=0&rows=1&q=orcid:"+document.getElementById('displayorcidedit').value);    
    } 
    else {   
      document.getElementById('displayaffiliationedit').disabled = false;
      document.getElementById('displaynameedit').disabled = false;
    }
  }
}
function orcidNewChange() {
  const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  if(document.getElementById('displayorcid').value != "") {
    if(pattern.test(document.getElementById('displayorcid').value) ) {
      fetchXMLFromURL("https://pub.orcid.org/v3.0/expanded-search/?start=0&rows=1&q=orcid:"+document.getElementById('displayorcid').value);
    } 
    else {   
      document.getElementById('displayaffiliation').disabled = false;
      document.getElementById('displayname').disabled = false;
    }
  }
}
function fetchXMLFromURL(url) {
  fetch(url)
    .then(response => response.text())
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const expandedSearchElement = xmlDoc.getElementsByTagName('expanded-search:expanded-search');
      console.log(xml);
      console.log(expandedSearchElement);
      if (expandedSearchElement && parseInt(expandedSearchElement[0].getAttribute('num-found')) > 0) {
        console.log("num-found is greater than 0");
        document.getElementById('displaynameedit').value = expandedSearchElement[0].getElementsByTagName('expanded-search:given-names')[0].textContent + " " + expandedSearchElement[0].getElementsByTagName('expanded-search:family-names')[0].textContent;
        document.getElementById('displayaffiliationedit').value = expandedSearchElement[0].getElementsByTagName('expanded-search:institution-name')[expandedSearchElement[0].getElementsByTagName('expanded-search:institution-name').length-1].textContent;
        document.getElementById('displayaffiliationedit').disabled = true;
        document.getElementById('displaynameedit').disabled = true;
        document.getElementById('displayname').value = expandedSearchElement[0].getElementsByTagName('expanded-search:given-names')[0].textContent + " " + expandedSearchElement[0].getElementsByTagName('expanded-search:family-names')[0].textContent;
        document.getElementById('displayaffiliation').value = expandedSearchElement[0].getElementsByTagName('expanded-search:institution-name')[expandedSearchElement[0].getElementsByTagName('expanded-search:institution-name').length-1].textContent;
        document.getElementById('displayaffiliation').disabled = true;
        document.getElementById('displayname').disabled = true;
      } 
      else {
        console.log("num-found is not greater than 0");
        document.getElementById('displayaffiliationedit').disabled = false;
        document.getElementById('displaynameedit').disabled = false;
        document.getElementById('displayaffiliation').disabled = false;
        document.getElementById('displayname').disabled = false;
      }
    })
    .catch(error => {
      console.error('Error fetching XML:', error);
      document.getElementById('displayaffiliationedit').disabled = false;
      document.getElementById('displaynameedit').disabled = false;
      document.getElementById('displayaffiliation').disabled = false;
      document.getElementById('displayname').disabled = false;
    });
}
function policyAgreementChange() {
  if(document.getElementById('policyagreement').checked) {
    document.getElementById('login-widget-sign-up').disabled = false;
  } 
  else {
    document.getElementById('login-widget-sign-up').disabled = true;
  }
}
function initApp() {
  document.getElementById('login-widget-sign-in').disabled = false;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var emailVerified = user.emailVerified;
      if (!emailVerified) {
        document.getElementById('login-notice').textContent = "Check inbox for activation link";
        document.getElementById('login-widget-password-reset').textContent = "";
        setTimeout(() => {
          document.getElementById('login-notice').textContent = "";
          document.getElementById('login-widget-password-reset').textContent = "Reset password";
        }, 5000);
        firebase.auth().signOut();
        return;
      }
      var displayName = user.displayName;
      var email = user.email;
      var photoURL = user.photoURL;
      userLoggedIn = true;
      formRef.triggerChange();
      document.getElementById('login-signup-area').style.display = 'none';
      document.getElementById('loggedin-area').style.display = 'block';
      document.getElementById('loggedin-area-name').textContent = displayName;
      document.getElementById('loggedin-area-email').textContent = email;
      if(photoURL != null && photoURL.search(";") != -1) {
        document.getElementById('loggedin-area-affiliation').textContent = photoURL.split(";")[0];
        document.getElementById('loggedin-area-orcid').textContent = photoURL.split(";")[1];
      }
      document.getElementById('login-notice').textContent = "";
      document.getElementById('login-info-user').textContent = email;
      document.getElementById('login-widget-sign-up').disabled = true;
      document.getElementById('login-widget-sign-in').textContent = 'Sign out';
    } 
    else {
      userLoggedIn = false;
      formRef.triggerChange();
      document.getElementById('login-info-user').textContent = "Anonymous user";
      document.getElementById('login-widget-sign-up').disabled = false;
      document.getElementById('login-widget-sign-in').textContent = 'Sign in';
      document.getElementById('login-signup-area').style.display = 'block';
      document.getElementById('loggedin-area').style.display = 'none';
      document.getElementById('loggedin-area-name').textContent = "";
      document.getElementById('loggedin-area-email').textContent = "";
      document.getElementById('loggedin-area-affiliation').textContent = "";
    }
    document.getElementById('login-widget-sign-in').disabled = false;
  });
  document.getElementById('login-widget-sign-out').addEventListener('click', toggleSignIn, false);
  document.getElementById('login-widget-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('login-widget-sign-up').addEventListener('click', handleSignUp, false);
  document.getElementById('login-widget-password-reset').addEventListener('click', sendPasswordReset, false);
  document.getElementById('login-widget-reset-pass2').addEventListener('click', sendPasswordReset2, false);
  document.getElementById('login-widget-change-profile').addEventListener('click', editProfileShow, false);
  document.getElementById('login-widget-change-profile-save').addEventListener('click', editProfileSave, false);
  document.getElementById('displayorcidedit').addEventListener('change', orcidEditChange, false);
  document.getElementById('displayorcid').addEventListener('change', orcidNewChange, false);
  document.getElementById('login-widget-delete-account').addEventListener('click', deleteAccount, false);
  document.getElementById('policyagreement').addEventListener('change', policyAgreementChange, false);
}
window.onload = function() {
  initApp();
};