import React, { useState } from 'react';
import './App.css';
import Login from './Components/Login';
import Home from './Components/Home';
import Projet from './Components/Projets';
import PrivateRoute from './Components/PrivateRoute';

import { BrowserRouter, Route, Routes } from "react-router-dom";


import { UserContext } from './Components/UserContext';
function App() {
  const [logger, setLogger] = useState();

  const getData = (data) =>{
    setLogger(data);
  };

  if (logger){
    localStorage.setItem("user", JSON.stringify(logger));
  }
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login onSubmit={ getData } />} />
            <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/home/Projets" element={<PrivateRoute><Projet/></PrivateRoute>} />
           
        </Routes>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
    
  );
}

export default App;
