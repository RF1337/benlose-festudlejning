# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## Database schema changes (Payload migrations)

This project uses Postgres (Supabase) and deploys on Vercel. Locally, `pnpm dev` auto-pushes schema changes to the database for convenience — but that auto-push is disabled in production, so it's not how schema changes reach the live site.

**Whenever you add, remove, or change a field on a collection, follow these steps in order:**

1. Make your change in `src/collections/*.ts` (or a global).
2. Run `pnpm migrate:create` locally. This looks at what changed and writes a migration file into `src/migrations/`. If the change is ambiguous (e.g. it can't tell whether a field was renamed or a new one added while an old one was dropped), it'll ask you a question in the terminal — answer it here, not at deploy time.
3. Commit the generated migration file(s) along with your collection change.
4. `git push`.

What happens after you push: Vercel picks up the push, runs the configured build command (`pnpm build`), which itself runs `pnpm migrate` before `next build`. `pnpm migrate` applies any migration files it hasn't seen yet to the production database, then the app builds and deploys.

**Important:** Vercel only *applies* migration files that already exist in the repo — it never generates one from a live diff. If you push a collection change without running `pnpm migrate:create` first and committing the result, the deploy will succeed but the database won't have the new field/table, and the live site will error the moment it touches that field. The migration file has to exist in the repo *before* you push.

**No separate dev database:** this project has one Postgres database total (no separate local/staging instance). Running `pnpm migrate` or `pnpm build` locally applies migrations to the same database the live site uses — there's no sandbox to test a migration in first, so it's worth glancing at a generated migration file before committing it.

Migration files live in `src/migrations/`. Useful commands:

- `pnpm migrate:create` — generate a new migration from the current schema diff
- `pnpm migrate` — apply any pending migrations (also runs automatically as part of `pnpm build`)

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
