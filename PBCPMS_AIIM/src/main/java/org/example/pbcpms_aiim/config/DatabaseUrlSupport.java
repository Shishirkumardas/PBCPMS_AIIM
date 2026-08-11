package org.example.pbcpms_aiim.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Maps cloud {@code DATABASE_URL} ({@code postgres://…}) to Spring datasource
 * system properties before the context starts.
 * <p>
 * EnvironmentPostProcessor registration can be missed in executable fat JARs
 * (META-INF may sit at the archive root rather than under BOOT-INF/classes),
 * so {@link #applyFromEnvironment()} is also invoked from {@code main}.
 */
public final class DatabaseUrlSupport {

    private DatabaseUrlSupport() {
    }

    /**
     * If {@code DATABASE_URL} is set and {@code SPRING_DATASOURCE_URL} is not,
     * set {@code spring.datasource.*} system properties (highest precedence).
     */
    public static void applyFromEnvironment() {
        String existingJdbc = firstNonBlank(
                System.getenv("SPRING_DATASOURCE_URL"),
                System.getProperty("SPRING_DATASOURCE_URL"),
                System.getProperty("spring.datasource.url")
        );
        if (existingJdbc != null && existingJdbc.startsWith("jdbc:") && !existingJdbc.contains("localhost")) {
            return;
        }

        String databaseUrl = firstNonBlank(
                System.getenv("DATABASE_URL"),
                System.getenv("DATABASE_PRIVATE_URL"),
                System.getProperty("DATABASE_URL")
        );

        if (databaseUrl == null || databaseUrl.isBlank()) {
            if (isRenderProfile()) {
                System.err.println(
                        "[pbcpms] WARNING: SPRING_PROFILES_ACTIVE=render but DATABASE_URL is not set. "
                                + "Link a Render PostgreSQL database (or set DATABASE_URL / SPRING_DATASOURCE_URL). "
                                + "Falling back to application.properties defaults (often localhost)."
                );
            }
            return;
        }

        try {
            Parsed parsed = parse(databaseUrl.trim());
            System.setProperty("spring.datasource.url", parsed.jdbcUrl());
            System.setProperty("SPRING_DATASOURCE_URL", parsed.jdbcUrl());
            if (!parsed.username().isEmpty()) {
                System.setProperty("spring.datasource.username", parsed.username());
                System.setProperty("SPRING_DATASOURCE_USERNAME", parsed.username());
            }
            // Always set password (may be empty)
            System.setProperty("spring.datasource.password", parsed.password());
            System.setProperty("SPRING_DATASOURCE_PASSWORD", parsed.password());
            System.out.println("[pbcpms] Datasource configured from DATABASE_URL -> " + redact(parsed.jdbcUrl()));
        } catch (Exception ex) {
            System.err.println("[pbcpms] ERROR: Failed to parse DATABASE_URL: " + ex.getMessage());
            throw new IllegalStateException("Invalid DATABASE_URL", ex);
        }
    }

    static Parsed parse(String databaseUrl) {
        String normalized = databaseUrl;
        if (normalized.startsWith("jdbc:postgresql://")) {
            return parseJdbc(normalized);
        }
        if (normalized.startsWith("postgres://")) {
            normalized = "postgresql://" + normalized.substring("postgres://".length());
        }
        if (normalized.startsWith("postgresql://")) {
            return parsePostgresUri(normalized);
        }
        if (normalized.startsWith("jdbc:")) {
            return new Parsed(normalized, "", "");
        }
        throw new IllegalArgumentException("Unsupported DATABASE_URL scheme (expected postgres:// or jdbc:postgresql://)");
    }

    private static Parsed parseJdbc(String jdbcUrl) {
        // jdbc:postgresql://user:pass@host:port/db?… is rare; usually user/pass are separate.
        // If credentials are embedded after //, extract them.
        String withoutPrefix = jdbcUrl.substring("jdbc:postgresql://".length());
        int at = withoutPrefix.lastIndexOf('@');
        if (at > 0 && withoutPrefix.indexOf('/') > at) {
            String userInfo = withoutPrefix.substring(0, at);
            String hostAndRest = withoutPrefix.substring(at + 1);
            String[] parts = userInfo.split(":", 2);
            String user = urlDecode(parts[0]);
            String pass = parts.length > 1 ? urlDecode(parts[1]) : "";
            String rebuilt = "jdbc:postgresql://" + hostAndRest;
            rebuilt = ensureSsl(rebuilt);
            return new Parsed(rebuilt, user, pass);
        }
        return new Parsed(ensureSsl(jdbcUrl), "", "");
    }

    /**
     * Parse {@code postgresql://user:pass@host:port/db?query} without relying solely on
     * {@link java.net.URI} (passwords may contain reserved characters).
     */
    private static Parsed parsePostgresUri(String postgresqlUrl) {
        String rest = postgresqlUrl.substring("postgresql://".length());
        int at = rest.lastIndexOf('@');
        if (at < 0) {
            throw new IllegalArgumentException("DATABASE_URL missing @userinfo@host");
        }
        String userInfo = rest.substring(0, at);
        String hostPart = rest.substring(at + 1);

        String[] userPass = userInfo.split(":", 2);
        String username = urlDecode(userPass[0]);
        String password = userPass.length > 1 ? urlDecode(userPass[1]) : "";

        // host:port/path?query
        String host;
        int port = 5432;
        String pathAndQuery;
        int slash = hostPart.indexOf('/');
        String hostPort = slash >= 0 ? hostPart.substring(0, slash) : hostPart;
        pathAndQuery = slash >= 0 ? hostPart.substring(slash) : "/pbcpms";

        int colon = hostPort.lastIndexOf(':');
        // IPv6 would be [..] — Render uses hostnames
        if (colon > 0 && hostPort.indexOf(']') < 0) {
            host = hostPort.substring(0, colon);
            port = Integer.parseInt(hostPort.substring(colon + 1));
        } else {
            host = hostPort;
        }

        String path;
        String query = "";
        int q = pathAndQuery.indexOf('?');
        if (q >= 0) {
            path = pathAndQuery.substring(0, q);
            query = pathAndQuery.substring(q);
        } else {
            path = pathAndQuery;
        }
        if (path == null || path.isBlank() || "/".equals(path)) {
            path = "/pbcpms";
        }
        if (query.isEmpty()) {
            query = "?sslmode=require";
        } else if (!query.contains("sslmode")) {
            query = query + "&sslmode=require";
        }

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + query;
        return new Parsed(jdbcUrl, username, password);
    }

    private static String ensureSsl(String jdbcUrl) {
        if (jdbcUrl.contains("sslmode=")) {
            return jdbcUrl;
        }
        return jdbcUrl.contains("?") ? jdbcUrl + "&sslmode=require" : jdbcUrl + "?sslmode=require";
    }

    private static boolean isRenderProfile() {
        String profiles = firstNonBlank(
                System.getenv("SPRING_PROFILES_ACTIVE"),
                System.getProperty("spring.profiles.active"),
                System.getProperty("SPRING_PROFILES_ACTIVE")
        );
        if (profiles == null) {
            return false;
        }
        for (String p : profiles.split(",")) {
            if ("render".equalsIgnoreCase(p.trim())) {
                return true;
            }
        }
        return false;
    }

    private static String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v;
            }
        }
        return null;
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String redact(String jdbcUrl) {
        // hide password if ever embedded
        return jdbcUrl.replaceAll("//([^:/@]+):([^@/]+)@", "//$1:***@");
    }

    record Parsed(String jdbcUrl, String username, String password) {
    }
}
