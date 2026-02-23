import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import connectToDatabase from "./mongodb";

const DATABASE_NAME = "job_tracker";
const COLLECTION_NAME = "applications";

async function getCollection() {
    const client = await connectToDatabase();
    
    return client
        .db(DATABASE_NAME)
        .collection(COLLECTION_NAME)
}

export async function getApplicationById(id) {
    if (!ObjectId.isValid(id)) {
        return null;
    }

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

export async function getAllApplications({ page = 1, limit = 10, status, arrangement } = {}) {
    const collection = await getCollection();

    const skip = (page - 1) * limit;

    const query = {};

    if (status && status !== "all") {
        query.applicationStatus = status;
    }

    if (arrangement && arrangement !== "all") {
        query.workArrangement = arrangement;
    }

    const totalCount = await collection.countDocuments(query);

    const applications = await collection
        .find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

    return {
        data: applications.map(({ _id, ...application}) => ({
            id: _id.toString(),
            ...application,
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