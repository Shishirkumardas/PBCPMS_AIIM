package org.example.pbcpms_aiim.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Ensures {@code DB_URL} / {@code DATABASE_URL} work with Spring's JDBC driver.
 * <p>
 * Render often injects {@code postgres://user:pass@host/db}. This converts that
 * to {@code jdbc:postgresql://…} and sets {@code DB_URL}, {@code DB_USERNAME},
 * {@code DB_PASSWORD} (and {@code spring.datasource.*}) as system properties
 * before the context starts — matching the sb_ai_full env-var style.
 */
public final class DatabaseUrlSupport {

    private DatabaseUrlSupport() {
    }

    public static void applyFromEnvironment() {
        String rawUrl = firstNonBlank(
                System.getenv("DB_URL"),
                System.getProperty("DB_URL"),
                System.getenv("DATABASE_URL"),
                System.getenv("DATABASE_PRIVATE_URL"),
                System.getProperty("DATABASE_URL")
        );

        if (rawUrl == null || rawUrl.isBlank()) {
            System.err.println(
                    "[pbcpms] WARNING: DB_URL / DATABASE_URL is not set. "
                            + "Set DB_URL (jdbc:postgresql://…), DB_USERNAME, DB_PASSWORD on Render."
            );
            return;
        }

        try {
            String trimmed = rawUrl.trim();
            if (trimmed.startsWith("jdbc:postgresql://") || trimmed.startsWith("jdbc:")) {
                // Already JDBC — still ensure sslmode on cloud hosts if missing
                if (trimmed.startsWith("jdbc:postgresql://") && !trimmed.contains("sslmode=")
                        && !trimmed.contains("localhost")) {
                    trimmed = ensureSsl(trimmed);
                    System.setProperty("DB_URL", trimmed);
                    System.setProperty("spring.datasource.url", trimmed);
                }
                // If user/pass only in separate env vars, leave them to Spring
                copyEnvToSystemPropertyIfPresent("DB_USERNAME", "spring.datasource.username");
                copyEnvToSystemPropertyIfPresent("DB_PASSWORD", "spring.datasource.password");
                System.out.println("[pbcpms] Datasource DB_URL (JDBC) -> " + redact(trimmed));
                return;
            }

            Parsed parsed = parse(trimmed);
            System.setProperty("DB_URL", parsed.jdbcUrl());
            System.setProperty("spring.datasource.url", parsed.jdbcUrl());

            String username = firstNonBlank(
                    System.getenv("DB_USERNAME"),
                    System.getProperty("DB_USERNAME"),
                    parsed.username()
            );
            String password = firstNonBlank(
                    System.getenv("DB_PASSWORD"),
                    System.getProperty("DB_PASSWORD"),
                    parsed.password()
            );
            if (username == null) {
                username = "";
            }
            if (password == null) {
                password = "";
            }
            System.setProperty("DB_USERNAME", username);
            System.setProperty("DB_PASSWORD", password);
            System.setProperty("spring.datasource.username", username);
            System.setProperty("spring.datasource.password", password);

            System.out.println("[pbcpms] Datasource configured from URL -> " + redact(parsed.jdbcUrl()));
        } catch (Exception ex) {
            System.err.println("[pbcpms] ERROR: Failed to parse DB_URL/DATABASE_URL: " + ex.getMessage());
            throw new IllegalStateException("Invalid DB_URL / DATABASE_URL", ex);
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
        throw new IllegalArgumentException(
                "Unsupported DB_URL scheme (expected postgres:// or jdbc:postgresql://)");
    }

    private static Parsed parseJdbc(String jdbcUrl) {
        String withoutPrefix = jdbcUrl.substring("jdbc:postgresql://".length());
        int at = withoutPrefix.lastIndexOf('@');
        if (at > 0 && withoutPrefix.indexOf('/') > at) {
            String userInfo = withoutPrefix.substring(0, at);
            String hostAndRest = withoutPrefix.substring(at + 1);
            String[] parts = userInfo.split(":", 2);
            String user = urlDecode(parts[0]);
            String pass = parts.length > 1 ? urlDecode(parts[1]) : "";
            String rebuilt = ensureSsl("jdbc:postgresql://" + hostAndRest);
            return new Parsed(rebuilt, user, pass);
        }
        return new Parsed(ensureSsl(jdbcUrl), "", "");
    }

    private static Parsed parsePostgresUri(String postgresqlUrl) {
        String rest = postgresqlUrl.substring("postgresql://".length());
        int at = rest.lastIndexOf('@');
        if (at < 0) {
            throw new IllegalArgumentException("URL missing userinfo@host");
        }
        String userInfo = rest.substring(0, at);
        String hostPart = rest.substring(at + 1);

        String[] userPass = userInfo.split(":", 2);
        String username = urlDecode(userPass[0]);
        String password = userPass.length > 1 ? urlDecode(userPass[1]) : "";

        String host;
        int port = 5432;
        String pathAndQuery;
        int slash = hostPart.indexOf('/');
        String hostPort = slash >= 0 ? hostPart.substring(0, slash) : hostPart;
        pathAndQuery = slash >= 0 ? hostPart.substring(slash) : "/pbcpms";

        int colon = hostPort.lastIndexOf(':');
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

    private static void copyEnvToSystemPropertyIfPresent(String envKey, String springKey) {
        String v = firstNonBlank(System.getenv(envKey), System.getProperty(envKey));
        if (v != null) {
            System.setProperty(envKey, v);
            System.setProperty(springKey, v);
        }
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
        return jdbcUrl.replaceAll("//([^:/@]+):([^@/]+)@", "//$1:***@");
    }

    record Parsed(String jdbcUrl, String username, String password) {
    }
}
