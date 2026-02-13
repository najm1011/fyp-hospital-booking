package com.hospitalapp.backend.dto.symptom;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class SymptomMatchRequest {

    @NotEmpty(message = "At least one symptom must be selected")
    private List<String> symptoms;

    public SymptomMatchRequest() {}

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }
}
