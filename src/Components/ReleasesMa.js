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
import './style.css';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import AddFeedbackDialog from './AddFeedbackDialog';
import { FileUpload } from 'primereact/fileupload';
import { PrimeIcons } from 'primereact/api';





const ReleaseM = () => {
    let emptyRelease = {
        id: '',
        date: "",
        notes:"",
        feedbacks: [
            {
                id: '',
                description: "",
                date:"" ,
                author:""
            }
        ]
    };        
                    

    const [releases, setreleases] = useState([]);
    const [ReleaseDialog, setReleaseDialog] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState(null);
    const [selectedreleases, setSelectedreleases] = useState(null);
    const [Release, setRelease] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteReleaseDialog, setDeleteReleaseDialog] = useState(false);
    const [deletereleasesDialog, setDeletereleasesDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [AddFeedbackDialogVisible, setAddFeedbackDialogVisible] = useState(false);


    

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8092/releases/all")
            .then((resp)  => resp.json())
            .then((data) => setreleases(data));
    },[]);
    
    const hideDialog = () => {
        setSubmitted(false);
        setReleaseDialog(false);
    }
   
    const saveRelease = async () => {
        if (!Release.id) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the ID field.' });
        } else if (!Release.date) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the description field.' });
        
        } else {
       
            setSubmitted(true);
            
            fetch('http://localhost:8092/releases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(Release),
            });
            setReleaseDialog(false);
            setRelease(emptyRelease);
        }    
       
    };
    const editRelease = (rowData) => {
        setRelease({ ...rowData });
        setUpdateDialog(true); 
    };
    
    
    
        const updateRelease = async () => {
            try {
                const response = await fetch(`http://localhost:8092/releases/update/${Release.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify(Release),
                });
        
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Release Updated', life: 3000 });
                    setUpdateDialog(false); 
                    setRelease(emptyRelease);
                    
                } else {
                    
                    console.error('Update failed:', response.status);
                }
            } catch (error) {
                
                console.error('Update error:', error);
            }
        };
        
                

    const hidedeleteReleaseDialog = () => {
        setDeleteReleaseDialog(false);
    }

    const hidedeletereleasesDialog = () => {
        setDeletereleasesDialog(false);
    }
    const confirmDeleteRelease = (Release) => {
        setRelease(Release);
        setDeleteReleaseDialog(true);
    }
  
    const deleteRelease= () => {
        let _Release = {...Release};
        let idRelease = _Release.id;
        fetch('http://localhost:8092/releases/delete/' + idRelease, {
        method: 'POST',
        })
        setDeleteReleaseDialog(false);
        setRelease(emptyRelease);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Release Deleted', life: 3000 });
        window.location.reload(false);

        
    }
   
    const confirmDeleteSelected = () => {
        setDeletereleasesDialog(true);
    }
    const deleteselectedreleases = () => {
        let _releases = releases.filter(val => !selectedreleases.includes(val));
        setreleases(_releases);
        setDeletereleasesDialog(false);
        setSelectedreleases(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'releases Deleted', life: 3000 });
    }  
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Release = {...Release};
        _Release[`${name}`] = val;
        setRelease(_Release);
        }
    
 
    
      const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                   <div className="button-row">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"style={{ marginBottom: '20px' }}  onClick={() => editRelease(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-danger" style={{ marginBottom: '20px' }} onClick={() => confirmDeleteRelease(rowData)} />
                    <div>
                    <Button label="Add feedback"  icon="pi pi-plus" className="p-button-info mr-2"  style={{ marginBottom: '20px' }}onClick={openAddFeedbackDialog}/>

</div>
                    </div>

                   

                </React.Fragment>
            );
        } 
   
    const hideReleaseDialog = () => {
    setSubmitted(false);
    setReleaseDialog(false);
};

  
    const ReleaseDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRelease} />
        </React.Fragment>
    );
    const deleteReleaseDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteReleaseDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteRelease} />
        </React.Fragment>
    );
    const deletereleasesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeletereleasesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedreleases} />
        </React.Fragment>
    );
    
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-3 text-center">LISTE DES RELEASES</h5>
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
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateRelease} />
        </React.Fragment>
    );
  
    const openAddFeedbackDialog = () => {
        setAddFeedbackDialogVisible(true);
    };
    
    const closeAddFeedbackDialog = () => {
        setAddFeedbackDialogVisible(false);
    };
    
   
    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'date', header: 'date'  },
        { field: 'notes', header: 'notes'  },
        {
          field: '',
          header: 'feedback Description',
          body: (Release) => {
            return (
              <div>
                {Release.feedbacks.map((feedback, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <strong style={{ color: 'blue' }}>feedback {index + 1}:</strong>
                    <br />
                    <strong>Description:</strong> {feedback.description}
                    <br />
                    <strong>Date:</strong> {feedback.date}
                    <br />
                    <strong>Author:</strong> {feedback.author}
                    <div>
                      
                    </div>
                  </div>
                ))}
              </div>
            );
          },
        },
      ];
      
      
      const dynamicColumns = columns.map((col) => {
        if (col.field === 'description') {
          return (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={col.body}
              sortable
              style={{ width: '800px' }} 
            />
          );
        }
        return (
          <Column key={col.field} field={col.field} header={col.header} body={col.body} sortable />
        );
      });
      
      const handlefeedbackAdded = () => {
        // Réalisez ici la logique pour ajouter le feedback à votre liste de feedbacks
        // Assurez-vous de mettre à jour correctement l'état des feedbacks dans votre composant Release.
      
        // Après avoir ajouté avec succès le feedback, vous pouvez fermer le dialogue :
        setAddFeedbackDialogVisible(false);
      };
      
    
    const actionColumn = <Column key="actions" body={actionBodyTemplate} header="Actions" />;
    return (
        <div className="Release-container">
          <Navbar />
          <div className="datatable-crud-demo">
            <div className="list-text"></div>
            <Toast ref={toast} />
            <div className="card">
              
              <DataTable
                ref={dt}
                value={releases}
                selection={selectedreleases}
                onSelectionChange={(e) => setSelectedreleases(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} releases"
                globalFilter={globalFilter}
                header={header}
                responsiveLayout="scroll"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                  exportable={false}
                ></Column>
                
               
                {dynamicColumns}
                {actionColumn}   
              </DataTable>
            </div>
            <div>
            <AddFeedbackDialog
            visible={AddFeedbackDialogVisible}
            onHide={() => setAddFeedbackDialogVisible(false)}
            onfeedbackAdded={handlefeedbackAdded} // Cette fonction doit être définie pour ajouter le feedback
            />
          </div>  
              
            <Dialog
              visible={ReleaseDialog}
              style={{ width: '450px' }}
              header="Release Details"
              modal
              className="p-fluid"
              footer={ReleaseDialogFooter}
              onHide={hideDialog}
            >


              <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText
                  id="ID"
                  value={Release.id}
                  onChange={(e) => onInputChange(e, 'id')}
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="date"> Date</label>
                <Calendar
                  id="date"
                  value={Release.date}
                  onChange={(e) => onInputChange(e, 'date')}
                  showIcon
                />
                {!Release.date && submitted && (
                  <small className="p-error"></small>
                )}
              </div>
              <div className="field">
                <label htmlFor="notes"> Notes</label>
                <InputText
                  id="notes"
                  value={Release.notes}
                  onChange={(e) => onInputChange(e, 'notes')}
                />
                {!Release.notes && submitted && (
                  <small className="p-error"></small>
                )}
              </div>
              <div className="p-field">
        <label htmlFor="document">Import Document</label>
        <FileUpload
          name="document"
          accept=".pdf, .doc, .docx"
          maxFileSize={10000000}
          chooseLabel="Choose"
          uploadLabel="Upload"
          cancelLabel="Cancel"
          className="p-mr-2"
          mode="basic"
          icon={PrimeIcons.UPLOAD} 
          customUpload={true} 
          />
          </div>   

            </Dialog>
      
            <Dialog
              visible={updateDialog}
              style={{ width: '450px' }}
              header="Update Release"
              modal
              className="p-fluid"
              footer={updateDialogFooter}
              onHide={hideUpdateDialog}
            >
              <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText
                  id="ID"
                  value={Release.id}
                  onChange={(e) => onInputChange(e, 'id')}
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="date">Date</label>
                <Calendar
                  id="date"
                  value={Release.date}
                  onChange={(e) => onInputChange(e, 'date')}
                  showIcon
                />

              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <InputText
                  id="notes"
                  value={Release.notes}
                  onChange={(e) => onInputChange(e, 'notes')}
                  
                />
                </div>
              <div className="p-mt-2">
             
          </div>
              </Dialog>
      
            <Dialog
              visible={deleteReleaseDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
              footer={deleteReleaseDialogFooter}
              onHide={hidedeleteReleaseDialog}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {Release && (
                  <span>Are you sure you want to delete User Story with <b>{Release.id} </b> ID?</span>
                )}
              </div>
            </Dialog>
      
            <Dialog
              visible={deletereleasesDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
              footer={deletereleasesDialogFooter}
              onHide={hidedeletereleasesDialog}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {Release && (
            <span>Are you sure you want to delete <b>{Release.description}</b>?</span>
          )}
        </div>
      </Dialog>
    </div>
  </div>
);
      
}


    export default ReleaseM;    
