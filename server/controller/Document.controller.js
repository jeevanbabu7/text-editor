import Document from "../models/Document.js";
import User from "../models/User.js";

export const createDocument = async (req, res) => {
    try {
        const newDocument = new Document(req.body);
        console.log(newDocument);
        
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateDocument = async (req, res) => {

    
    const {title, description, content, id, userId} = req.body;

    
    const doc = await Document.find({_id: id});
    if(!doc) return res.status(404).send(`No document with id: ${id}`);
  
    
    
    const isValidCollaborator = doc[0].collaborators.includes(userId);
    
    if(!isValidCollaborator) return res.status(401).send('You are not a collaborator');

    // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No document with id: ${id}`);
    

    const updatedDocument = { title, description, lastUpdated: new Date().toDateString() ,content, collaborators: doc.collaborators, _id: id };

    await Document.findByIdAndUpdate(id, updatedDocument, { new: true });

    res.json(updatedDocument);
}

export const getDocument = async (req, res) => {
    try {        
        const userId = req.params.userId;
        const documents = await Document.find({ collaborators: { $in: [userId] } });        
        console.log(documents);
        
        res.status(200).json(documents);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getDocumentData = async (req, res) => {
    try {
        const { documentId } = req.params;       
        const document = await Document.find({_id: documentId});
        res.status(200).json(document[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteDocument = async (req, res) => {
    
    try {
        const { id } = req.params;
        const userEmail = req.body.email;    

        const doc = await Document.findById(id);
        if(!doc) return res.status(404).send(`No document with id: ${id}`);
        if(doc.creator !== userEmail) return res.status(401).send('You are not the creator of this document');

        await Document.findByIdAndDelete(id);
        return res.status(200).send(JSON.stringify({message: 'Document deleted successfully'}));
    }catch(err) {
        return res.status(404).send(JSON.stringify({message: err.message}));
    }
}

export const addCollaborator = async (req, res) => {
    try {
        const { documentId, collaboratorEmail, userEmail } = req.body;
        const doc = await Document.findById(documentId);
        if(!doc) return res.status(404).send(`No document with id: ${documentId}`);

        if(doc.creator !== userEmail) return res.status(401).send('You are not the creator of this document');
        const collaborator = await User.findOne({email: collaboratorEmail});
        if(!collaborator) return res.status(404).send(`No user with email: ${collaboratorEmail}`);
        if(doc.collaborators.includes(collaborator._id)) return res.status(401).send('User is already a collaborator');
        doc.collaborators.push(collaborator._id);
        await doc.save();
        return res.status(200).send(JSON.stringify({message: 'Collaborator added successfully'}));
    }catch(error){
        return res.status(404).send(JSON.stringify({message: error.message}));
    }
}

export const getCollaborators = async (req, res) => {
    try {
        const { docId } = req.params;
        const doc = await Document.findById(docId);
        if(!doc) return res.status(404).send(`No document with id: ${docId}`);

        const collaborators = await User.find({_id: { $in: doc.collaborators}});

        return res.status(200).send(collaborators);
        
        
    }catch(err) {
        return res.status(404).send(JSON.stringify({message: err.message}));
    }
}