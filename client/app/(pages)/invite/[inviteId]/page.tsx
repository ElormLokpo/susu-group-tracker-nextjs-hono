import { InvitePage } from "./invite-page";

export default async function Page({
    params,
}: {
    params: Promise<{ inviteId: string }>;
}) {
    const { inviteId } = await params;

    return <InvitePage inviteId={inviteId} />;
}