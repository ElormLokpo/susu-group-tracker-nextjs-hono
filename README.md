# Susu Web Application 

A small web application that manages **rotating savings groups (susu)**. Members of a group each pay the same fixed amount of GHS 50 every week; each week the whole pot goes to one member, in the order they joined, until everyone has received it once.

Built with:
Client **Next.js**, **Zustand**, **Tanstack Query** and **Tailwind CSS**.
Backend **Hono** on **Bun**, **Drizzle ORM** and **Neon Postgres**. 


## What it does

1. An admin or group leader creates a **group** with a fixed weekly contribution in GHS (e.g. `50.00`).
2. The admin or group leader adds **members** (existing users). Join order = payout order.
3. The admin or group leader **starts** the group. Membership and payout order are now frozen and week 1 begins.
4. **Contributions** are recorded for the current week. Partial payments are allowed.
5. The admin or group leader **closes the week**:
   - everyone paid in full → the pot is paid to this week's recipient and the group moves to the next week;
   - otherwise → nothing is paid out and the response lists who still owes how much.
6. A **report** shows the current week, who has paid in full, who owes what, and the payout history.


---


### Folder structure

Frontend code is in `client/`. Backend code is in `server/`.

---

## Getting started

Requires [Bun](https://bun.sh) and a Neon Postgres database.

```bash
bun install
bun run db:migrate              
bun run dev                   
```
