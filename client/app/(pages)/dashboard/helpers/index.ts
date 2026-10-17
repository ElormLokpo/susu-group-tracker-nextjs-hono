export function getUrlSegments(): string[] {
    if (typeof window === "undefined") return [];

    const fullPath = window.location.pathname + window.location.search;

    return fullPath.split(/[\/?]+/).filter(Boolean);
}



export const PAGE_TITLES = {
    dashboard: {
        admin: {
            title: "Financial Overview",
            description: "Real time financial insights to help you track all accounts",
        },
        member: {
            title: "Savings Overview",
            description: "Real time payout updates to help you track your progress",
        },
    },
    transactions: {
        admin: {
            title: "Transactions Overview",
            description: "Real time data of all your payment transactions that has been made.",
        },
        member: {
            title: "Transactions Overview",
            description: "Real time data of all your payment and savings you have made",
        },
    },
    groups: {
        admin: {
            title: "All Susu Circles",
            description: "Manage and monitor all active group rotations across the platform",
        },
        member: {
            title: "",
            description: "",
        },


    },
    users: {
        admin: {
            title: "All Users",
            description: "Manage and monitor all users across all groups.",
        },
        member: {
            title: "",
            description: "",
        },
    },
} as const;

type PageKey = keyof typeof PAGE_TITLES;
type RoleKey = "admin" | "member";


export function getPageHeader(page: string, role: string) {
    const pageData = PAGE_TITLES[page as PageKey];
    const roleData = pageData?.[role as RoleKey];

    return {
        title: roleData?.title ?? "Overview",
        description: roleData?.description ?? "Welcome to your account overview.",
    };
}