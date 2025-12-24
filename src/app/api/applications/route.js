import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";


const ALLOWED_APPLICATION_STATUS = [
    "applied",
    "in_progress",
    "rejected",
];

const ALLOWED_WORK_ARRANGEMENT = [
    "remote",
    "hybrid",
    "on-site",
];


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("job_tracker");

        const applications = await db
        .collection("applications")
        .find({})
        .sort({ appliedDate: -1 })
        .toArray();

        const result = applications.map((doc) => ({
            ...doc,
            _id: doc._id.toString(),
        }));

        return Response.json(result);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
            const body = await request.json();

            const {
                companyName,
                jobTitle,
                workArrangement,
                applicationStatus,
                applicationDate,
                notes = "",
                isPublic = false,
            } = body;

            if (!companyName || !jobTitle || !workArrangement || !applicationStatus) {
                return new Response(
                    JSON.stringify({ error: "Missing required field" }),
                    { status: 400 }
                )
            }

            if (!ALLOWED_APPLICATION_STATUS.includes(applicationStatus)) {
                return new Response(
                    JSON.stringify({ error: "Invalid application status" }),
                    { status: 400 }
                );
            }

            if (!ALLOWED_WORK_ARRANGEMENT.includes(workArrangement)) {
                return new Response(
                    JSON.stringify({ error: "Invalid work arrangement" }),
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("job_tracker");

            const newApplication = {
                companyName,
                jobTitle,
                workArrangement,
                applicationStatus,
                applicationDate: applicationDate
                ? new Date(applicationDate)
                : new Date(),
                notes,
                isPublic,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await db
            .collection("applications")
            .insertOne(newApplication);

            return Response.json({
                message: "Application created!",
                id: result.insertedId.toString(),
            },
            { status: 201 }
            );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    try {

        const body = await request.json();
        const { id, ...updates } = body;
        
        if (!id) {
            return Response.json(
                { error: "ID is required" },
                { status: 400 }
            )
        }

        if (updates.applicationStatus && !ALLOWED_APPLICATION_STATUS.includes(updates.applicationStatus)) {
            return Response.json(
                { error: "Invalid application status" },
                { status: 400 }
            )
        }
        
        if (updates.workArrangement && !ALLOWED_WORK_ARRANGEMENT.includes(updates.workArrangement)) {
            return Response.json(
                { error: "Invalid work arrangement" },
                { status: 400}
            );
        }
        
        updates.updatedAt = new Date();
        
        const client = await clientPromise;
        const db = client.db("job_tracker");
        
        await db.collection("applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: updates}
        );
        
        return Response.json({ message: "Application updated!" });
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        
        if (!id) {
            return Response.json(
                { error: "ID is required"},
                { status: 400 }
            )
        }
        
        const client = await clientPromise;
        const db = client.db("job_tracker");
        
        await db
        .collection("applications")
        .deleteOne({ _id: new ObjectId(id) });
        
        return Response.json({ message: "Application deleted!" });
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}