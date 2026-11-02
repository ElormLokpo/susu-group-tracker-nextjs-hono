
export const CLIENT_ROUTES = {
    auth: "/auth",
    verifyEmail: `/auth/verify-email`,
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
    home: `/`,
    dashboard: `/dashboard`,
    dashboardUsers: `/dashboard/users`,
    dashboardTransactions: `/dashboard/transactions`,
    dashboardGroups: `/dashboard/groups`,
    initiateUser: `/initiate-user`,
}

export const API_ROUTES = {
    register: `auth/register`,
    login: `auth/login`,
    resendVerification: `auth/resend-verification`,
    verifyEmail: `auth/verify-email`,
    forgotPassword: `auth/forgot-password`,
    resetPassword: `auth/reset-password`,
    googleOauth: `auth/google-oauth`,

    getAllTransactions: `transactions/all`,
    getAllGroups: `groups`,
    createGroup: `groups`,
    joinGroup: `groups/members/join`,

};

