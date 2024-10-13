import './App.css';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import LoginForm from './pages/Login.jsx';
import SignUpForm from './pages/SignUp.jsx';
import TextEditor from './pages/TextEditor.jsx';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {  
  
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id" element={<TextEditor />} />
        <Route path='/signup' element={<SignUpForm />}/>
        <Route path='/login' element={<LoginForm />}/>
      </Routes>
    </Router>
  );
}

export default App;
