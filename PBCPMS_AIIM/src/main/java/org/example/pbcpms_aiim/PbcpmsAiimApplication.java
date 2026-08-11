package org.example.pbcpms_aiim;

import org.example.pbcpms_aiim.config.DatabaseUrlSupport;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PbcpmsAiimApplication {

    public static void main(String[] args) {
        // Must run before Spring context: fat-JAR packaging can hide EnvironmentPostProcessor
        // registration, which left DATABASE_URL unmapped and defaulted to localhost:5432.
        DatabaseUrlSupport.applyFromEnvironment();
        SpringApplication.run(PbcpmsAiimApplication.class, args);
    }

}
