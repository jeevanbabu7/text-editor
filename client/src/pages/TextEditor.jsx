import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

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
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const wrapperRef = useRef();

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
  useEffect(() => {
    const editor = document.createElement('div');
    wrapperRef.current.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);

    return () => {
      wrapperRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="flex justify-center mt-5">
      <div className="w-full max-w-4xl border border-slate-50 text-slate-800 text-2xl shadow-lg rounded-lg bg-white" ref={wrapperRef}></div>
    </div>
  );
};

export default TextEditor;
