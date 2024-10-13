class DocumentManager {

    constructor() {
        this.activeDocuments = [];
        this.activeUsers = [];
    }

    createDocument(data) {
        const createNewDocument = async (data) => {
            console.log(data);
            
            const newDocument = {
                title: data.title,
                description: data.description,
                creator: data.creator,
                lastUpdated: new Date().toISOString(),
                content: data.content,
                collaborators: data.collaborators
            };
    
            const response = await fetch('https://text-editor-server-sage.vercel.app/api/document/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDocument)
            });

            const document = await response.json();
            this.activeDocuments.push(document);
            // console.log(this.activeDocuments);
            return document;
        }

        return createNewDocument(data);
    }

    updateDocument(data) {
        const updateDoc = async (data) => {
            const response = await fetch('https://text-editor-server-sage.vercel.app/api/document/update', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });

            const document = await response.json();
            return document;
        }

        updateDoc(data);
    }

    deleteDocument(data) {
        const deleteDoc = async (data) => {
            const response = await fetch(`https://text-editor-server-sage.vercel.app/api/document/delete/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const document = await response.json();
            return document;
        }

        return deleteDoc(data);
    }

    addCollaborator(data) {
        const addCollab = async (data) => {
            const response = await fetch('https://text-editor-server-sage.vercel.app/api/document/addCollaborator', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const document = await response.json();
            return document;
        }
        return addCollab(data);
    }

    get(name) {

    }
}

export default DocumentManager;