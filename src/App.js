import React from 'react'
import './App.css';
import NavBar from './NavBar';
import MainPage from './MainPage';
import Login from './Login.js';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Register from './Register';
import FriendsPage from './FriendsPage';
import UserPage from './UserPage';
import ModifyAccount from './ModifyAccount';

function setTokens(tokens){
  localStorage.setItem('jwtToken',tokens.oAuthToken);
  localStorage.setItem('refreshToken',tokens.refreshToken);
}

function getTokens(tokens){
  const jwtToken = localStorage.getItem('jwtToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return {jwtToken:jwtToken,refreshToken:refreshToken}
}

function logout(){
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('refreshToken');
}

function App() {
  const tokens = getTokens();
  return (
    <Router>
      <div className="App">
          <NavBar tokens={tokens} logout={logout}></NavBar>
          <Routes>
            <Route path="/" element={<MainPage tokens={tokens}/>} />
            <Route path="/Friends" element={<FriendsPage tokens={tokens} friendsOnly={true}></FriendsPage>} />
            <Route path="/login" element={<Login setTokens={setTokens} />} />
            <Route path="/register" element={<Register />}  />
            <Route path="/modifyAccount" element={<ModifyAccount tokens={tokens} />} />
            <Route path="/user/:userId" element={<UserPage tokens={tokens} />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
