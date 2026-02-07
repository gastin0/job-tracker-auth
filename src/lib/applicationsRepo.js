import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DATABASE_NAME = "job_tracker";
const COLLECTION_NAME = "applications";

async function getCollection() {
    const client = await clientPromise;
    return client
    .db(DATABASE_NAME)
    .collection(COLLECTION_NAME)
}

export async function getApplicationById(id) {
    const collection = await getCollection();

    const application = await collection.findOne({
        _id: new ObjectId(id),
    });

    if (!application) return null;

    return {
        ...application,
        _id: application._id.toString(),
    };
}

export async function getAllApplications() {
    const collection = await getCollection();

    const applications = await collection
    .find({})
    .sort({ applicationDate: -1 })
    .toArray();

    return applications.map(app => ({
        ...app,
        _id: app._id.toString(),
    }));
}

export async function createApplication(data) {
    const collection = await getCollection();
    const result = await collection.insertOne(data);
    return result.insertedId.toString();
}

export async function updateApplication(id, data) {
    const collection = await getCollection();

    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
}

export async function deleteApplication(id){
    const collection = await getCollection();

    await collection.deleteOne({
        _id: new ObjectId(id),
    });
}