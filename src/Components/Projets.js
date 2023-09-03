import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import Navbar from './NavBar';
import './Projets.css';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';




const Projets = () => {
    let emptyProject = {
        id: '',
        startDate: "",
        endDate: "",
        titre:"",
        team:[
        ]
    };

    const [projects, setProjects] = useState([]);
    const [projectDialog, setProjectDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState(null);
    const [project, setProject] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
    const [deleteProjectsDialog, setDeleteProjectsDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);


    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8092/projects/all")
            .then((resp)  => resp.json())
            .then((data) => setProjects(data));
    },[]);
    
    const openNew = () => {
        setProject(emptyProject);
        setSubmitted(false);
        setProjectDialog(true);
    }
    const hideDialog = () => {
        setSubmitted(false);
        setProjectDialog(false);
    }
   
    const saveProject = async () => {
        if (!project.id) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the ID field.' });
        } else if (!project.titre) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the Titre field.' });
        } else if (!project.startDate) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a Start Date.' });
        } else if (!project.endDate) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an End Date.' });
        } else {
       
            setSubmitted(true);
            
            fetch('http://localhost:8092/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(project),
            });
            setProjectDialog(false);
            setProject(emptyProject);
        }    
       
    };
        const editProject = (rowData) => {
            setProject({ ...rowData });
            setUpdateDialog(true); 
        };
    
    
        const updateProject = async () => {
            try {
                const response = await fetch(`http://localhost:8092/projects/update/${project.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify(project),
                });
        
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Project Updated', life: 3000 });
                    setUpdateDialog(false); // Close the update dialog
                    setProject(emptyProject); // Reset the project data
                    // Fetch updated project list or update the state accordingly
                } else {
                    // Handle error if the update fails
                    console.error('Update failed:', response.status);
                }
            } catch (error) {
                // Handle fetch error
                console.error('Update error:', error);
            }
        };
        
                

    const hidedeleteProjectDialog = () => {
        setDeleteProjectDialog(false);
    }

    const hidedeleteProjectsDialog = () => {
        setDeleteProjectsDialog(false);
    }
    const confirmDeleteProject = (project) => {
        setProject(project);
        setDeleteProjectDialog(true);
    }
  
    const deleteProject= () => {
        let _project = {...project};
        let idProject = _project.id;
        fetch('http://localhost:8092/projects/delete/' + idProject, {
        method: 'POST',
        })
        setDeleteProjectDialog(false);
        setProject(emptyProject);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
        window.location.reload(false);

        
    }
   
    const confirmDeleteSelected = () => {
        setDeleteProjectsDialog(true);
    }
    const deleteselectedProjects = () => {
        let _Projects = projects.filter(val => !selectedProjects.includes(val));
        setProjects(_Projects);
        setDeleteProjectsDialog(false);
        setSelectedProjects(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Projects Deleted', life: 3000 });
    }  
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _project = {...project};
        _project[`${name}`] = val;
        setProject(_project);
        }
    
        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="New" icon="pi pi-plus" className="p-button-info mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProjects || !selectedProjects.length} />
                </React.Fragment>
            )
        }
        
    
    
      const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" className=" p-button-rounded p-button-success mr-4" onClick={() => editProject(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-danger"  onClick={() => confirmDeleteProject(rowData)} />
                </React.Fragment>
            );
        } 
   
    const hideProjectDialog = () => {
    setSubmitted(false);
    setProjectDialog(false);
};

    const projectDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProject} />
        </React.Fragment>
    );
    const deleteProjectDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteProjectDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProject} />
        </React.Fragment>
    );
    const deleteProjectsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteProjectsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedProjects} />
        </React.Fragment>
    );
    
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">GESTION DES PROJETS</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const hideUpdateDialog = () => {
        setUpdateDialog(false);
    };
    
    const updateDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideUpdateDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateProject} />
        </React.Fragment>
    );
   
    
    const columns = [
        { field: 'titre', header: 'Titre' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'endDate', header: 'End Date' },
        
    ];
    
    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} body={col.body} sortable={col.header === 'Role' ? false : true} />;
    });
   
    
    
    const actionColumn = <Column key="actions" body={actionBodyTemplate} header="Actions" />;
    return (
        <div className="project-container">
        <Navbar />
        <div className="datatable-crud-demo">
            <div className="list-text"></div>
            <Toast ref={toast} />
            <div className="card">
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    ref={dt}value={projects}selection={selectedProjects}onSelectionChange={(e) => setSelectedProjects(e.value)}
                    dataKey="id"paginator rows={10} rowsPerPageOptions={[5, 10, 25]}  
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} projects"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
            
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    {dynamicColumns}
                    <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>
                <Dialog visible={projectDialog} style={{ width: '450px' }} header="Project Details" modal className="p-fluid" footer={projectDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText id="ID" value={project.id} onChange={(e) => onInputChange(e, 'id')} autoFocus />
            </div>
            <div className="field">
                <label htmlFor="Titre">Titre</label>
                <InputText id="Titre" value={project.titre} onChange={(e) => onInputChange(e, 'titre')} />
                {!project.titre && submitted && <small className="p-error"></small>}
            </div>
            <div className="field">
                <label htmlFor="StartDate">StartDate</label>
                <Calendar
                    id="StartDate"
                    value={project.startDate}
                    onChange={(e) => onInputChange(e, 'startDate')}
                    showIcon
                />
                {!project.startDate && submitted && <small className="p-error"></small>}
            </div>
            <div className="field">
                <label htmlFor="endDate">EndDate</label>
                <Calendar
                    id="endDate"
                    value={project.endDate}
                    onChange={(e) => onInputChange(e, 'endDate')}
                    showIcon
                />
                {!project.endDate && submitted && <small className="p-error"></small>}
            </div>
        </Dialog>

            <Dialog visible={updateDialog} style={{ width: '450px' }} header="Update Project" modal className="p-fluid" footer={updateDialogFooter} onHide={hideUpdateDialog}>            <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText id="ID" value={project.id} onChange={(e) => onInputChange(e, 'id')} autoFocus />
            </div>
            <div className="field">
                <label htmlFor="Titre">Titre</label>
                <InputText id="Titre" value={project.titre} onChange={(e) => onInputChange(e, 'titre')} />
               
            </div>
            <div className="field">
                <label htmlFor="StartDate">StartDate</label>
                <Calendar
                    id="StartDate"
                    value={project.startDate}
                    onChange={(e) => onInputChange(e, 'startDate')}
                    showIcon
                />
                
            </div>
            <div className="field">
                <label htmlFor="endDate">EndDate</label>
                <Calendar
                    id="endDate"
                    value={project.endDate}
                    onChange={(e) => onInputChange(e, 'endDate')}
                    showIcon
                />
               
            </div>

        </Dialog>


            <Dialog visible={deleteProjectDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProjectDialogFooter} onHide={hidedeleteProjectDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {project && <span>Are you sure you want to delete <b>{project.titre}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProjectsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProjectsDialogFooter} onHide={hidedeleteProjectsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {project && <span>Are you sure you want to delete the selected accounts?</span>}
                </div>
            </Dialog>
            </div>
        </div>
    );
}


    export default Projets;    
