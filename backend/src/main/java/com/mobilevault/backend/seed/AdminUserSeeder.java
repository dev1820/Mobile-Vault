package com.mobilevault.backend.seed;

import com.mobilevault.backend.entity.AdminUser;
import com.mobilevault.backend.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin-seed.username:}")
    private String seedUsername;

    @Value("${app.admin-seed.password:}")
    private String seedPassword;

    public AdminUserSeeder(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() > 0) {
            return;
        }

        if (seedUsername.isBlank() || seedPassword.isBlank()) {
            log.warn("No admin user exists and ADMIN_SEED_USERNAME/ADMIN_SEED_PASSWORD are not set. " +
                    "Set these environment variables and restart the app to create the first admin login.");
            return;
        }

        AdminUser adminUser = new AdminUser(seedUsername, passwordEncoder.encode(seedPassword));
        adminUserRepository.save(adminUser);
        log.info("Seeded initial admin user '{}'.", seedUsername);
    }
}
