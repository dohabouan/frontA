import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Navbar from './NavBar';
import './Projets.css';

const Projet = () => {
    let emptyProject = {
        id: null,
        startDate: null,
        endDate: null,
        titre:null
    };

    const [projects, setProjects] = useState([]);
    const [projectDialogVisible, setProjectDialogVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchProjects(); // Fetch projects from API
    }, []);

    const fetchProjects = () => {
        fetch("http://localhost:8092/projects/all")
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error('Error fetching projects:', error));
    };

    const openNewProjectDialog = () => {
        setSelectedProject(emptyProject);
        setSubmitted(false);
        setProjectDialogVisible(true);
    };

    const hideProjectDialog = () => {
        setSubmitted(false);
        setProjectDialogVisible(false);
    };

    const saveProject = () => {
        // Implement your logic here to save the project
        // After saving, close the dialog and fetch projects again
        // Example:
        fetch('http://localhost:8092/projects', {
            method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedProject)
         }).then(() => {
           setProjectDialogVisible(false);
             fetchProjects();
         });
    };

    // Similar adjustments for editProject and deleteProject functions as needed

    const projectDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideProjectDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProject} />
        </React.Fragment>
    );
    
    return (
        <>
            <Navbar />
            <div className="container datatable-crud-demo">
                
                <div className='d-flex justify-content-center align-center list-text mt-4 mb-4'>LISTE DES PROJETS</div>
                <Toast ref={toast} />
                <div className="card">
                    <DataTable ref={dt} value={projects} selection={selectedProject} onSelectionChange={(e) => setSelectedProject(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} projects"
                        globalFilter={globalFilter} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        <Column field="titre" header="Titre"></Column>
                        <Column field="startDate" header="Start Date"></Column>
                        <Column field="endDate" header="End Date"></Column>
                        
                        {}
                    </DataTable>
                </div>
                {/* Project Dialog */}
                <Dialog visible={projectDialogVisible} style={{ width: '450px' }} header="Project Details" modal className="p-fluid" footer={projectDialogFooter} onHide={hideProjectDialog}>
                    {/* Add input fields and form elements here */}
                </Dialog>
            </div>
        </>
    );
    }
    export default Projet;    
