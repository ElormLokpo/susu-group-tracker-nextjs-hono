
import { sql } from "drizzle-orm";
import * as  groupsService from "../modules/groups/groups.service";
import * as transactionsService from "../modules/transactions/transactions.service";
import { db } from "./index";
import { formatGHS, toPesewas } from "../utils/money";
import type { Role } from "../modules/auth/auth.types";
import { and, eq } from "drizzle-orm";
import { users,groupMembers, groups } from "./schema";


const args = new Set(process.argv.slice(2));

async function main() {
    if (process.env.NODE_ENV === "production" && !args.has("--force")) {
        throw new Error("Refusing to seed with NODE_ENV=production (pass --force if you really mean it)");
    }

    if (args.has("--fresh")) {
        console.log("Truncating transactions, group_members, groups, users …");
        await db.execute(sql`TRUNCATE TABLE transactions, group_members, groups, users RESTART IDENTITY CASCADE`);
    }


    const users = await seedUsers();
    const admin = users.get("admin");
    if (!admin) throw new Error('Seed data must include a user with key "admin"');

    const groups = await seedGroups(admin);
    await seedGroupMembers(users, groups);
    await seedTransactions(admin, users, groups);


    console.log("\nGroups:");
    const summary = [];
    for (const [key, group] of groups.byKey) {
        const r = await groupsService.getReport(group.id);
        summary.push({
            group: r.group.name,
            key,
            status: r.group.status,
            weekly: r.group.weeklyAmount,
            currentWeek: r.currentWeek,
            members: r.totalWeeks,
            owing: r.owing.length,
            payouts: r.payoutHistory.length,
        });
    }
    console.table(summary);

    console.log(`\nLogins (password for all: ${SEED_PASSWORD})`);
    console.table(
        SEED_USERS.map((u) => ({ email: u.email, role: u.role, kind: u.kind, id: users.get(u.key)?.id })),
    );
}



export type UserKey = "admin" | "ama" | "kofi" | "esi" | "yaw" | "abena" | "kojo";

export interface SeedUser {
    key: UserKey;
    name: string | null;
    email: string;
    role: Role;

    kind: "password" | "oauth" | "unverified";
}

export const SEED_USERS: SeedUser[] = [
    { key: "admin", name: "Kwame Admin", email: "admin@susu.test", role: "admin", kind: "password" },
    { key: "ama", name: "Ama Mensah", email: "ama@susu.test", role: "member", kind: "password" },
    { key: "kofi", name: "Kofi Boateng", email: "kofi@susu.test", role: "member", kind: "password" },
    { key: "esi", name: "Esi Owusu", email: "esi@susu.test", role: "member", kind: "password" },
    { key: "yaw", name: "Yaw Darko", email: "yaw@susu.test", role: "member", kind: "oauth" },
    { key: "abena", name: "Abena Asante", email: "abena@susu.test", role: "member", kind: "password" },
    { key: "kojo", name: null, email: "kojo@susu.test", role: "member", kind: "unverified" },
];



export type Step =
    | { do: "pay"; user: UserKey; amount: string; selfRecorded: boolean }
    | { do: "close"; expect: "paid_out" | "blocked" };

export interface SeedGroup {
    key: string;

    name: string;
    weeklyAmount: string;

    members: UserKey[];

    start: boolean;
    steps: Step[];
}

const pay = (user: UserKey, amount: string, selfRecorded = false): Step => ({
    do: "pay",
    user,
    amount,
    selfRecorded,
});
const everyonePays = (users: UserKey[], amount: string): Step[] => users.map((u) => pay(u, amount));
const closePaidOut = (): Step => ({ do: "close", expect: "paid_out" });
const closeBlocked = (): Step => ({ do: "close", expect: "blocked" });

const MARKET: UserKey[] = ["ama", "abena", "yaw", "kofi"];
const CYCLE: UserKey[] = ["kofi", "esi", "yaw"];

export const SEED_GROUPS: SeedGroup[] = [
    {

        key: "friday",
        name: "Friday Susu",
        weeklyAmount: "50.00",
        members: ["ama", "kofi", "esi"],
        start: true,
        steps: [
            pay("ama", "50.00", true),
            pay("kofi", "50.00"),
            pay("esi", "30.00"),
            closeBlocked(),
            pay("esi", "20.00"),
            closePaidOut(),
            pay("ama", "50.00"),
            pay("kofi", "25.00"),
        ],
    },
    {

        key: "market",
        name: "Market Women Susu",
        weeklyAmount: "100.00",
        members: MARKET,
        start: true,
        steps: [
            ...everyonePays(MARKET, "100.00"),
            closePaidOut(),
            ...everyonePays(MARKET, "100.00"),
            closePaidOut(),
            pay("ama", "100.00"),
            pay("abena", "60.00"),
            pay("yaw", "100.00"),
            closeBlocked(),
        ],
    },
    {

        key: "completed",
        name: "Harvest Susu (completed)",
        weeklyAmount: "20.00",
        members: CYCLE,
        start: true,
        steps: [
            ...everyonePays(CYCLE, "20.00"),
            closePaidOut(),
            ...everyonePays(CYCLE, "20.00"),
            closePaidOut(),
            ...everyonePays(CYCLE, "20.00"),
            closePaidOut(),
        ],
    },
    {

        key: "weekend",
        name: "Weekend Savers",
        weeklyAmount: "75.50",
        members: ["ama", "esi", "abena"],
        start: false,
        steps: [],
    },
    {

        key: "neighbours",
        name: "Neighbours Susu",
        weeklyAmount: "30.00",
        members: [],
        start: false,
        steps: [],
    },
];



