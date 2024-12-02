package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final String uploadDir = "uploads/"; // Diretório para salvar as imagens

    public String saveImage(MultipartFile file) throws IOException {
        // Gera um nome único para a imagem
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Cria o diretório caso não exista
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Salva o arquivo no diretório
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Retorna a URL da imagem salva
        return "/uploads/" + fileName;
    }
}
