import React, { useRef, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/compat/app';
import { getAnalytics } from "firebase/analytics";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/database';

// Add the Firebase services that you want to use
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


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
const database = firebase.database();

let messagesRef = firestore.collection('messages1');
const storageRef = storage.ref();
const databaseRef = database.ref();


function App() {
  const [chatRoom, setChatRoom] = useState('Chatroom I');

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
        <h1>ONLINEMD</h1>
        <SignOut />
      </header>

      {user ? <ChatRoomSidebar chatRoom={chatRoom} setChatRoom={setChatRoom} /> : <></>}

      <section>
        {user ? <ChatRoom chatRoom={chatRoom} setChatRoom={setChatRoom} /> : <SignIn />}
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
  return (<>
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  </>)
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom({chatRoom, setChatRoom}) {

  writeUserOption(auth.currentUser.uid, 1);

  const dummy = useRef();
  const query = messagesRef.orderBy('createdAt', 'asc');


  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    console.log("text: ", formValue);

    const mdMessage = await getMarkdown(formValue);

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: mdMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL
    })


    getChatbot(formValue);

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<div id='chatroom'>
    <h3 id='chatRoomHeader'>{chatRoom}</h3>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form id='sendMessageForm' onSubmit={sendMessage}>

      <input id='sendMessageInput' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button id='sendMessageButton' type="submit" disabled={!formValue}>✔️</button>

    </form>
  </div>)
}

async function getMarkdown(formValue) {
  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    var myHeaders = new Headers();
    myHeaders.append("authorization", idToken);
    myHeaders.append("Content-Type", "text/plain");


    var raw = formValue;

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch("http://localhost:3002/markdown", requestOptions);
    const result = await response.text();

    return result;

  } catch (error) {
    console.log('error', error);
  }
}

async function getChatbot(formValue) {
  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    const message = {
      "message": formValue
    }

    console.log('message', message);

    var myHeaders = new Headers();
    myHeaders.append("authorization", idToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(message);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    console.log('requestOptions', requestOptions);

    const response = await fetch("http://localhost:3001/converse", requestOptions);
    const result = await response.text();
    console.log(result);
    let textValue = result;
    /*if (result !== 'THE AI IS NOT WORKING AT THE MOMENT') {
      const jsonObject = JSON.parse(result);

      textValue = jsonObject[0].text.replace('\nAI:', '');

      console.log('textValue', textValue);
    } else {
      textValue = result;
    }*/

    const imageUrl = await ChatBotImage();
    messagesRef.add({
      text: textValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "chatbot",
      photoURL: imageUrl
    });

  } catch (error) {
    console.log('error', error);
  }
}

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  return (<>
    <div className={`message ${messageClass}`}>
      <img alt='GOOGLE PROFILE' src={photoURL} />
      <p dangerouslySetInnerHTML={{ __html: text }} id={`${createdAt}`}></p>
    </div>
  </>)
}

function ChatRoomSidebar({chatRoom, setChatRoom}) {
  return (<>
    <div className="sidebar">
      <h2>Chatrooms</h2>
      <ul>
        <li><button onClick={() => { messagesRef = firestore.collection('messages1'); console.log('Chatroom I'); setChatRoom('Chatroom I');}}>Chatroom I</button></li>
        <li><button onClick={() => { messagesRef = firestore.collection('messages2'); console.log('Chatroom II'); setChatRoom('Chatroom II');}}>Chatroom II</button></li>
        <li><button onClick={() => { messagesRef = firestore.collection('messages3'); console.log('Chatroom III'); setChatRoom('Chatroom III');}}>Chatroom III</button></li>
      </ul>
    </div>
  </>);
}

const UserDefaultImage = async () => {
  const imageRef = storageRef.child('user.png');
  const url = await imageRef.getDownloadURL();
  return url;
}

const ChatBotImage = async () => {
  const imageRef = storageRef.child('chatbot.png');
  const url = await imageRef.getDownloadURL();
  return url;
}

function writeUserOption(userId, option) {
  let data = {
    option: option
  }
  const newRef = database.ref(userId).push(data);
}


export default App;
