export function isAdminUser(session){
    return (
        session?.user?.username === process.env.ADMIN_USERNAME
    );
}