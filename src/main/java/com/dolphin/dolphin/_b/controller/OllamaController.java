package com.dolphin.dolphin._b.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.*;

@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    @PostMapping("/generate")
    public ResponseEntity<String> generateResponse(@RequestBody String prompt) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "ollama", "run", "dolphin3:8b", prompt
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line).append("\n");
            }

            process.waitFor();
            return ResponseEntity.ok(response.toString().trim());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
