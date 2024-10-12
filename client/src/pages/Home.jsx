import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import Card from "../components/Card.jsx";
import { useSpring, animated } from "@react-spring/web";
import { useTrail, animated as a } from "@react-spring/web";
import useStore  from "../../zustand/store.js";  
import { logEvent } from "firebase/analytics";

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

const projects = [
  {
    id: 1,
    title: "Project Alpha",
    description: "Collaborative text editor for team projects.",
    lastUpdated: "2024-10-01",
  },
  {
    id: 2,
    title: "Project Beta",
    description: "Markdown editor with live preview.",
    lastUpdated: "2024-09-25",
  },
  {
    id: 3,
    title: "Project Gamma",
    description: "Simple text editor with rich text features.",
    lastUpdated: "2024-09-15",
  },
  {
    id: 4,
    title: "Project Delta",
    description: "Notes application for quick jotting down ideas.",
    lastUpdated: "2024-08-30",
  },
];

const Home = () => {
  
  const { userData, setUserData } = useStore();
  const email = userData.email;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const navigate = useNavigate();
  
  const handleChange = (event) => {
    if (event.target.label === "Project Name") {
      setTitle(event.target.value);
    } else {
      setDescription(event.target.value);
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3001/api/document/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, creator: email, lastUpdated: new Date().toISOString(), collaborators: [email] }),
    });

    const data = await res.json();
    console.log(data);
    
    navigate(`/project/${data._id}`);
  };

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
                label="Project Name"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
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
