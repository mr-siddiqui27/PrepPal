package com.preppal.service;

import com.preppal.dto.GoalRequest;
import com.preppal.dto.GoalResponse;
import com.preppal.dto.ResourceLinkRequest;
import com.preppal.dto.SubtopicRequest;
import com.preppal.dto.TopicRequest;
import com.preppal.exception.ResourceNotFoundException;
import com.preppal.model.Goal;
import com.preppal.model.Role;
import com.preppal.model.Subtopic;
import com.preppal.model.Topic;
import com.preppal.model.User;
import com.preppal.repository.GoalRepository;
import com.preppal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GoalService Unit Tests")
class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private UserRepository userRepository;

    private GoalService goalService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        goalService = new GoalService(goalRepository, userRepository);

        sampleUser = new User("Jane Doe", "jane@example.com", "hashed_pwd", Role.STUDENT, Instant.now());
        sampleUser.setId("usr-123");
    }

    @Test
    @DisplayName("createGoal: resolves userId from email and saves new goal")
    void createGoal_validInput_savesAndReturnsGoalResponse() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> {
            Goal g = invocation.getArgument(0);
            g.setId("goal-1");
            return g;
        });

        GoalRequest req = new GoalRequest();
        req.setTitle("Master System Design");
        req.setCategory("CS Fundamentals");
        req.setPriority("HIGH");
        req.setStatus("ACTIVE");
        req.setTargetDate(LocalDate.now().plusMonths(3));

        GoalResponse res = goalService.createGoal("jane@example.com", req);

        assertThat(res).isNotNull();
        assertThat(res.getId()).isEqualTo("goal-1");
        assertThat(res.getTitle()).isEqualTo("Master System Design");
        assertThat(res.getCategory()).isEqualTo("CS Fundamentals");
        assertThat(res.getPriority()).isEqualTo("HIGH");
        assertThat(res.getStatus()).isEqualTo("ACTIVE");
        assertThat(res.getProgress()).isEqualTo(-1);

        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    @DisplayName("getGoals: lists goals owned by resolved user")
    void getGoals_returnsUserGoals() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));

        Goal g1 = new Goal();
        g1.setId("g1");
        g1.setUserId("usr-123");
        g1.setTitle("Goal 1");

        when(goalRepository.findByUserIdOrderByCreatedAtDesc("usr-123")).thenReturn(List.of(g1));

        List<GoalResponse> list = goalService.getGoals("jane@example.com");

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getTitle()).isEqualTo("Goal 1");
    }

    @Test
    @DisplayName("getGoal: throws ResourceNotFoundException when goal does not exist or user mismatch")
    void getGoal_notFound_throwsException() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("nonexistent", "usr-123")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> goalService.getGoal("jane@example.com", "nonexistent"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Goal not found");
    }

    @Test
    @DisplayName("deleteGoal: verifies ownership and deletes goal")
    void deleteGoal_existingGoal_deletesSuccessfully() {
        Goal g = new Goal();
        g.setId("g1");
        g.setUserId("usr-123");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("g1", "usr-123")).thenReturn(Optional.of(g));

        goalService.deleteGoal("jane@example.com", "g1");

        verify(goalRepository).deleteByIdAndUserId("g1", "usr-123");
    }

    @Test
    @DisplayName("addTopic, addSubtopic, and toggleSubtopic calculates derived progress and counts")
    void topicAndSubtopicFlow_calculatesProgressAccurately() {
        Goal g = new Goal();
        g.setId("g1");
        g.setUserId("usr-123");
        g.setTitle("DSA Master");
        g.setTopics(new ArrayList<>());

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("g1", "usr-123")).thenReturn(Optional.of(g));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 1. Add topic
        TopicRequest topicReq = new TopicRequest();
        topicReq.setTitle("Binary Trees");
        GoalResponse afterTopic = goalService.addTopic("jane@example.com", "g1", topicReq);

        assertThat(afterTopic.getTopics()).hasSize(1);
        String topicId = afterTopic.getTopics().get(0).getId();

        // 2. Add two subtopics
        SubtopicRequest s1 = new SubtopicRequest();
        s1.setTitle("Traversals");
        goalService.addSubtopic("jane@example.com", "g1", topicId, s1);

        SubtopicRequest s2 = new SubtopicRequest();
        s2.setTitle("LCA");
        GoalResponse afterSubtopics = goalService.addSubtopic("jane@example.com", "g1", topicId, s2);

        String subtopic1Id = afterSubtopics.getTopics().get(0).getSubtopics().get(0).getId();

        // Initially progress should be 0% (0 of 2 complete)
        assertThat(afterSubtopics.getProgress()).isEqualTo(0);
        assertThat(afterSubtopics.getTotalSubtopics()).isEqualTo(2);
        assertThat(afterSubtopics.getCompletedSubtopics()).isEqualTo(0);
        assertThat(afterSubtopics.getTopics().get(0).getProgress()).isEqualTo(0);

        // 3. Toggle 1 subtopic to true -> 50%
        GoalResponse afterToggle = goalService.toggleSubtopic("jane@example.com", "g1", topicId, subtopic1Id, true);
        assertThat(afterToggle.getProgress()).isEqualTo(50);
        assertThat(afterToggle.getCompletedSubtopics()).isEqualTo(1);
        assertThat(afterToggle.getTopics().get(0).getProgress()).isEqualTo(50);
        assertThat(afterToggle.getTopics().get(0).getSubtopics().get(0).isCompleted()).isTrue();
    }

    @Test
    @DisplayName("updateGoalStatus: updates and normalizes status (e.g. Active -> ACTIVE, Paused -> PAUSED)")
    void updateGoalStatus_normalizesAndSaves() {
        Goal g = new Goal();
        g.setId("g1");
        g.setUserId("usr-123");
        g.setStatus("NOT_STARTED");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("g1", "usr-123")).thenReturn(Optional.of(g));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GoalResponse res = goalService.updateGoalStatus("jane@example.com", "g1", "Paused");
        assertThat(res.getStatus()).isEqualTo("PAUSED");

        GoalResponse res2 = goalService.updateGoalStatus("jane@example.com", "g1", "Active");
        assertThat(res2.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    @DisplayName("notes at all 3 levels: goal, topic, and subtopic notes update independently")
    void notesAtAllThreeLevels_updateIndependently() {
        Goal g = new Goal();
        g.setId("g1");
        g.setUserId("usr-123");

        Topic t = new Topic();
        t.setId("t1");
        t.setTitle("Dynamic Programming");

        Subtopic s = new Subtopic();
        s.setId("s1");
        s.setTitle("Knapsack 0/1");

        t.getSubtopics().add(s);
        g.getTopics().add(t);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("g1", "usr-123")).thenReturn(Optional.of(g));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Update Goal notes
        goalService.updateGoalNotes("jane@example.com", "g1", "Goal level note: Revise weekly");
        assertThat(g.getNotes()).isEqualTo("Goal level note: Revise weekly");

        // Update Topic notes
        goalService.updateTopicNotes("jane@example.com", "g1", "t1", "Topic level note: Practice top-down first");
        assertThat(t.getNotes()).isEqualTo("Topic level note: Practice top-down first");

        // Update Subtopic notes
        goalService.updateSubtopicNotes("jane@example.com", "g1", "t1", "s1", "Subtopic note: Space optimization to 1D array");
        assertThat(s.getNotes()).isEqualTo("Subtopic note: Space optimization to 1D array");

        // Verify independent values
        assertThat(g.getNotes()).isEqualTo("Goal level note: Revise weekly");
        assertThat(t.getNotes()).isEqualTo("Topic level note: Practice top-down first");
        assertThat(s.getNotes()).isEqualTo("Subtopic note: Space optimization to 1D array");
    }

    @Test
    @DisplayName("resources at all 3 levels: add resources to goal, topic, and subtopic independently")
    void resourcesAtAllThreeLevels_addAndPreserveIndependently() {
        Goal g = new Goal();
        g.setId("g1");
        g.setUserId("usr-123");

        Topic t = new Topic();
        t.setId("t1");
        t.setTitle("Graphs");

        Subtopic s = new Subtopic();
        s.setId("s1");
        s.setTitle("Dijkstra");

        t.getSubtopics().add(s);
        g.getTopics().add(t);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(sampleUser));
        when(goalRepository.findByIdAndUserId("g1", "usr-123")).thenReturn(Optional.of(g));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResourceLinkRequest rGoal = new ResourceLinkRequest();
        rGoal.setTitle("Overall Roadmap Video");
        rGoal.setUrl("https://youtube.com/watch?v=123");
        rGoal.setType("Video");

        ResourceLinkRequest rTopic = new ResourceLinkRequest();
        rTopic.setTitle("Graph Theory Article");
        rTopic.setUrl("https://example.com/graphs");
        rTopic.setType("Article");

        ResourceLinkRequest rSub = new ResourceLinkRequest();
        rSub.setTitle("Dijkstra Visualization");
        rSub.setUrl("https://visualgo.net/en/sssp");
        rSub.setType("Practice");

        goalService.addGoalResource("jane@example.com", "g1", rGoal);
        goalService.addTopicResource("jane@example.com", "g1", "t1", rTopic);
        GoalResponse res = goalService.addSubtopicResource("jane@example.com", "g1", "t1", "s1", rSub);

        assertThat(res.getResources()).hasSize(1);
        assertThat(res.getResources().get(0).getTitle()).isEqualTo("Overall Roadmap Video");

        assertThat(res.getTopics().get(0).getResources()).hasSize(1);
        assertThat(res.getTopics().get(0).getResources().get(0).getTitle()).isEqualTo("Graph Theory Article");

        assertThat(res.getTopics().get(0).getSubtopics().get(0).getResources()).hasSize(1);
        assertThat(res.getTopics().get(0).getSubtopics().get(0).getResources().get(0).getTitle()).isEqualTo("Dijkstra Visualization");
    }
}
