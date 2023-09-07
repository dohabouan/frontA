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
import AddSprintDialog from './AddSprintDialog';

const UserStoryM = () => {
    let emptyUserStory = {
        id: '',
        description: "",
        sprint: [
            {
                id: '',
                description: "",
                startDate:"" ,
                endDate:"" ,
                statut:"",
                tasks: [
                    {
                        id: '',
                        description: "",
                        statut: "",
                        priority: ''
                    },
                    {
                        id: '',
                        description: " ",
                        statut: "",
                        priority:''
                    }
                ]
             }] 
    };

    const [UserStories, setUserStories] = useState([]);
    const [UserStoryDialog, setUserStoryDialog] = useState(false);
    const [selectedUserStory, setSelectedUserStory] = useState(null);
    const [selectedUserStories, setSelectedUserStories] = useState(null);
    const [UserStory, setUserStory] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteUserStoryDialog, setDeleteUserStoryDialog] = useState(false);
    const [deleteUserStoriesDialog, setDeleteUserStoriesDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [addSprintDialogVisible, setAddSprintDialogVisible] = useState(false);


    

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8092/userstories/all")
            .then((resp)  => resp.json())
            .then((data) => setUserStories(data));
    },[]);
    
    const openNew = () => {
        setUserStory(emptyUserStory);
        setSubmitted(false);
        setUserStoryDialog(true);
    }
    const hideDialog = () => {
        setSubmitted(false);
        setUserStoryDialog(false);
    }
   
    const saveUserStory = async () => {
        if (!UserStory.id) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the ID field.' });
        } else if (!UserStory.description) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in the description field.' });
        
        } else {
       
            setSubmitted(true);
            
            fetch('http://localhost:8092/userstories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(UserStory),
            });
            setUserStoryDialog(false);
            setUserStory(emptyUserStory);
        }    
       
    };
    const editUserStory = (rowData) => {
        setUserStory({ ...rowData });
        setUpdateDialog(true); 
    };
    
    
    
        const updateUserStory = async () => {
            try {
                const response = await fetch(`http://localhost:8092/userstories/update/${UserStory.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify(UserStory),
                });
        
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'UserStory Updated', life: 3000 });
                    setUpdateDialog(false); 
                    setUserStory(emptyUserStory);
                    
                } else {
                    
                    console.error('Update failed:', response.status);
                }
            } catch (error) {
                
                console.error('Update error:', error);
            }
        };
        
                

    const hidedeleteUserStoryDialog = () => {
        setDeleteUserStoryDialog(false);
    }

    const hidedeleteUserStoriesDialog = () => {
        setDeleteUserStoriesDialog(false);
    }
    const confirmDeleteUserStory = (UserStory) => {
        setUserStory(UserStory);
        setDeleteUserStoryDialog(true);
    }
  
    const deleteUserStory= () => {
        let _UserStory = {...UserStory};
        let idUserStory = _UserStory.id;
        fetch('http://localhost:8092/userstories/delete/' + idUserStory, {
        method: 'POST',
        })
        setDeleteUserStoryDialog(false);
        setUserStory(emptyUserStory);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'UserStory Deleted', life: 3000 });
        window.location.reload(false);

        
    }
   
    const confirmDeleteSelected = () => {
        setDeleteUserStoriesDialog(true);
    }
    const deleteselectedUserStories = () => {
        let _UserStories = UserStories.filter(val => !selectedUserStories.includes(val));
        setUserStories(_UserStories);
        setDeleteUserStoriesDialog(false);
        setSelectedUserStories(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'UserStories Deleted', life: 3000 });
    }  
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _UserStory = {...UserStory};
        _UserStory[`${name}`] = val;
        setUserStory(_UserStory);
        }
    
        
        function getStatusBadgeClass(statut) {
            switch (statut) {
              case 'EnCours':
                return 'badge badge-enCours';
              case 'Bloqué':
                return 'badge badge-bloque';
              case 'Terminé':
                return 'badge badge-terminé';
              case 'Livré':
                return 'badge badge-livré';
              case 'Annulé':
                return 'badge badge-annulé';
              default:
                return 'badge';
            }
          }
    
      const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                   <div className="button-row">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"style={{ marginBottom: '20px' }}  onClick={() => editUserStory(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-danger" style={{ marginBottom: '20px' }} onClick={() => confirmDeleteUserStory(rowData)} />
                    <div>
                    <Button label="Add Sprint" icon="pi pi-plus" className="p-button-info mr-2" style={{ marginBottom: '20px' }} onClick={openAddSprintDialog} />

                    <AddSprintDialog
                    visible={addSprintDialogVisible}
                    onHide={closeAddSprintDialog}
                    onSprintAdded={handleSprintAdded}
                    />
                    </div>
                    </div>

                   

                </React.Fragment>
            );
        } 
   
    const hideUserStoryDialog = () => {
    setSubmitted(false);
    setUserStoryDialog(false);
};

  
    const UserStoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUserStory} />
        </React.Fragment>
    );
    const deleteUserStoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteUserStoryDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUserStory} />
        </React.Fragment>
    );
    const deleteUserStoriesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteUserStoriesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedUserStories} />
        </React.Fragment>
    );
    
    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-3 text-center ">LISTE DES USER STORIES</h5>
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
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateUserStory} />
        </React.Fragment>
    );
  
    const openAddSprintDialog = () => {
        setAddSprintDialogVisible(true);
    };
    
    const closeAddSprintDialog = () => {
        setAddSprintDialogVisible(false);
    };
    
   
    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'description', header: 'User Story Description'  },
        {
          field: '',
          header: 'Sprint Description',
          body: (UserStory) => {
            return (
              <div>
                {UserStory.sprints.map((sprint, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <strong style={{ color: 'blue' }}>Sprint {index + 1}:</strong>
                    <br />
                    <strong>Description:</strong> {sprint.description}
                    <br />
                    <strong>Start Date:</strong> {sprint.startdate}
                    <br />
                    <strong>End Date:</strong> {sprint.enddate}
                    <br />
                    <strong>Statut:</strong> 
                    <span className={getStatusBadgeClass(sprint.statut)}>{sprint.statut}</span>
                    <div>
                      <strong>Tasks:</strong>
                      <ul>
                        {sprint.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>
                            <strong>Description:</strong> {task.description}
                            <br />
                            <strong>Statut:</strong> {task.statut}
                            <br />
                            <strong>Priorité:</strong> {task.priority}
                            </li>
                        ))}
                        </ul>
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
      
      const handleSprintAdded = () => {
        
        setAddSprintDialogVisible(false);
      };
      
    
    const actionColumn = <Column key="actions" body={actionBodyTemplate} header="Actions" />;
    return (
        <div className="UserStory-container">
          <Navbar />
          <div className="datatable-crud-demo">
            <div className="list-text"></div>
            <Toast ref={toast} />
            <div className="card">
              
              <DataTable
                ref={dt}
                value={UserStories}
                selection={selectedUserStories}
                onSelectionChange={(e) => setSelectedUserStories(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} UserStories"
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
          </div>  
        
            <Dialog
              visible={UserStoryDialog}
              style={{ width: '450px' }}
              header="UserStory Details"
              modal
              className="p-fluid"
              footer={UserStoryDialogFooter}
              onHide={hideDialog}
            >      

              <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText
                  id="ID"
                  value={UserStory.id}
                  onChange={(e) => onInputChange(e, 'id')}
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="description">User StoryDescription</label>
                <InputText
                  id="description"
                  value={UserStory.description}
                  onChange={(e) => onInputChange(e, 'description')}
                />
                {!UserStory.description && submitted && (
                  <small className="p-error"></small>
                )}
              </div>
      

            </Dialog>
      
            <Dialog
              visible={updateDialog}
              style={{ width: '450px' }}
              header="Update UserStory"
              modal
              className="p-fluid"
              footer={updateDialogFooter}
              onHide={hideUpdateDialog}
            >
              <div className="field">
                <label htmlFor="ID">ID</label>
                <InputText
                  id="ID"
                  value={UserStory.id}
                  onChange={(e) => onInputChange(e, 'id')}
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <InputText
                  id="description"
                  value={UserStory.description}
                  onChange={(e) => onInputChange(e, 'description')}
                />
              </div>
              <div className="p-mt-2">
             
          </div>
              </Dialog>
      
            <Dialog
              visible={deleteUserStoryDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
              footer={deleteUserStoryDialogFooter}
              onHide={hidedeleteUserStoryDialog}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {UserStory && (
                  <span>Are you sure you want to delete User Story with <b>{UserStory.id} </b> ID?</span>
                )}
              </div>
            </Dialog>
      
            <Dialog
              visible={deleteUserStoriesDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
              footer={deleteUserStoriesDialogFooter}
              onHide={hidedeleteUserStoriesDialog}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {UserStory && (
            <span>Are you sure you want to delete <b>{UserStory.description}</b>?</span>
          )}
        </div>
      </Dialog>
    </div>
  </div>
);
      
}


    export default UserStoryM;    
