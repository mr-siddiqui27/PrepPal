package com.preppal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preppal.dto.GoalRequest;
import com.preppal.dto.GoalResponse;
import com.preppal.dto.ResourceLinkRequest;
import com.preppal.service.GoalService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GoalController.class)
@Import(com.preppal.config.SecurityConfig.class)
@DisplayName("GoalController WebMvc Slice Tests")
class GoalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GoalService goalService;

    @MockBean
    private com.preppal.security.JwtTokenProvider jwtTokenProvider;

    @MockBean
    private com.preppal.security.PrepPalUserDetailsService userDetailsService;

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfig {
        @org.springframework.context.annotation.Bean
        public com.preppal.security.JwtAuthenticationFilter jwtAuthenticationFilter(
                com.preppal.security.JwtTokenProvider tokenProvider,
                com.preppal.security.PrepPalUserDetailsService userDetailsService) {
            return new com.preppal.security.JwtAuthenticationFilter(tokenProvider, userDetailsService);
        }
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("GET /api/v1/goals: authenticated user returns 200 with goals list")
    void listGoals_authenticated_returns200() throws Exception {
        GoalResponse g = new GoalResponse();
        g.setId("g-1");
        g.setTitle("Crack FAANG SDE");
        g.setProgress(30);

        when(goalService.getGoals("student@example.com")).thenReturn(List.of(g));

        mockMvc.perform(get("/api/v1/goals").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("g-1"))
                .andExpect(jsonPath("$[0].title").value("Crack FAANG SDE"))
                .andExpect(jsonPath("$[0].progress").value(30));
    }

    @Test
    @DisplayName("GET /api/v1/goals: unauthenticated returns 401/403")
    void listGoals_unauthenticated_returnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/goals").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("POST /api/v1/goals: valid request returns 201 Created")
    void createGoal_valid_returns201() throws Exception {
        GoalRequest req = new GoalRequest();
        req.setTitle("Master React & Spring");

        GoalResponse res = new GoalResponse();
        res.setId("g-2");
        res.setTitle("Master React & Spring");

        when(goalService.createGoal(eq("student@example.com"), any(GoalRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/v1/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("g-2"))
                .andExpect(jsonPath("$.title").value("Master React & Spring"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("PATCH /api/v1/goals/{id}/status: updates status to PAUSED and returns 200")
    void updateGoalStatus_returns200() throws Exception {
        GoalResponse res = new GoalResponse();
        res.setId("g-1");
        res.setStatus("PAUSED");

        when(goalService.updateGoalStatus("student@example.com", "g-1", "PAUSED")).thenReturn(res);

        mockMvc.perform(patch("/api/v1/goals/g-1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "PAUSED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAUSED"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("PATCH /api/v1/goals/{id}/topics/{tid}/subtopics/{sid}/toggle: returns 200")
    void toggleSubtopic_returns200() throws Exception {
        GoalResponse res = new GoalResponse();
        res.setId("g-1");
        res.setProgress(100);

        when(goalService.toggleSubtopic("student@example.com", "g-1", "t-1", "s-1", true))
                .thenReturn(res);

        mockMvc.perform(patch("/api/v1/goals/g-1/topics/t-1/subtopics/s-1/toggle")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("completed", true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.progress").value(100));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("POST /api/v1/goals/{id}/resources: adds resource and returns 201 Created")
    void addGoalResource_returns201() throws Exception {
        ResourceLinkRequest req = new ResourceLinkRequest();
        req.setTitle("DSA Masterclass");
        req.setUrl("https://example.com/course");
        req.setType("Course");

        GoalResponse res = new GoalResponse();
        res.setId("g-1");

        when(goalService.addGoalResource(eq("student@example.com"), eq("g-1"), any(ResourceLinkRequest.class)))
                .thenReturn(res);

        mockMvc.perform(post("/api/v1/goals/g-1/resources")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("g-1"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    @DisplayName("DELETE /api/v1/goals/{id}: returns 204 No Content")
    void deleteGoal_returns204() throws Exception {
        mockMvc.perform(delete("/api/v1/goals/g-1"))
                .andExpect(status().isNoContent());

        verify(goalService).deleteGoal("student@example.com", "g-1");
    }
}
