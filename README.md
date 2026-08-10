# School Card

School Card contains a React frontend and a Puppeteer/Express backend for generating downloadable school cards.

## Production container registry

Production images are stored in the private Harbor project `school-card`:

- Backend: `registry.mahdi.pro/school-card/backend:<tag>`

The project also reserves the `frontend` repository, but production frontend assets deploy to GitHub Pages and are not published to Harbor.

Repository-scoped robot credentials are stored locally and are never committed:

- `.secrets/registry/school-card-prod-pull-robot.yaml` — pull only, for deployments and image consumers.
- `.secrets/registry/school-card-prod-push-robot.yaml` — image publishing and pull access.

Neither robot has repository delete access. Both credentials are project-wide and therefore cover every repository in the dedicated private `school-card` project. This workspace uses only `backend` and `frontend`; do not add unrelated repositories to the project.

The `backend` repository already exists in Harbor. Do not create or publish the unused `frontend` repository while GitHub Pages remains the frontend deployment strategy.

### Registry login

The examples use [`yq`](https://github.com/mikefarah/yq) and pass passwords through standard input. Do not enable shell tracing while handling credentials.

For publishing:

```bash
credential=.secrets/registry/school-card-prod-push-robot.yaml
registry=$(yq -r '.registry' "$credential")
user=$(yq -r '.user' "$credential")
yq -r '.password' "$credential" | docker login "$registry" --username "$user" --password-stdin
unset credential registry user
```

For deployment or pull-only access, use `.secrets/registry/school-card-prod-pull-robot.yaml` with the same command.

### Build and publish

Use an immutable release tag such as the Git commit SHA:

```bash
tag=$(git rev-parse --short=12 HEAD)
backend_image="registry.mahdi.pro/school-card/backend:$tag"

docker build --tag "$backend_image" backend
docker push "$backend_image"
```

Pull and logout when finished:

```bash
docker pull "registry.mahdi.pro/school-card/backend:$tag"
docker logout registry.mahdi.pro
```

### Deployment status

`build.gradle.kts` builds and pushes the backend image and requires an explicit immutable tag:

```bash
./gradlew buildAndPushBackendImage -PbackendImageTag="$tag"
```

The production frontend deploys to GitHub Pages and is not built or published as a Harbor image. The retired Waypoint configuration has been removed. Kubernetes deployment manifests, including the digest pin and runtime pull secret, are maintained in the separate `cluster-1-deployments` repository. Use the pull-only robot for runtime image pulls.

## Analytics

See [`docs/analytics.md`](docs/analytics.md) for the Umami privacy contract, verification commands, and renderer rollout order.