export type UserRow = typeof users.$inferSelect;
export type UsersByKey = Map<UserKey, UserRow>;

export const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "Password123!";


export async function seedUsers(): Promise<UsersByKey> {
    const passwordHash = await Bun.password.hash(SEED_PASSWORD);
    const byKey: UsersByKey = new Map();
    let inserted = 0;

    for (const u of SEED_USERS) {
        const base = { name: u.name, email: u.email, role: u.role };

        const values: typeof users.$inferInsert =
            u.kind === "oauth"
                ? {
                    ...base,
                    passwordHash: null,
                    oauthProvider: "google",
                    oauthId: `google-seed-${u.key}`,
                    isEmailVerified: true,
                }
                : u.kind === "unverified"
                    ? {
                        ...base,
                        passwordHash,
                        isEmailVerified: false,
                        emailVerificationCode: "123456",
                        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    }
                    : { ...base, passwordHash, isEmailVerified: true };

        const result = await db.insert(users).values(values).onConflictDoNothing({ target: users.email }).returning({ id: users.id });
        inserted += result.length;

        const [row] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
        byKey.set(u.key, row);
    }

    console.log(`users:         ${inserted} created, ${SEED_USERS.length - inserted} already existed`);
    return byKey;
}


export type GroupRow = typeof groups.$inferSelect;

export interface GroupsSeedResult {

    byKey: Map<string, GroupRow>;

    created: Set<string>;
}


export async function seedGroups(admin: UserRow): Promise<GroupsSeedResult> {
    const byKey = new Map<string, GroupRow>();
    const created = new Set<string>();

    for (const g of SEED_GROUPS) {
        const [existing] = await db
            .select()
            .from(groups)
            .where(and(eq(groups.name, g.name), eq(groups.createdBy, admin.id)))
            .limit(1);

        if (existing) {
            byKey.set(g.key, existing);
            continue;
        }

        const [row] = await db
            .insert(groups)
            .values({ name: g.name, weeklyAmount: toPesewas(g.weeklyAmount), createdBy: admin.id })
            .returning();
        byKey.set(g.key, row);
        created.add(g.key);
    }

    console.log(`groups:        ${created.size} created, ${SEED_GROUPS.length - created.size} already existed`);
    return { byKey, created };
}




export async function seedGroupMembers(users: UsersByKey, groups: GroupsSeedResult): Promise<void> {
    const rows: Array<typeof groupMembers.$inferInsert> = [];

    for (const g of SEED_GROUPS) {
        if (!groups.created.has(g.key)) continue;
        const group = groups.byKey.get(g.key);
        if (!group) throw new Error(`Seed group "${g.key}" was not created`);

        g.members.forEach((userKey, index) => {
            const user = users.get(userKey);
            if (!user) throw new Error(`Seed user "${userKey}" (group "${g.key}") does not exist`);
            rows.push({ groupId: group.id, userId: user.id, position: index + 1 });
        });
    }

    if (rows.length > 0) await db.insert(groupMembers).values(rows);
    console.log(`group members: ${rows.length} created`);
}



export async function seedTransactions(
    admin: UserRow,
    users: UsersByKey,
    groups: GroupsSeedResult,
): Promise<void> {
    let contributions = 0;
    let payouts = 0;

    for (const g of SEED_GROUPS) {
        if (!groups.created.has(g.key) || !g.start) continue;
        const group = groups.byKey.get(g.key);
        if (!group) throw new Error(`Seed group "${g.key}" was not created`);

        await groupsService.startWeek(group.id);

        for (const [i, step] of g.steps.entries()) {
            const where = `group "${g.name}", step ${i + 1}`;

            if (step.do === "pay") {
                const payer = users.get(step.user);
                if (!payer) throw new Error(`Unknown seed user "${step.user}" (${where})`);
                const recordedBy = step.selfRecorded ? payer : admin;

                await transactionsService.recordContribution(
                    group.id,
                    { userId: payer.id, amount: toPesewas(step.amount) },
                    recordedBy.id,
                );
                contributions++;
                continue;
            }

            const result = await transactionsService.closeWeek(group.id, admin.id);
            const actual = result.closed ? "paid_out" : "blocked";
            if (actual !== step.expect) {
                throw new Error(`Expected week close to be "${step.expect}" but got "${actual}" (${where})`);
            }

            if (result.closed) {
                payouts++;
                console.log(`  ${g.name}: week ${result.week} → ${result.payout.recipient.name ?? "?"} received ${formatGHS(toPesewas(result.payout.amount))}`);
            } else {
                console.log(`  ${g.name}: week ${result.week} blocked → ${result.message}`);
            }
        }
    }

    console.log(`transactions:  ${contributions} contributions + ${payouts} payouts created`);
}

main()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
        console.error(err);
        process.exit(1);
    });