class DocumentManager {

    constructor() {
        this.activeDocument = [];
        this.activeUsers = [];
    }

    createDocument(data) {
        const createNewDocument = async (data) => {
            const newDocument = {
                id: data.id,
                title: data.title,
                description: data.description,
                lastUpdated: new Date().toISOString(),
                content: {},
                collaborators: [data.userId]
            };
    
            const response = await fetch('http://localhost:3001/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDocument)
            });

            const document = await response.json();
            this.activeDocument.push(document);
            return document;
        }

        return createNewDocument(data);
    }

    updateDocument(data) {
        const updateDoc = async (data) => {
            const response = await fetch(`http://localhost:3001/api/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const document = await response.json();
            return document;
        }

        updateDoc(data);
    }

    deleteDocument(data) {
        const deleteDoc = async (data) => {
            const response = await fetch(`http://localhost:3001/api/${data.id}`, {
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

    get(name) {

    }
}

export default DocumentManager;