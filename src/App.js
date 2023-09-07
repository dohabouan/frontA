import React, { useState } from 'react';
import './App.css';
import Login from './Components/Login';
import Home from './Components/Home';
import HomeMaster from './Components/HomeMaster'
import Projets from './Components/Projets';
import ProjetsM from './Components/ProjetsM';
import PrivateRoute from './Components/PrivateRoute';
import UserStory from './Components/UserStories';
import UserStoryM from './Components/UserStoriesM'
import Release from './Components/Releases';
import ReleaseM from './Components/ReleasesMa';
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
            <Route path="/home/Projets" element={<PrivateRoute><Projets/></PrivateRoute>} />
            <Route path="/home/UserStories" element={<PrivateRoute><UserStory/></PrivateRoute>} />  
            <Route path="/home/Releases" element={<PrivateRoute><Release/></PrivateRoute>} />
            <Route path="/homeMaster" element={<PrivateRoute><HomeMaster/></PrivateRoute>} />
            <Route path="/homeMaster/ProjetsM" element={<PrivateRoute><ProjetsM/></PrivateRoute>} />
            <Route path="/homeMaster/UserStoriesM" element={<PrivateRoute><UserStoryM/></PrivateRoute>} />
            <Route path="/homeMaster/ReleasesM" element={<PrivateRoute><ReleaseM/></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
    
  );
}

export default App;
