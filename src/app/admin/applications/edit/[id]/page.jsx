import EditApplicationForm from "./EditApplicationForm";

export default async function EditApplicationPage({ params }) {
    const { id } = await params;

    return (
        <EditApplicationForm applicationId={id} />
    )
}