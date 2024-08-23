plugins {
    id("base")
}

val backendImageRepo = "registry.cluster.mahdi.cloud/school-card/backend"
val backendImageVersion = "2022-09-13"
val backendImageRef = "$backendImageRepo:${backendImageVersion}"

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
