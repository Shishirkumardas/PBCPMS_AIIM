package org.example.pbcpms_aiim.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatabaseUrlSupportTest {

    @Test
    void parsesRenderStylePostgresUrl() {
        DatabaseUrlSupport.Parsed parsed = DatabaseUrlSupport.parse(
                "postgres://pbcpms:s3cret@dpg-abc-a.oregon-postgres.render.com:5432/pbcpms"
        );
        assertEquals("pbcpms", parsed.username());
        assertEquals("s3cret", parsed.password());
        assertTrue(parsed.jdbcUrl().startsWith("jdbc:postgresql://dpg-abc-a.oregon-postgres.render.com:5432/pbcpms"));
        assertTrue(parsed.jdbcUrl().contains("sslmode=require"));
    }

    @Test
    void parsesUrlEncodedPassword() {
        DatabaseUrlSupport.Parsed parsed = DatabaseUrlSupport.parse(
                "postgres://user:p%40ss%3Aword@db.example.com/mydb"
        );
        assertEquals("user", parsed.username());
        assertEquals("p@ss:word", parsed.password());
        assertTrue(parsed.jdbcUrl().contains("jdbc:postgresql://db.example.com:5432/mydb"));
    }

    @Test
    void acceptsExistingJdbcUrl() {
        DatabaseUrlSupport.Parsed parsed = DatabaseUrlSupport.parse(
                "jdbc:postgresql://localhost:5432/pbcpms?sslmode=disable"
        );
        assertEquals("jdbc:postgresql://localhost:5432/pbcpms?sslmode=disable", parsed.jdbcUrl());
    }
}
