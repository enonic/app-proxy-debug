plugins {
    `maven-publish`
    id("com.enonic.xp.app")
    alias(libs.plugins.enonic.defaults)
}

dependencies {
    implementation(xplibs.api.core)
    implementation(xplibs.api.portal)
    include(xplibs.auth)
    include(xplibs.portal)
    include(xplibs.websocket)
    include(xplibs.task)
    include(libs.lib.http.client)
    include(libs.lib.mustache)

    testImplementation(xplibs.testing)
    testImplementation(platform(libs.junit.bom))
    testImplementation(libs.junit.jupiter)
    testRuntimeOnly(libs.junit.platform.launcher)
}

repositories {
    mavenLocal()
    mavenCentral()
    xp.enonicRepo("dev")
}

tasks.test {
    useJUnitPlatform()
}

app {
    scriptEngine = "GraalJS"
}
