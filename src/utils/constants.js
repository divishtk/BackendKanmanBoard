export const USER_ROLES_ENUM = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member",
    GUEST: "guest",
}

export const AvailableUserRoles = Object.values(USER_ROLES_ENUM);

export const TASK_STATUS_ENUM = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
    ARCHIVED: "archived",
}

export const AvailableTaskStatus = Object.values(TASK_STATUS_ENUM);