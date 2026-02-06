import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ALLOWED_APPLICATION_STATUS, ALLOWED_WORK_ARRANGEMENT } from "@/lib/constants";
import { auth } from "@/auth";


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("job_tracker");

        const applications = await db
            .collection("applications")
            .find({})
            .sort({ appliedDate: -1 })
            .toArray();

        const responseData = applications.map(({ _id, ...rest }) => ({
            _id: _id.toString(),
            ...rest,
        }));

        return Response.json(responseData);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "admin") {
            return new Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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
        const session = await auth();

        if (!session || session.user.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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
                { status: 400 }
            );
        }

        updates.updatedAt = new Date();

        const client = await clientPromise;
        const db = client.db("job_tracker");

        await db.collection("applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
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
        const session = await auth();

        if (!session || session.user.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id } = await request.json();

        if (!id) {
            return Response.json(
                { error: "ID is required" },
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
