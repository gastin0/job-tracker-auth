export const APPLICATION_STATUS = {
    APPLIED: "applied",
    IN_PROGRESS: "in_progress",
    REJECTED: "rejected",
};

export const WORK_ARRANGEMENT = {
    REMOTE: "remote",
    HYBRID: "hybrid",
    ON_SITE: "on-site",
}


export const ALLOWED_APPLICATION_STATUS = Object.values(APPLICATION_STATUS);
export const ALLOWED_WORK_ARRANGEMENT = Object.values(WORK_ARRANGEMENT);
