package org.example.pbcpms_aiim.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Fallback mapper when {@link DatabaseUrlSupport#applyFromEnvironment()} was not run
 * (e.g. tests). Prefer main-time system properties for fat JAR deploys.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // System properties set in main() already win; still map into the Environment for clarity.
        String existing = environment.getProperty("SPRING_DATASOURCE_URL");
        if (existing != null && !existing.isBlank() && existing.startsWith("jdbc:") && !existing.contains("localhost")) {
            return;
        }
        String springUrl = environment.getProperty("spring.datasource.url");
        if (springUrl != null && springUrl.startsWith("jdbc:") && !springUrl.contains("localhost")) {
            return;
        }

        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            databaseUrl = environment.getProperty("DATABASE_PRIVATE_URL");
        }
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        try {
            DatabaseUrlSupport.Parsed parsed = DatabaseUrlSupport.parse(databaseUrl.trim());
            Map<String, Object> map = new HashMap<>();
            map.put("spring.datasource.url", parsed.jdbcUrl());
            if (!parsed.username().isEmpty()) {
                map.put("spring.datasource.username", parsed.username());
            }
            map.put("spring.datasource.password", parsed.password());
            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrl", map));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to map DATABASE_URL to spring.datasource.*", ex);
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
