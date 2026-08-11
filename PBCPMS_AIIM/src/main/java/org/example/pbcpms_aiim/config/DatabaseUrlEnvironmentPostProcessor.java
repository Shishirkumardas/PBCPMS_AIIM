package org.example.pbcpms_aiim.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * On Render, DATABASE_URL is often {@code postgres://user:pass@host:port/db}.
 * This processor maps it to spring.datasource.* when SPRING_DATASOURCE_URL is unset.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String existing = environment.getProperty("SPRING_DATASOURCE_URL");
        if (existing != null && !existing.isBlank()) {
            return;
        }
        // Also skip if spring.datasource.url already set via SPRING_DATASOURCE_URL style binding
        String springUrl = environment.getProperty("spring.datasource.url");
        if (springUrl != null && springUrl.startsWith("jdbc:")) {
            // Only treat as "already set" when not the default localhost placeholder
            if (!springUrl.contains("localhost")) {
                return;
            }
        }

        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        try {
            String normalized = databaseUrl;
            if (normalized.startsWith("postgres://")) {
                normalized = "postgresql://" + normalized.substring("postgres://".length());
            }
            if (!normalized.startsWith("postgresql://") && !normalized.startsWith("jdbc:")) {
                return;
            }
            if (normalized.startsWith("jdbc:")) {
                Map<String, Object> map = new HashMap<>();
                map.put("spring.datasource.url", normalized);
                environment.getPropertySources().addFirst(new MapPropertySource("databaseUrl", map));
                return;
            }

            URI uri = URI.create(normalized);
            String userInfo = uri.getUserInfo();
            String username = "";
            String password = "";
            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                username = urlDecode(parts[0]);
                password = parts.length > 1 ? urlDecode(parts[1]) : "";
            }
            String path = uri.getPath() != null && uri.getPath().length() > 1 ? uri.getPath() : "/pbcpms";
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String query = uri.getQuery() != null ? "?" + uri.getQuery() : "";
            // SSL is required on most cloud Postgres providers
            if (query.isEmpty()) {
                query = "?sslmode=require";
            } else if (!query.contains("sslmode")) {
                query = query + "&sslmode=require";
            }

            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + query;

            Map<String, Object> map = new HashMap<>();
            map.put("spring.datasource.url", jdbcUrl);
            map.put("spring.datasource.username", username);
            map.put("spring.datasource.password", password);
            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrl", map));
        } catch (Exception ignored) {
            // leave defaults
        }
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
