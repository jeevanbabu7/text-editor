import './App.css';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import TextEditor from './pages/TextEditor.jsx';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {  
  
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
