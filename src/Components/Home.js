import React, { useContext } from 'react';
import './Home.css';
import { UserContext } from './UserContext';
import Navbar from './NavBar'; // Assurez-vous du chemin correct

function Home() {
  const logger = useContext(UserContext);
  const name = logger?.user?.nom + ' ' + logger?.user?.prenom;
  const upperCaseName = name?.toUpperCase();

  return (
    <div className="home-container">
      <Navbar />
      <div className="content">
        <div className="welcome">
          WELCOME HOME{' '}
          <h3>
            <span className="badge badge-primary mt-2 ml-4">{upperCaseName}</span>
          </h3>
        </div>
        {/* Autres contenus */}
      </div>
    </div>
  );
}

export default Home;
