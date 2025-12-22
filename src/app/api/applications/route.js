import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";


const ALLOWED_STATUS = [
    "Applied",
    "Test",
    "Interview",
    "offer",
    "Rejected"
]

const ALLOWED_WORK_TYPE = [
    "Remote",
    "Hybrid",
    "On-site"
]


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("job_tracker");

        const applications = await db
        .collection("applications")
        .find({})
        .sort({ appliedDate: 1 })
        .toArray()

        return Response.json(applications);
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
                company,
                position,
                location = "",
                workType,
                status,
                appliedDate,
                notes = "",
                isPublic = false,
            } = body;

            if (!company || !position || !status || !workType) {
                return new Response(
                    JSON.stringify({ error: "Missing required field" }),
                    { status: 400 }
                )
            }

            if (!ALLOWED_STATUS.includes(status)) {
                return new Response(
                    JSON.stringify({ error: "Invalid status value" }),
                    { status: 400 }
                );
            }

            if (!ALLOWED_WORK_TYPE.includes(workType)) {
                return new Response(
                    JSON.stringify({ error: "Invalid work type value" }),
                    { status: 400 }
                );
            }

            const client = await clientPromise;
            const db = client.db("job_tracker");

            const newApplication = {
                company,
                position,
                location,
                workType,
                status,
                appliedDate: appliedDate ? new Data(appliedDate) : new Date(),
                notes,
                isPublic,
                createdAt: new Date(),
                updatedAt: new Date,
            };

            const result = await db
            .collection("applications")
            .insertOne(newApplication);

            return Response.json({
                message: "Application created!",
                id: result.insertedId,
            });
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
            return new Response(
                JSON.stringify({ error: "ID is required" }),
                { status: 400 }
        );
        }

        if (updates.status && !ALLOWED_STATUS.includes(updates.status)) {
            return new Response(
                JSON.stringify({ error: "Invalid status value" }),
                { status: 400 }
            )
        }
        
        if (updates.workType && !ALLOWED_WORK_TYPE.includes(updates.workType)) {
            return new Response(
                JSON.stringify({ error: "Invalid work type" }),
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
        
        return new Response({ message: "Application updated!" });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        
        if (!id) {
            return new Response(
                JSON.stringify({ error: "ID is required!" }),
                { status: 400 }
            )
        }
        
        const cliente = await clientPromise;
        const db = client.db("job_tracker");
        
        await db
        .collection("applications")
        .deleteOne({ _id: new ObjectId(id) });
        
        return Response.json({ message: "Application deleted!" });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        )
    }
}