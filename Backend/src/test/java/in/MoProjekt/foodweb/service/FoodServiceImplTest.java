package in.MoProjekt.foodweb.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import in.MoProjekt.foodweb.entity.FoodEntity;
import in.MoProjekt.foodweb.entity.FoodImageEntity;
import in.MoProjekt.foodweb.io.FoodRequest;
import in.MoProjekt.foodweb.io.FoodResponse;
import in.MoProjekt.foodweb.repository.FoodImageRepository;
import in.MoProjekt.foodweb.repository.FoodRepository;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@ExtendWith(MockitoExtension.class)
class FoodServiceImplTest {

    @Mock private S3Client s3Client;
    @Mock private FoodRepository foodRepository;
    @Mock private FoodImageRepository foodImageRepository;
    @Mock private OpenAITranslationService translator;
    @InjectMocks private FoodServiceImpl foodService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(foodService, "bucketName", "bucket");
        ReflectionTestUtils.setField(foodService, "backendUrl", "https://api.example.com");
    }

    @Test
    void imageIsStoredInMongoWhenS3Fails() {
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenThrow(SdkClientException.create("The AWS Access Key Id you provided does not exist"));
        when(foodImageRepository.save(any())).thenAnswer(inv -> {
            FoodImageEntity image = inv.getArgument(0);
            image.setId("img1");
            return image;
        });
        when(foodRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(translator.translate(anyString(), anyString())).thenReturn("Pasta EN");

        FoodRequest request = new FoodRequest();
        request.setName("Pasta");
        request.setDescription("Lecker");
        request.setCategory("Pasta");
        request.setPrice(9.5);
        MockMultipartFile file = new MockMultipartFile("file", "foto.jpg", "image/jpeg", new byte[] { 1, 2, 3 });

        FoodResponse response = foodService.addFood(request, file);

        assertEquals("https://api.example.com/api/foods/images/img1", response.getImageUrl());
        verify(foodImageRepository).save(any());
    }

    @Test
    void nonImageUploadIsRejected() {
        MockMultipartFile file = new MockMultipartFile("file", "x.txt", "text/plain", new byte[] { 1 });
        assertThrows(ResponseStatusException.class, () -> foodService.addFood(new FoodRequest(), file));
    }

    @Test
    void deletingFoodWithDatabaseImageRemovesTheImage() {
        FoodEntity food = FoodEntity.builder().id("f1").name(java.util.Map.of("de", "x")).description(java.util.Map.of("de", "y"))
                .imageUrl("https://api.example.com/api/foods/images/img1").build();
        when(foodRepository.findById("f1")).thenReturn(java.util.Optional.of(food));

        foodService.deleteFood("f1");

        verify(foodImageRepository).deleteById("img1");
        verify(foodRepository).deleteById("f1");
    }
}
