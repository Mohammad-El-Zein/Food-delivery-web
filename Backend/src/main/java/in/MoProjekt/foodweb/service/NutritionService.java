package in.MoProjekt.foodweb.service;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.OutputConfig;
import com.anthropic.models.messages.StopReason;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import in.MoProjekt.foodweb.io.NutritionRequest;
import in.MoProjekt.foodweb.io.NutritionResponse;

@Service
public class NutritionService {

    private static final Logger log = LoggerFactory.getLogger(NutritionService.class);

    private final ChatClient chatClient;
    private final AnthropicClient claudeClient;
    private final String claudeModel;

    // Zusaetzliche Felder in der KI-Antwort (z.B. "unit") sollen nicht zum Fehler fuehren
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public NutritionService(ChatClient.Builder chatClientBuilder,
                            @Value("${anthropic.api-key:}") String anthropicApiKey,
                            @Value("${anthropic.model:claude-haiku-5-5}") String claudeModel) {
        this.chatClient = chatClientBuilder.build();
        this.claudeModel = claudeModel;
        this.claudeClient = anthropicApiKey == null || anthropicApiKey.isBlank()
                ? null
                : AnthropicOkHttpClient.builder()
                        .apiKey(anthropicApiKey)
                        .timeout(Duration.ofSeconds(60))
                        .maxRetries(1)
                        .build();
    }

    public NutritionResponse analyze(NutritionRequest req) throws Exception {
        String prompt = buildPrompt(req);

        // 1. Versuch: OpenAI
        try {
            return parse(askOpenAi(prompt));
        } catch (Exception openAiError) {
            if (claudeClient == null) {
                log.error("OpenAI-Anfrage fehlgeschlagen und kein ANTHROPIC_API_KEY gesetzt", openAiError);
                throw openAiError;
            }
            log.warn("OpenAI-Anfrage fehlgeschlagen ({}), nutze Claude als Fallback", openAiError.getMessage());
        }

        // 2. Versuch: Claude (z.B. wenn das OpenAI-Limit/Guthaben aufgebraucht ist)
        return parse(askClaude(prompt));
    }

    private String buildPrompt(NutritionRequest req) {
        return """
                Schätze die Kalorien und Makronährstoffe für folgendes Gericht.

                Gericht: %s
                Portionsgröße: %s Gramm

                Antworte ausschließlich im folgenden JSON, ohne weiteren Text:

                {
                  "calories": number,
                  "protein": number,
                  "carbs": number,
                  "fat": number
                }
                """.formatted(req.getFoodName(), req.getPortion());
    }

    private String askOpenAi(String prompt) {
        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();
    }

    private String askClaude(String prompt) {
        MessageCreateParams params = MessageCreateParams.builder()
                .model(claudeModel)
                .maxTokens(16000L)
                // einfache Schaetzung, braucht kein tiefes Nachdenken
                .outputConfig(OutputConfig.builder().effort(OutputConfig.Effort.LOW).build())
                .addUserMessage(prompt)
                .build();

        Message response = claudeClient.messages().create(params);

        if (response.stopReason().map(StopReason.REFUSAL::equals).orElse(false)) {
            throw new IllegalStateException("Claude hat die Anfrage abgelehnt");
        }

        StringBuilder text = new StringBuilder();
        response.content().stream()
                .flatMap(block -> block.text().stream())
                .forEach(block -> text.append(block.text()));
        return text.toString();
    }

    private NutritionResponse parse(String output) throws Exception {
        if (output == null || output.isBlank()) {
            throw new IllegalStateException("Leere Antwort vom KI-Modell");
        }
        output = output.trim();

        // Falls das KI-Modell Text oder ```json um das JSON herum schreibt, extrahieren wir das JSON
        int start = output.indexOf("{");
        int end = output.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            output = output.substring(start, end);
        }

        return mapper.readValue(output, NutritionResponse.class);
    }
}
