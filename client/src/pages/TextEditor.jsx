import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import useStore from '../../zustand/store.js';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from "@material-tailwind/react";
 

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
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const navigate = useNavigate();

  const handleSave = async () => {
    const title = docData.title;
    const description = docData.description;
    const content = quill.getContents();
    const id = params.id;
    const userId = userData._id;
    const data = {title, description, content, id, userId};
    
    socket.emit('update-document', data);

    const res = await response.json();
    console.log(res);
  };

  const handleDelete = async () => {
    const id = params.id;
    const email = userData.email;
    const data = {id, email};
    socket.emit('delete-document', data);
    navigate('/home');
    
  }

  const handleAddCollaborator = async () => {
    const documentId = params.id;
    const userEmail = userData.email;
    const data = {documentId, collaboratorEmail, userEmail};
    socket.emit('add-collaborator', data);
    
  }

  // Set up socket connection
  useEffect(() => {
    const s = io('https://text-editor-server-sage.vercel.app'); // Connect to backend server
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
      socket.emit('send-changes',params.id, delta); // Send changes to backend
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


  // Fetch document data and join the document room
  useEffect(() => { 
    if(!socket) return;
    const fetchData = async () => {
      const response = await fetch(`/api/document/getDocument/${params.id}`);
      const data = await response.json();
      setDocData(data); // Set document data
      console.log(data);
    }

    fetchData();
    socket.emit('join-document', params.id); 
  }, [params.id, socket]);

  useEffect(() => {
    if (quill && docData.content && docData.content.ops) {
      
      quill.setContents(docData.content.ops);
    }
  }, [quill, docData.content]); 

// to fetch collaborators

useEffect(() => {
  const fetchCollaborators = async () => {
    const response = await fetch(`/api/document/getCollaborators/${params.id}`);
    const data = await response.json();
    setCollaborators(data);
  }

  fetchCollaborators();
}, []);
  
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-5 gap-1">
  {/* Editor Section */}
  <div className="col-span-4">
    <div className="flex flex-col items-center mt-5">
      <div className="w-full max-w-4xl mb-5 flex flex-row justify-between items-center">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-slate-800">{docData.title || "Untitled Document"}</h1>
          <p className="text-xl text-slate-600">{docData.description || "No description available."}</p>
        </div>

        {/* Buttons */}
        <div className='flex flex-row gap-4 items-center'>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
          {docData.creator === userData.email && (
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Quill Editor */}
      <div
        className="w-full max-w-4xl border border-slate-50 text-slate-800 text-1xl shadow-lg rounded-lg bg-white"
        style={{ height: "400px" }} // Set the desired height
        ref={wrapperRef}
      ></div>
    </div>
  </div>

  {/* Collaborators Section */}
  <div className="col-span-1 md:col-span-1 bg-slate-300 flex flex-col gap-5 p-4 md:mt-0 mt-5">
    <div className="max-w-sm">
      <label htmlFor="input-label" className="block text-sm font-medium mb-2">Add collaborators</label>
      <input
        onChange={(event) => {
          setCollaboratorEmail(event.target.value);
        }}
        type="email"
        id="input-label"
        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-slate-950 dark:placeholder-slate-900 dark:focus:ring-neutral-600"
        placeholder="Email"
      />
    </div>

    <button onClick={handleAddCollaborator} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
      Add
    </button>

    <div className="p-4">
      <h1 className="text-3xl text-black font-semibold mb-4">Collaborators</h1>
      <ul className="space-y-2">
        {collaborators.length > 0 && collaborators.map((collaborator) => {
          return (
            <li
              key={collaborator._id} // Add a unique key for each list item
              className="flex items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
            >
              <span className="text-slate-900 text-xl">{collaborator.username}</span>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
</div>

  
  );
};

export default TextEditor;


