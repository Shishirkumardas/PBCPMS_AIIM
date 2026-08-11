package org.example.pbcpms_aiim;

import org.example.pbcpms_aiim.config.DatabaseUrlSupport;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PbcpmsAiimApplication {

    public static void main(String[] args) {
        // Convert postgres:// DATABASE_URL / DB_URL → jdbc + DB_* system properties
        // before Spring resolves application.properties placeholders.
        DatabaseUrlSupport.applyFromEnvironment();
        SpringApplication.run(PbcpmsAiimApplication.class, args);
    }

}
