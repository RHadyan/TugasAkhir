# Bilingual content rollout

The first release is non-destructive: legacy `Country` and `Program` fields
remain in place and Indonesian writes continue to update them.

Run the rollout in this order:

1. Deploy the backend so the new Prisma models are available.
2. Apply the committed migration with the normal production migration command:
   `npx prisma migrate deploy`.
3. Run `npm run backfill:translations`.
   The command is idempotent and exits with an error unless every country and
   program has exactly one `id` row and one `en` row.
4. Deploy the bilingual admin.
5. Add English content progressively.
6. Deploy the localized public portal.

Do not remove the legacy text fields in this release. Empty English fields are
stored as `null` and resolve in this order: requested locale, Indonesian
translation, then legacy content.
