import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import Card from "../components/Card.jsx";
import { useSpring, animated } from "@react-spring/web";
import { useTrail, animated as a } from "@react-spring/web";
import useStore  from "../../zustand/store.js";  
import io from 'socket.io-client';

const style = {
  position: "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


const Home = () => {
  
  const { userData, setUserData } = useStore();
  const email = userData.email;
  const [projects, setProjects] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const navigate = useNavigate();
  const [socket, setSocket] = React.useState();
  
  useEffect(() => {
    const s = io('https://text-editor-45mp.onrender.com'); // Connect to backend server
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const handleChange = (event) => {
    if (event.target.name == "title") {
      setTitle(event.target.value);
    } else {
      setDescription(event.target.value);
    }
  };

  const handleSubmit = async () => {

    try {
      const newDocument = {
          title: title,
          description: description,
          creator: email,
          lastUpdated: new Date().toISOString(),
          content: {
             msg: 'Welcome to the collaborative text editor!'
          },
          collaborators: [userData._id]
      };
        const response = await fetch('https://text-editor-45mp.onrender.com/api/document/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newDocument)
      });

      const document = await response.json(); 

    }catch(err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // Listen for a response from the server
    if(!socket) return;
    socket.on('serverResponse', (data) => {
      console.log('Server response:', data);
      const id = data._id;
      navigate(`/project/${id}`);
   
    });    
    
    return () => {
      socket.off('serverResponse');
    };
  }, [socket]);

  useEffect(() => {
    console.log(userData);
    
    const fetchData = async () => {
      const response = await fetch(`https://text-editor-45mp.onrender.com/api/document/get/${userData._id}`);
      const data = await response.json();
      console.log(data);
      
      setProjects(data);
    }

    // fetchData();
  }, []);

  // Animation for modal (scale-in when opened)
  const modalAnimation = useSpring({
    transform: open ? "scale(1)" : "scale(0.8)",
    opacity: open ? 1 : 0,
  });

  // Animation for the cards (staggered fade-in effect)
  const trail = useTrail(projects.length, {
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Text Editor Projects</h1>
        <p className="text-gray-600 mt-2">Explore your collaborative projects</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Create new project button */}
        <a
          onClick={handleOpen}
          href="#"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create new project +
          </h5>
        </a>

        {/* Modal for creating new project */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <animated.div style={modalAnimation}>
            <Box
              sx={{
                ...style,
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                marginTop: "20%",
              }}
            >
              <TextField
                id="outlined-basic"
                name="title"
                variant="outlined"
                label="Title"
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                name="description"
                variant="outlined"
                label="Description"
                onChange={handleChange}
              />
              <Button variant="contained" onClick={handleSubmit}>
                Create
              </Button>
            </Box>
          </animated.div>
        </Modal>

        {/* Project Cards with animation */}
        {trail.map((props, index) => (
            <a.div style={props} key={index}>
              <Card project={projects[index]} />
            </a.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
