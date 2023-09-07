import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import Navbar from './NavBar';
import './Sprint.css';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';




const Sprint = () => {
    let emptySprint = {
        id: '',
        description:'',
        startDate: "",
        endDate: "",
        statut:"",
        tasks:[
            {
            id:'',
            description:"",
            statut:"",
            priority:""
            }
        ]
    };

    const [Sprints, setSprints] = useState([]);
    const [SprintDialog, setSprintDialog] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [selectedSprints, setSelectedSprints] = useState(null);
    const [Sprint, setSprint] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteSprintDialog, setDeleteSprintDialog] = useState(false);
    const [deleteSprintsDialog, setDeleteSprintsDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);


    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8092/sprints/all")
            .then((resp)  => resp.json())
            .then((data) => setSprints(data));
    },[]);
    
    const openNew = () => {
        setSprint(emptySprint);
        setSubmitted(false);
        setSprintDialog(true);
    }
    const hideDialog = () => {
        setSubmitted(false);
        setSprintDialog(false);
    }
   
    const saveSprint = async () => {
        if (!Sprint.id) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the ID field.' });
        } else if (!Sprint.description) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the Titre field.' });
        } else if (!Sprint.startDate) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a Start Date.' });
        } else if (!Sprint.endDate) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an End Date.' });
        } else {
       
            setSubmitted(true);
            
            fetch('http://localhost:8092/sprints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(Sprint),
            });
            setSprintDialog(false);
            setSprint(emptySprint);
        }    
       
    };
        const editSprint = (rowData) => {
            setSprint({ ...rowData });
            setUpdateDialog(true); 
        };
    
    
        const updateSprint = async () => {
            try {
                const response = await fetch(`http://localhost:8092/sprints/update/${Sprint.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify(Sprint),
                });
        
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sprint Updated', life: 3000 });
                    setUpdateDialog(false); 
                    setSprint(emptySprint); 
                } else {
                    
                    console.error('Update failed:', response.status);
                }
            } catch (error) {
               
                console.error('Update error:', error);
            }
        };
        
                

    const hidedeleteSprintDialog = () => {
        setDeleteSprintDialog(false);
    }

    const hidedeleteSprintsDialog = () => {
        setDeleteSprintsDialog(false);
    }
    const confirmDeleteSprint = (Sprint) => {
        setSprint(Sprint);
        setDeleteSprintDialog(true);
    }
  
    const deleteSprint= () => {
        let _Sprint = {...Sprint};
        let idSprint = _Sprint.id;
        fetch('http://localhost:8092/sprints/delete/' + idSprint, {
        method: 'POST',
        })
        setDeleteSprintDialog(false);
        setSprint(emptySprint);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sprint Deleted', life: 3000 });
        window.location.reload(false);

        
    }
   
    const confirmDeleteSelected = () => {
        setDeleteSprintsDialog(true);
    }
    const deleteselectedSprints = () => {
        let _Sprints = Sprints.filter(val => !selectedSprints.includes(val));
        setSprints(_Sprints);
        setDeleteSprintsDialog(false);
        setSelectedSprints(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sprints Deleted', life: 3000 });
    }  
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Sprint = {...Sprint};
        _Sprint[`${name}`] = val;
        setSprint(_Sprint);
        }
    
        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="New" icon="pi pi-plus" className="p-button-info mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedSprints || !selectedSprints.length} />
                </React.Fragment>
            )
        }
        
    
    
      const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" className=" p-button-rounded p-button-success mr-4" onClick={() => editSprint(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-danger"  onClick={() => confirmDeleteSprint(rowData)} />
                </React.Fragment>
            );
        } 
   
    const hideSprintDialog = () => {
    setSubmitted(false);
    setSprintDialog(false);
};

    const SprintDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveSprint} />
        </React.Fragment>
    );
    const deleteSprintDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteSprintDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSprint} />
        </React.Fragment>
    );
    const deleteSprintsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteSprintsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedSprints} />
        </React.Fragment>
    );
    
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">GESTION DES Sprint</h5>
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
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateSprint} />
        </React.Fragment>
    );
   
    
    const columns = [
        { field: 'titre', header: 'Titre' },
        { field: 'description', header: 'Description' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'endDate', header: 'End Date' },
        { field: 'statut', header: 'Statut' }

        
    ];
    
    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} body={col.body} sortable={col.header === 'Role' ? false : true} />;
    });
   
    
    
    const actionColumn = <Column key="actions" body={actionBodyTemplate} header="Actions" />;
    return (
        <div className="Sprint-container">
        <Navbar />
        <div className="datatable-crud-demo">
            <div className="list-text"></div>
            <Toast ref={toast} />
            <div className="card">
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    ref={dt}value={Sprints}selection={selectedSprints}onSelectionChange={(e) => setSelectedSprints(e.value)}
                    dataKey="id"paginator rows={10} rowsPerPageOptions={[5, 10, 25]}  
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sprints"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
            
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    {dynamicColumns}
                    <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>
                <Dialog visible={SprintDialog} style={{ width: '450px' }} header="Sprint Details" modal className="p-fluid" footer={SprintDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText id="ID" value={Sprint.id} onChange={(e) => onInputChange(e, 'id')} autoFocus />
            </div>
            <div className="field">
                <label htmlFor="Description">Description</label>
                <InputText id="Description" value={Sprint.titre} onChange={(e) => onInputChange(e, 'titre')} />
                {!Sprint.titre && submitted && <small className="p-error"></small>}
            </div>
            <div className="field">
                <label htmlFor="StartDate">StartDate</label>
                <Calendar
                    id="StartDate"
                    value={Sprint.startDate}
                    onChange={(e) => onInputChange(e, 'startDate')}
                    showIcon
                />
                {!Sprint.startDate && submitted && <small className="p-error"></small>}
            </div>
            <div className="field">
                <label htmlFor="endDate">EndDate</label>
                <Calendar
                    id="endDate"
                    value={Sprint.endDate}
                    onChange={(e) => onInputChange(e, 'endDate')}
                    showIcon
                />
                {!Sprint.endDate && submitted && <small className="p-error"></small>}
            </div>
        </Dialog>

            <Dialog visible={updateDialog} style={{ width: '450px' }} header="Update Sprint" modal className="p-fluid" footer={updateDialogFooter} onHide={hideUpdateDialog}>            <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText id="ID" value={Sprint.id} onChange={(e) => onInputChange(e, 'id')} autoFocus />
            </div>
            <div className="field">
                <label htmlFor="Titre">Titre</label>
                <InputText id="Titre" value={Sprint.titre} onChange={(e) => onInputChange(e, 'titre')} />
               
            </div>
            <div className="field">
                <label htmlFor="StartDate">StartDate</label>
                <Calendar
                    id="StartDate"
                    value={Sprint.startDate}
                    onChange={(e) => onInputChange(e, 'startDate')}
                    showIcon
                />
                
            </div>
            <div className="field">
                <label htmlFor="endDate">EndDate</label>
                <Calendar
                    id="endDate"
                    value={Sprint.endDate}
                    onChange={(e) => onInputChange(e, 'endDate')}
                    showIcon
                />
               
            </div>

        </Dialog>


            <Dialog visible={deleteSprintDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSprintDialogFooter} onHide={hidedeleteSprintDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {Sprint && <span>Are you sure you want to delete <b>{Sprint.titre}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteSprintsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSprintsDialogFooter} onHide={hidedeleteSprintsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {Sprint && <span>Are you sure you want to delete the selected Sprints?</span>}
                </div>
            </Dialog>
            </div>
        </div>
    );
}


    export default Sprint;    
