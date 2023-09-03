//import Button from 'react-bootstrap/Button';
import { Button } from 'primereact/button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate} from 'react-router-dom';
import './Navbar.css'

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
        <Navbar.Brand href="/home">PROJECT MANAGER</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <div style={{marginLeft:230}} />
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/home/Projets">Projets</Nav.Link>
            <NavDropdown title="UserStories/Sprint" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/home/UserStories">UserStories</NavDropdown.Item>
              <NavDropdown.Item href="/home/Sprint">
                Sprint
                </NavDropdown.Item>  
                </NavDropdown>
  
                <NavDropdown title="Releases/Feedbacks" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/home/Releases">Releases</NavDropdown.Item>
              <NavDropdown.Item href="/home/Feedbacks">
                Feedbacks
                </NavDropdown.Item> 
                </NavDropdown>
            <NavDropdown title="Sprints/Tasks" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/home/Sprints">Sprints</NavDropdown.Item>
              <NavDropdown.Item href="/home/Tasks">
                Tasks
              </NavDropdown.Item>             
            </NavDropdown>
          </Nav>
          <div style={{marginLeft:290}}/>
          <Button className='p-button-outlined p-button-danger' onClick={handleLogout} label="LOGOUT" icon="pi pi-sign-out" iconPos="left"/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;