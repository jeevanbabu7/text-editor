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
        console.log(document);
        
        res.status(200).json(document[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}