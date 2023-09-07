import React from 'react';
import { Button } from 'primereact/button';
import { Container } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function NavScrollExample() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.getItem("token") ? navigate("/home") : navigate("/login");
  }

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/homeMaster">PROJECT MANAGER</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <div style={{ marginLeft: 230 }} />
            <Nav.Link href="/homeMaster">Home</Nav.Link>
            <Nav.Link href="/homeMaster/ProjetsM">ProjetsM</Nav.Link>
            <Nav.Link href="/homeMaster/UserStoriesM">UserStoriesM</Nav.Link>
            <Nav.Link href="/homeMaster/ReleasesM">ReleasesM</Nav.Link>
          
          </Nav>
          <div style={{ marginLeft: 490 }} />
          <Button
            className='p-button-outlined p-button-danger'
            onClick={handleLogout}
            label="LOGOUT"
            icon="pi pi-sign-out"
            iconPos="left"
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
