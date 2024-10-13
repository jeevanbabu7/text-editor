import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import useStore from '../../zustand/store.js';
import { useParams } from 'react-router-dom';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const {userData, setUserData} = useStore();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState(null);
  const wrapperRef = useRef();
  const [docData, setDocData] = useState({});
  const params = useParams();
  const userId = userData._id;


  const handleSave = async () => {
    const title = docData.title;
    const description = docData.description;
    const content = quill.getContents();
    const id = params.id;
    const userId = userData._id;
    const data = {title, description, content, id, userId};
    
    const response = await fetch('http://localhost:3001/api/document/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(res);
  };

  // Set up socket connection
  useEffect(() => {
    const s = io('http://localhost:3001'); // Connect to backend server
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Handle receiving changes from other clients
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta); // Apply changes received from server
    };

    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);


  // Handle sending changes made by the user
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return; // Only send changes if made by the user
      socket.emit('send-changes', delta); // Send changes to backend
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  // Set up Quill editor
  // Set up Quill editor
useEffect(() => {
  const editor = document.createElement('div');
  wrapperRef.current.append(editor);
  const q = new Quill(editor, {
    theme: 'snow',
    modules: { toolbar: TOOLBAR_OPTIONS },
  });
  setQuill(q);

  // Cleanup function
  return () => {
    if (wrapperRef.current) {
      wrapperRef.current.innerHTML = ''; // Safeguard to check if wrapperRef.current exists
    }
  };
}, []);


  // Fetch document data
  useEffect(() => { 
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3001/api/document/getDocument/${params.id}`);
      const data = await response.json();
      setDocData(data); // Set document data
      console.log(data);
    }

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (quill && docData.content && docData.content.ops) {
      
      quill.setContents(docData.content.ops);
    }
  }, [quill, docData.content]); 
  
  return (
    <div className="flex flex-col items-center mt-5">
      {/* Title and Description */}
      <div className='w-full max-w-4xl mb-5 flex flex-row justify-center items-center'>
        <div className="w-full max-w-4xl mb-5">
          <h1 className="text-4xl font-bold text-slate-800">{docData.title || "Untitled Document"}</h1>
          <p className="text-xl text-slate-600">{docData.description || "No description available."}</p>
        </div>
        <button onClick={handleSave} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      </div>

      {/* Quill Editor */}
      <div className="w-full max-w-4xl border border-slate-50 text-slate-800 text-2xl shadow-lg rounded-lg bg-white" ref={wrapperRef}></div>
    </div>
  );
};

export default TextEditor;
