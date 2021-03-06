package io.revlearners.model.services;

import io.revlearners.model.bean.*;
import io.revlearners.model.bo.ChallengeInfoBo;
import io.revlearners.model.dao.interfaces.*;
import io.revlearners.model.services.interfaces.IChallengeService;
import io.revlearners.util.commons.configs.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChallengeService extends CrudService<Question> implements IChallengeService {

    @Autowired
    IChallengeRepository challengeRepo;

    @Autowired
    IAttemptRepository attemptRepo;

    @Autowired
    IQuestionRepository questionRepo;

    @Autowired
    IQuestionOptionRepository optionsRepo;

    @Autowired
    IUserRepository userRepo;


    /**
     * save a given question
     *
     * @param question
     * @return
     */
    @Override
    public Question saveQuestion(Question question) {
        Set<QuestionOption> options = question.getOptions();

        question.setDifficulty(new QuestionDifficulty(Constants.DIFFICULTY_EASY));
        question.setType(new QuestionType(Constants.QUESTION_MULTI_CHOICE));
        question.setOptions(new HashSet<>());
        Question savedQ = questionRepo.save(question);


        for (QuestionOption o: options) {
            o.setQuestion(savedQ);
        }
        optionsRepo.save(options);
        savedQ.setOptions(options);
        return savedQ;
    }

    /**
     * answers map maps question id to the list of selected answers for said id
     * the received attempt is nothing but a shell; have to fetch questions from db
     * to get access to correct options, difficulty, etc
     * <p>
     * for now only one answer can be selected for a question
     *
     * @param attempt
     * @return
     */
    @Override
    public ChallengeAttempt submitChallengeAttempt(ChallengeAttempt attempt) {
        Set<Question> questions = attempt.getChallenge().getQuiz().getQuestions();
        Set<QuestionOption> options = attempt.getAnswers();
        float score = scoreAll(questions, distillOptions(options));
        attempt.setScore(score);
        return attemptRepo.save(attempt);
    }

    /**
     * separates list of questions into a map of question to selected answers list
     * @param flattened
     * @return
     */
    private Map<Long, List<QuestionOption>> distillOptions(Set<QuestionOption> flattened) {

        Map<Long, List<QuestionOption>> questionAnswersMap = new HashMap<>();
        for (QuestionOption option : flattened) {
            Long qId = option.getQuestion().getId();
            if (!questionAnswersMap.containsKey(qId))
                questionAnswersMap.put(qId, new ArrayList<>());
            questionAnswersMap.get(qId).add(option);
        }
        return questionAnswersMap;
    }


    /**
     * calculates the score given a set answered questions
     * assumes only one question is correct per question
     *
     * @param quizQuestions
     * @return
     */
    private float scoreAll(Set<Question> quizQuestions, Map<Long, List<QuestionOption>> selected) {
        float score = 0;
        for (Question q : quizQuestions) {
            List<QuestionOption> selectedForQ = selected.get(q.getId());
            if (selectedForQ != null) {     // unanswered questions are skipped
                score += scoreOne(q, selectedForQ);
            }
        }
        return score;
    }

    /**
     * assumes each question only has one correct option; can be easily extended later
     *
     * @param question
     * @param selectedOptions
     * @return
     */
    private float scoreOne(Question question, List<QuestionOption> selectedOptions) {
        QuestionOption selected = selectedOptions.get(0);   // todo: only one answer selected for now
        boolean answeredCorrectly = question .getOptions().stream()
                .anyMatch(option -> option.isCorrect() && option.getId().equals(selected.getId()));

        if (answeredCorrectly)
            return question.getDifficulty().getMultiplier() * question.getType().getBaseVal();

        return 0;
    }

    private float calculateMaxScore(Set<Question> questions) {
        float score = 0;
        for (Question q: questions)
            score += q.getDifficulty().getMultiplier() * q.getType().getBaseVal();
        return score;
    }

    /**
     * generates a random list of questions in the specified topic;
     * <d>options are shuffled for each question</d> can't shuffle sets
     * <p>
     * todo: why does the return challenge return user with all nulls
     * except for the id, instead of reloading the members for the saved
     * attempt(including the users)
     *
     * @param info
     * @return
     */
    @Override
    public Challenge generateChallenge(ChallengeInfoBo info) {
        Set<Question> questions = questionRepo.generateQuestions(info.getTopicId(), info.getNumQuestions());
        Quiz quiz = new Quiz(questions, LocalDateTime.now());
        quiz.setMaxScore(calculateMaxScore(questions));

        Set<User> users = info.getReceiverIds().stream()
                .map(id -> {
                    User u = new User();
                    u.setId(id);
                    return u;
                }).collect(Collectors.toSet());
        User sender = new User();
        sender.setId(info.getSenderId());
        users.add(sender);

        Challenge challenge = challengeRepo.save(new Challenge(quiz, new HashSet<>()));
        for (User u: users)
            challenge.getUsers().add(userRepo.findOne(u.getId()));
        challengeRepo.saveAndFlush(challenge);
        return challenge;
    }

    @Override
    public List<Challenge> getChallengesByUser(long userId) {
        User user = new User();
        user.setId(userId);
        return new ArrayList<>(challengeRepo.getByUsersContains(user));
    }


    @Override
    public Challenge getChallengeById(long id) {
        Challenge res = challengeRepo.findOne(id);

        // mask it so front end doesn't know which ones are correct
        // nulling it seems to set that value in the db though
        for (Question question: res.getQuiz().getQuestions())
            for (QuestionOption opt: question.getOptions())
                opt.setCorrect(false);
        return res;
    }

    @Override
    public List<ChallengeAttempt> getChallengeAttemptsByUser(long challengeId, long userId) {
        User user = new User();
        user.setId(challengeId);
        Challenge challenge = new Challenge();
        challenge.setId(userId);
        return new ArrayList<>(attemptRepo.getByUserAndChallenge(user, challenge));
    }

    @Override
    public ChallengeAttempt getAttemptById(Long id) {
        return attemptRepo.findOne(id);
    }

}
