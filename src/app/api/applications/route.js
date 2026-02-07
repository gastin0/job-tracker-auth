import { auth } from "@/auth";
import { ALLOWED_APPLICATION_STATUS, ALLOWED_WORK_ARRANGEMENT } from "@/lib/constants";
import { createApplication, getAllApplications } from "@/lib/applicationsRepo";


export async function GET() {
    const applications = await getAllApplications();
    return Response.json(applications);
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

        const id = await createApplication(newApplication);

        return Response.json({
            message: "Application created!",
            id,
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

