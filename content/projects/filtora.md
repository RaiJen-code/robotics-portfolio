---
title: "FILTORA — Intelligent Air Purification System"
date: "2025-03-01"
excerpt: "PKM-KC 2025 national grant project. Cigarette smoke filtration via Pseudomonas putida bioreactor + activated carbon + IoT + ML real-time air quality monitoring. Role: Embedded System Engineer."
tags: ["Embedded C", "IoT Sensors", "Machine Learning", "PKM-KC", "Air Quality", "Environmental"]
category: "AI"
coverImage: "/images/projects/filtora.jpg"
status: "ongoing"
featured: false
tech: ["ESP32", "MQ-135", "MQ-7", "PMS5003", "TensorFlow Lite", "MQTT", "Python", "Embedded C"]
---

## Overview

FILTORA (Filtration IoT & Real-time Analysis) is a PKM-KC 2025 (Program Kreativitas Mahasiswa — Karsa Cipta) national grant project that combines biological filtration, activated carbon, and intelligent IoT monitoring to address indoor cigarette smoke pollution.

**Role:** Embedded System Engineer  
**Grant:** Kemdikbudristek / Belmawa PKM-KC 2025 (Competitive national funding)

## System Architecture

The system has three layers:

```
Layer 1: BIOLOGICAL FILTRATION
└─ Pseudomonas putida bioreactor
   (breaks down tobacco compounds biologically)

Layer 2: CHEMICAL FILTRATION  
└─ Multi-stage activated carbon filter
   (adsorbs volatile organic compounds)

Layer 3: INTELLIGENT MONITORING (My Role)
└─ IoT sensor array + ML analysis
   - Real-time air quality metrics
   - Filter saturation prediction
   - Mobile alerts
   - Historical analytics
```

## Embedded System Design

### Sensor Array
```c
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "driver/adc.h"

// Sensor configurations
#define MQ135_PIN  34    // CO2, NH3, benzene, smoke
#define MQ7_PIN    35    // Carbon monoxide
#define PMS_RX     16    // PMS5003 particulate matter
#define PMS_TX     17
#define DHT_PIN    22    // Temperature + humidity
#define FAN_PWM    25    // Variable speed fan control

typedef struct {
  float co2_ppm;
  float co_ppm;
  float pm2_5;
  float pm10;
  float temperature;
  float humidity;
  float voc_index;
  uint32_t timestamp;
} AirQualityData;

// MQ135 calibration (requires 24h burn-in in clean air)
float MQ135_R0 = 76.63;  // Calibrated resistance in clean air

float readMQ135() {
  int raw = analogRead(MQ135_PIN);
  float voltage = raw * (3.3 / 4095.0);
  float RS = (3.3 - voltage) / voltage * 10000;  // 10k load resistor
  float ratio = RS / MQ135_R0;
  
  // CO2 curve fit: ppm = a * (RS/R0)^b
  return 116.6020682 * pow(ratio, -2.769034857);
}
```

### ML Model: Filter Saturation Prediction
```python
import tensorflow as tf
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Features: [co2, co, pm2_5, pm10, hours_since_change, temperature]
# Target: filter_remaining_capacity (0.0 to 1.0)

def build_lstm_model(input_shape):
    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(64, input_shape=input_shape, return_sequences=True),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')  # capacity 0-1
    ])
    model.compile(
        optimizer='adam',
        loss='mse',
        metrics=['mae']
    )
    return model

# Convert to TFLite for ESP32 deployment
def export_tflite(model, quantize=True):
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    if quantize:
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.float16]
    
    tflite_model = converter.convert()
    with open('filtora_predictor.tflite', 'wb') as f:
        f.write(tflite_model)
    print(f"Model size: {len(tflite_model)/1024:.1f} KB")
```

### MQTT + Alert System
```c
void publishAirQuality(AirQualityData* data) {
  char topic[64], payload[256];
  
  snprintf(payload, sizeof(payload),
    "{\"co2\":%.1f,\"co\":%.2f,\"pm25\":%.1f,\"pm10\":%.1f,"
    "\"temp\":%.1f,\"humid\":%.1f,\"ts\":%u}",
    data->co2_ppm, data->co_ppm, data->pm2_5, data->pm10,
    data->temperature, data->humidity, data->timestamp
  );
  
  mqtt_client.publish("filtora/sensors", payload);
  
  // Alert thresholds (WHO guidelines)
  if (data->pm2_5 > 25.0) {  // >25 μg/m³ is unhealthy
    mqtt_client.publish("filtora/alerts", "{\"type\":\"PM2.5\",\"level\":\"high\"}");
  }
  if (data->co_ppm > 9.0) {  // >9 ppm OSHA limit
    mqtt_client.publish("filtora/alerts", "{\"type\":\"CO\",\"level\":\"danger\"}");
  }
}

// Adaptive fan control based on air quality
void adjustFanSpeed(AirQualityData* data) {
  float pollution_index = (data->pm2_5 / 25.0 + data->co2_ppm / 1000.0) / 2.0;
  uint8_t fan_duty = (uint8_t)(pollution_index * 255);
  fan_duty = max(fan_duty, (uint8_t)64);  // Minimum 25% speed
  
  ledcWrite(0, fan_duty);  // PWM channel 0
}
```

## Innovation: Biological + IoT Hybrid

The bioreactor hosts **Pseudomonas putida** bacteria that metabolize:
- Nicotine → water + CO2 + biomass (non-toxic)  
- Benzene derivatives → organic acids
- Formaldehyde → methanol → CO2

Combined with activated carbon for VOC adsorption and the IoT layer for real-time monitoring, FILTORA achieves air quality improvements not possible with single-technology approaches.

## Status & Grant

- **Proposal submitted:** February 2025
- **Grant status:** Funded (PKM-KC 2025)
- **Current phase:** Prototype development
- **Target completion:** August 2025

*This project is actively ongoing during the writing of this case study.*
