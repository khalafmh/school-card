plugins {
    id("base")
}

val backendImageRepo = "registry.mahdi.pro/school-card/backend"
val backendImageTag = providers.gradleProperty("backendImageTag").orNull
    ?: error("Set -PbackendImageTag to an immutable release tag before building an image")
val backendImageRef = "$backendImageRepo:$backendImageTag"

tasks.register<Exec>("buildBackendImage") {
    group = "deployment"

    workingDir = file(project.relativePath("backend"))
    commandLine(
        "docker",
        "build",
        ".",
        "--tag=$backendImageRef",
        "--progress=plain",
    )
}

tasks.register<Exec>("pushBackendImage") {
    group = "deployment"
    mustRunAfter("buildBackendImage")

    commandLine(
        "docker",
        "push",
        backendImageRef,
    )
}

tasks.register("buildAndPushBackendImage") {
    group = "deployment"
    dependsOn(
        "buildBackendImage",
        "pushBackendImage",
    )
}
