import React, { useRef, useState, useEffect } from 'react';
import logo from './logo.svg';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/compat/app';
import { getAnalytics } from "firebase/analytics";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Add the Firebase services that you want to use
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import MarkdownEditor from './components/MarkdownEditor';


const firebaseConfig = {
  apiKey: "AIzaSyCLLHDBmcalZvc9YypnJeCBKbpPcZNum7c",
  authDomain: "onlinemd-d57e3.firebaseapp.com",
  projectId: "onlinemd-d57e3",
  storageBucket: "onlinemd-d57e3.appspot.com",
  messagingSenderId: "353091770618",
  appId: "1:353091770618:web:dee7c2f51667fd3a155143",
  measurementId: "G-GWMBCV0EYC",
  serviceAccountId: "onlinemd-d57e3@appspot.gserviceaccount.com"
};

const app = firebase.initializeApp(firebaseConfig)
const analytics = getAnalytics(app);

const storage = firebase.storage();

const auth = firebase.auth();
const firestore = firebase.firestore();

const messagesRef = firestore.collection('messages');
const chatroomRef = firestore.collection('chatrooms');
const storageRef = storage.ref();

function App() {

  const [user] = useAuthState(auth);

  useEffect(() => {
    document.title = "OnlineMD";
  }, []);

  /*firestore.collection('messages').onSnapshot((snapshot) => {
    console.log('snapshot', snapshot.docChanges());
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New: ', change.doc.data());

        const message = {
          "message": change.doc.data().text
        }

        console.log('message', message);

        var myHeaders = new Headers();
        myHeaders.append("authorization", "simon");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "message": "Tell me about Austria"
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3001/converse", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));


      }
      if (change.type === 'modified') {
        console.log('Modified: ', change.doc.data());
      }
    })
  });*/

  /*const collectionRef = firebase.firestore().collection('messages');
  collectionRef.orderBy('timestamp', 'desc').limit(1).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Newest document:', data);
      });
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });*/

  return (
    <div className="App">
      <header>
        <h1>BRANNAN & SCHÖGGLER</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRooms /> : <SignIn />}
      </section>
    </div>
  );
}

// 
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
<<<<<<< HEAD
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
=======
  return (<>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  </>)
>>>>>>> fea9dfe541266f1d9d113722bc284619a6f45f54
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

<<<<<<< HEAD
function ChatRoom() {
=======

let chatBot = false;
let markdown = false;


function ChatRooms () {
  const [ showChatRoom, setShowChatRoom ] = useState(false);
  chatBot = false;
  markdown = false;


  auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // Send token to your backend via HTTPS
    console.log('idToken', idToken);
  }).catch(function(error) {
    // Handle error
  });


  return (<>
      {!showChatRoom && <>
      <button onClick={() => {setShowChatRoom(true)}}>Chatroom</button>
      <br></br>
      <button onClick={() => {setShowChatRoom(true); chatBot = true;}}>Chatroom + Chatbot</button>
      <br></br>
      <button onClick={() => {setShowChatRoom(true); markdown = true;}}>Chatroom + Markdown</button></>}
      
      {showChatRoom && <ChatRoom />}
      </>)
}

function ChatRoom () {
>>>>>>> fea9dfe541266f1d9d113722bc284619a6f45f54
  const dummy = useRef();
  const query = messagesRef.orderBy('createdAt', 'asc');


  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    console.log("text: ", formValue);

    //if (chatBot) {
      getChatbot(formValue);
    /*} else if (markdown) {
      console.log("markdown");
    }*/

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form id='sendMessageForm' onSubmit={sendMessage}>

      <input id='sendMessageInput' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button id='sendMessageButton' type="submit" disabled={!formValue}>✔️</button>

    </form>
  </>)
}

async function getChatbot(formValue) {
  const message = {
    "message": formValue
  }

  console.log('message', message);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(message);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://localhost:3001/converse", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      const jsonObject = JSON.parse(result);

      const textValue = jsonObject[0].text.replace('\nAI:', '');

      console.log('textValue', textValue);

<<<<<<< HEAD
      messagesRef.add({
        text: textValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: "chatbot",
        photoURL: "https://th.bing.com/th/id/R.cd9a844cbc07c07ad9d0059541b09b93?rik=JL3NwOT1mNEYAA&pid=ImgRaw&r=0"
      })
=======
    messagesRef.add({
      text: textValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "chatbot",
      photoURL: ChatBotImage().imageUrl
>>>>>>> fea9dfe541266f1d9d113722bc284619a6f45f54
    })
    .catch(error => console.log('error', error));
}

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img alt='GOOGLE PROFILE' src={photoURL || UserDefaultImage().imageUrl} />
      <p id={`${createdAt}`}>{text}</p>
    </div>
  </>)
}

function UserDefaultImage () {
  const imageRef = storageRef.child('user.png');

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    imageRef.getDownloadURL().then((url) => {
      setImageUrl(url);
    });
  }, []);

  return {imageUrl};
}

function ChatBotImage () {
  const imageRef = storageRef.child('chatbot.png');

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    imageRef.getDownloadURL().then((url) => {
      setImageUrl(url);
    });
  }, []);

  return {imageUrl};
}

export default App;
