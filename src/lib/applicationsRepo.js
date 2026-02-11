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

export async function getAllApplications({ page = 1, limit = 10 } = {}) {
    const collection = await getCollection();

    const skip = (page - 1) * limit;

    const totalCount = await collection.countDocuments();

    const applications = await collection
        .find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    return {
        data: applications.map((application) => ({
            _id: application._id.toString(),
            ...application,
            _id: undefined,
        })),
        pagination: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            pageSize: limit,
        },
    };
}

export async function createApplication(data) {
    const collection = await getCollection();

    const now = new Date();

    const document = {
        ...data,
        createdAt: now,
        updatedAt: now
    };

    const result = await collection.insertOne(document);

    return result.insertedId.toString();
}

export async function updateApplication(id, data) {
    const collection = await getCollection();

    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...data,
                updatedAt: new Date()
            }
        }
    );

    return result;
    // await collection.updateOne(
    //     { _id: new ObjectId(id) },
    //     { $set: data }
    // );
}

export async function deleteApplication(id) {
    const collection = await getCollection();

    await collection.deleteOne({
        _id: new ObjectId(id),
    });
}