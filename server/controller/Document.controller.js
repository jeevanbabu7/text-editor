import Document from "../models/Document.js";

export const createDocument = async (req, res) => {
    try {
        const newDocument = new Document(req.body);
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const {title, description, content} = req.body;

    const doc = await Document.find({_id: id});
    if(!doc) return res.status(404).send(`No document with id: ${id}`);
    const isValidCollaborator = doc.collaborators.includes(req.userId);
    if(!isValidCollaborator) return res.status(401).send('You are not a collaborator');

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No document with id: ${id}`);
    

    const updatedDocument = { title, description, lastUpdated: new Date().toDateString() ,content, collaborators, _id: id };

    await Document.findByIdAndUpdate(id, updatedDocument, { new: true });

    res.json(updatedDocument);
}