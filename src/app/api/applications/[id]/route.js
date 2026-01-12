import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    console.log("ROUTE HIT");
    console.log("RAW PARAMS:", await context.params);

    const { id } = await context.params;
    console.log("ID:", id);

    const client = await clientPromise;
    const db = client.db("job_tracker");

    const application = await db.collection("applications").findOne({
        _id: new ObjectId(id),
    });

    if (!application) {
        return NextResponse.json({ error: "Not found!" }, { status: 404 });
    }

    return NextResponse.json({
        ...application,
        _id: application._id.toString(),
    });
}

export async function PUT(req, context) {
    const { id } = await context.params;

    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("job_tracker");

    await db.collection("applications").updateOne(
        { _id: new ObjectId(id) },
        { $set: body }      
    );

    return NextResponse.json({ success: true });
}

export async function DELETE(req, context) {
    const { id } = await context.params;

    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise; 
    const db = client.db("job_tracker");

    await db.collection("applications").deleteOne({
        _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
}
