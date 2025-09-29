# v9.0.0

## Highlights

- Adopt LibreOffice 25.2 in the Lambda runtime (`convertTo` now shells out to `libreoffice25.2`) to stay aligned with the latest Shelf base image and benefit from upstream fixes.
- Replace the bespoke shell harness with a Podman-backed Lambda workflow. Use `pnpm test:integration` and `pnpm test:lambda` to exercise conversions end to end.
- Add reusable build scripts (`scripts/build-lambda.mjs` and helpers under `scripts/utils/`) to bundle the handler, manage containers, and surface conversion summaries.
- Improve failure diagnostics: `convertTo` now preserves LibreOffice stderr/stdout in the thrown error `cause` for easier debugging.

## Breaking changes

- Requires a base image that provides the `libreoffice25.2` binary (e.g. `public.ecr.aws/shelf/lambda-libreoffice-base:25.2-node22-x86_64`).
- Removes the legacy `test/` harness; Podman-backed tests are now the supported E2E workflow.

## Testing

- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:lambda -- --cleanup`

# v5.0.0

- Requires LibreOffice 7.4, instead of 7.3 previously
