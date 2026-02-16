import { updateApplication, deleteApplication, getApplicationById } from "@/lib/applicationsRepo";

export async function GET(request, context) {
    const params = await context.params;
    const id = params.id;

    const application = await getApplicationById(id);

    if (!application) {
        return Response.json({ error: "Not found"}, { status: 404 });
    }

    return Response.json(application);
}

export async function PUT(request, context) {
    const body = await request.json();

    const params = await context.params;
    const id = params.id;

    await updateApplication(id, body);
    return Response.json({ success: true });
}

export async function DELETE(request, context) {
    const params = await context.params;

    await deleteApplication(params.id);
    return Response.json({ success: true });
}
