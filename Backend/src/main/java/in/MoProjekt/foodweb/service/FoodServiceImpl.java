package in.MoProjekt.foodweb.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import in.MoProjekt.foodweb.entity.FoodEntity;
import in.MoProjekt.foodweb.entity.FoodImageEntity;
import in.MoProjekt.foodweb.io.FoodRequest;
import in.MoProjekt.foodweb.io.FoodResponse;
import in.MoProjekt.foodweb.repository.FoodImageRepository;
import in.MoProjekt.foodweb.repository.FoodRepository;
import software.amazon.awssdk.core.sync.RequestBody;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OpenAITranslationService translator;

    @Autowired
    private FoodImageRepository foodImageRepository;

    @Value("${backend.url}")
    private String backendUrl;

    private static final String DB_IMAGE_PATH = "/api/foods/images/";
    private static final long MAX_DB_IMAGE_SIZE = 5 * 1024 * 1024;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        // Implementation for file upload
        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString() + "." + filenameExtension;
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .acl("public-read")
            .contentType(file.getContentType())
            .build();
            PutObjectResponse response;
            try {
                response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            } catch (S3Exception ex) {
                // Neuere Buckets erlauben keine ACLs mehr -> ohne ACL erneut versuchen
                if (!"AccessControlListNotSupported".equals(ex.awsErrorDetails().errorCode())) {
                    throw ex;
                }
                response = s3Client.putObject(putObjectRequest.toBuilder().acl((String) null).build(),
                        RequestBody.fromBytes(file.getBytes()));
            }

            if(response.sdkHttpResponse().isSuccessful()){
                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
        }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Failed to upload the file");
            }
        
        }catch(IOException ex){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while uploading the file");
            
        }
    }

    private FoodResponse convertToResponse(FoodEntity entity){
    return FoodResponse.builder()
            .id(entity.getId())
            .name(entity.getName())               // komplette Map
            .description(entity.getDescription()) // komplette Map
            .price(entity.getPrice())
            .category(entity.getCategory())
            .imageUrl(entity.getImageUrl())
            .build();
}


    @Override
public List<FoodResponse> readFoods(String lang) {
    return foodRepository.findAll().stream()
            .map(food -> convertToResponse(food, lang))
            .collect(Collectors.toList());
}


   @Override
public FoodResponse readFood(String id, String lang) {
    FoodEntity entity = foodRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found"));
    return convertToResponse(entity, lang);
}


    @Override
    public boolean deleteFile(String filename) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(bucketName)
            .key(filename)
            .build();
            s3Client.deleteObject(deleteObjectRequest);
            return true;
    }

    @Override
public void deleteFood(String id) {

    // hole deutsche Version, reicht für delete
    FoodResponse response = readFood(id, "de");

    String imageUrl = response.getImageUrl();
    if (imageUrl != null && !imageUrl.isBlank()) {
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        try {
            if (imageUrl.contains(DB_IMAGE_PATH)) {
                foodImageRepository.deleteById(filename);
            } else {
                deleteFile(filename);
            }
        } catch (Exception ex) {
            // Bild konnte nicht gelöscht werden (z. B. S3 nicht erreichbar) -> Gericht trotzdem löschen
            System.out.println("Could not delete image " + filename + ": " + ex.getMessage());
        }
    }

    foodRepository.deleteById(id);
}


   
    @SuppressWarnings("unchecked")
private Map<String, String> cast(Object obj) {
    if (obj instanceof Map<?, ?> map) {
        return (Map<String, String>) map;
    }
    return Map.of();
}

private FoodResponse convertToResponse(FoodEntity entity, String lang) {

    Map<String, String> nameMap = cast(entity.getName());
    Map<String, String> descMap = cast(entity.getDescription());

    String name = nameMap.getOrDefault(lang, nameMap.getOrDefault("de", ""));
    String desc = descMap.getOrDefault(lang, descMap.getOrDefault("de", ""));

    return FoodResponse.builder()
        .id(entity.getId())
        .name(Map.of(lang, name))
        .description(Map.of(lang, desc))
        .price(entity.getPrice())
        .category(entity.getCategory())
        .imageUrl(entity.getImageUrl())
        .build();
}



    @Override
public FoodResponse addFood(FoodRequest request, MultipartFile file) {
    if (file == null || file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please upload an image");
    }
    String imageUrl = storeImage(file);

    FoodEntity entity = new FoodEntity();
    entity.setName(withEnglish(request.getName()));
    entity.setDescription(withEnglish(request.getDescription()));
    entity.setCategory(request.getCategory());
    entity.setPrice(request.getPrice());
    entity.setImageUrl(imageUrl);

    FoodEntity saved = foodRepository.save(entity);

    return convertToResponse(saved, "de");
}

    // Erst S3 versuchen; klappt das nicht (z. B. AWS-Zugang abgelaufen), Bild in MongoDB speichern
    private String storeImage(MultipartFile file) {
        try {
            return uploadFile(file);
        } catch (Exception ex) {
            System.out.println("S3 upload failed, storing image in MongoDB instead: " + ex.getMessage());
        }
        if (file.getSize() > MAX_DB_IMAGE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Image must be smaller than 5 MB");
        }
        try {
            FoodImageEntity image = foodImageRepository.save(FoodImageEntity.builder()
                    .contentType(file.getContentType())
                    .data(file.getBytes())
                    .build());
            return backendUrl + DB_IMAGE_PATH + image.getId();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read the image");
        }
    }

    @Override
    public FoodImageEntity readImage(String id) {
        return foodImageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));
    }

    // Deutscher Text + KI-Übersetzung ins Englische (falls OpenAI nicht erreichbar: nur Deutsch)
    private Map<String, String> withEnglish(String germanText) {
        String de = germanText != null ? germanText.trim() : "";
        try {
            // höchstens 20 Sekunden auf OpenAI warten, sonst ohne Übersetzung speichern
            String en = CompletableFuture.supplyAsync(() -> translator.translate(de, "English"))
                    .get(20, TimeUnit.SECONDS);
            if (en != null && !en.isBlank()) {
                return Map.of("de", de, "en", en.trim());
            }
        } catch (Exception ex) {
            System.out.println("Translation failed: " + ex.getMessage());
        }
        return Map.of("de", de);
    }


}