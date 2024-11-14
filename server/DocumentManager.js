class DocumentManager {

    constructor() {
        this.activeDocuments = [];
        this.activeUsers = [];
    }

    createDocument(document) {
        this.activeDocuments.push(document);
    }

    // updateDocument(data) {
    //     const updateDoc = async (data) => {
    //         const response = await fetch('http//:localhost:3001/api/document/update', {
    //             method: 'PUT',
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(data),
    //           });

    //         const document = await response.json();
    //         return document;
    //     }

    //     updateDoc(data);
    // }

    // deleteDocument(data) {
    //     const deleteDoc = async (data) => {
    //         const response = await fetch(`https://text-editor-server-sage.vercel.app/api/document/delete/${data.id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         });

    //         const document = await response.json();
    //         return document;
    //     }

    //     return deleteDoc(data);
    // }

    // addCollaborator(data) {
    //     const addCollab = async (data) => {
    //         const response = await fetch('https://text-editor-server-sage.vercel.app/api/document/addCollaborator', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         });

    //         const document = await response.json();
    //         return document;
    //     }
    //     return addCollab(data);
    // }

    get(name) {

    }
}

export default DocumentManager;