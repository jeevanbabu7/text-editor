import './App.css';
import Home from './pages/Home.jsx';
import TextEditor from './pages/TextEditor';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
