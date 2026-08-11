package org.example.pbcpms_aiim.services;

import lombok.RequiredArgsConstructor;
import org.example.pbcpms_aiim.Repository.UserRepository;
import org.example.pbcpms_aiim.dto.auth.AuthResponse;
import org.example.pbcpms_aiim.dto.auth.LoginRequest;
import org.example.pbcpms_aiim.dto.auth.RegisterRequest;
import org.example.pbcpms_aiim.dto.auth.UserDto;
import org.example.pbcpms_aiim.enums.Role;
import org.example.pbcpms_aiim.exception.ApiException;
import org.example.pbcpms_aiim.models.Users;
import org.example.pbcpms_aiim.security.JwtService;
import org.example.pbcpms_aiim.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw ApiException.conflict("Email is already registered");
        }

        Users user = Users.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.OWNER)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Users user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> ApiException.notFound("User not found"));

        if (!user.isActive()) {
            throw ApiException.forbidden("Account is deactivated");
        }

        return toAuthResponse(user);
    }

    public UserDto me(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return UserDto.from(user);
    }

    public List<UserDto> listOwners() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.OWNER)
                .map(UserDto::from)
                .toList();
    }

    private AuthResponse toAuthResponse(Users user) {
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }
}
