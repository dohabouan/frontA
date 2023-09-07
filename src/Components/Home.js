import React, { useContext } from 'react';
import './Home.css';
import { UserContext } from './UserContext';
import Navbar from './NavBar';
import logo from '../Assests/logo.png';

function Home() {
  const logger = useContext(UserContext);
  let name = logger?.collaborator?.nom + ' ' ;
  name = name?.toUpperCase();

  return (
      <div className='homeStyle'>
            <Navbar />
            <div className='d-flex align-items-center justify-content-center welcome'>
                WELCOME HOME <h3><span className='badge badge-primary mt-2 ml-4' style={{ fontSize: '60px' }}>{name}</span></h3>
            </div>


        <div className='d-flex justify-content-center align-items-center'>
                <img className="img-fluid mt-1" src={logo} alt="Logo " height={300} width={300}/>      </div>
    </div>
   
  );
}

export default Home;
