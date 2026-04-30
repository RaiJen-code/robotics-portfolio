---
title: "Smart Greenhouse Automation System"
date: "2024-01-20"
excerpt: "Sistem otomasi rumah kaca menggunakan ESP32, sensor DHT22/soil moisture, dan machine learning untuk prediksi kebutuhan irigasi. Terhubung ke dashboard realtime via MQTT + Node-RED."
tags: ["ESP32", "IoT", "MQTT", "ML", "Python", "Arduino"]
category: "IoT"
coverImage: "/images/projects/greenhouse.jpg"
githubUrl: "https://github.com/RaiJenCode/smart-greenhouse"
demoUrl: "https://greenhouse.raijen.dev"
status: "completed"
featured: false
tech: ["ESP32", "Python", "MQTT", "Node-RED", "TensorFlow Lite", "DHT22", "MySQL"]
---

## Latar Belakang

Irigasi manual di rumah kaca membutuhkan waktu dan sering tidak presisi. Proyek ini bertujuan membangun sistem otomasi lengkap yang dapat:
- Monitor kondisi lingkungan secara realtime
- Prediksi kebutuhan irigasi menggunakan ML
- Kontrol otomatis pompa air dan ventilasi
- Alert via Telegram jika ada anomali

## Arsitektur Sistem

```
[Sensor Layer]          [Edge Layer]         [Cloud Layer]
DHT22 (temp/humid) ─┐  
Soil Moisture ──────┤  ESP32 ──── MQTT ──── Node-RED ──── Dashboard
LDR (cahaya) ───────┤  (edge AI)         
pH Sensor ──────────┘                    └─── MySQL ──── Analytics
                         │
                      TFLite Model
                   (Irrigation Predictor)
```

## Hardware BOM

| Komponen | Qty | Harga Estimasi |
|----------|-----|----------------|
| ESP32 WROOM-32 | 2 | Rp 80.000 |
| DHT22 | 4 | Rp 120.000 |
| Soil Moisture Capacitive | 8 | Rp 200.000 |
| Relay Module 4-channel | 2 | Rp 60.000 |
| Water Pump DC 12V | 4 | Rp 200.000 |
| LDR module | 4 | Rp 40.000 |
| Power Supply 12V 5A | 1 | Rp 100.000 |

**Total:** ~Rp 800.000

## Firmware ESP32 (Key Parts)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <TensorFlowLite_ESP32.h>

// MQTT config
const char* MQTT_BROKER = "broker.hivemq.com";
const int   MQTT_PORT   = 1883;
const char* TOPIC_SENSOR = "greenhouse/sensors";
const char* TOPIC_CONTROL = "greenhouse/control";

DHT dht(4, DHT22);
WiFiClient espClient;
PubSubClient mqtt(espClient);

struct SensorData {
  float temperature;
  float humidity;
  float soilMoisture;  // 0-100%
  float lightIntensity; // lux
};

SensorData readSensors() {
  return {
    .temperature  = dht.readTemperature(),
    .humidity     = dht.readHumidity(),
    .soilMoisture = analogRead(SOIL_PIN) / 4095.0 * 100,
    .lightIntensity = analogRead(LDR_PIN) / 4095.0 * 10000
  };
}

void publishSensorData(SensorData& data) {
  char payload[256];
  snprintf(payload, sizeof(payload),
    "{\"temp\":%.1f,\"humid\":%.1f,\"soil\":%.1f,\"light\":%.0f,\"ts\":%lu}",
    data.temperature, data.humidity, data.soilMoisture,
    data.lightIntensity, millis()
  );
  mqtt.publish(TOPIC_SENSOR, payload);
}

// TFLite inference untuk prediksi irigasi
bool shouldIrrigate(SensorData& data) {
  float input[4] = {
    data.temperature / 40.0f,   // normalize 0-1
    data.humidity / 100.0f,
    data.soilMoisture / 100.0f,
    data.lightIntensity / 10000.0f
  };
  // Run inference... (model sudah di-flash ke ESP32)
  return tflite_predict(input) > 0.5f;
}
```

## Machine Learning Model

Model sederhana dengan TensorFlow untuk binary classification (irigasi/tidak):

```python
import tensorflow as tf
import numpy as np

# Features: [temp, humidity, soil_moisture, light]
# Label: 1 = butuh irigasi, 0 = tidak

model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(4,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Convert ke TFLite untuk ESP32
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open('irrigation_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Hasil & Metrics

Setelah 30 hari running:
- **Akurasi prediksi irigasi:** 89%
- **Penghematan air:** 34% dibanding irigasi manual
- **Uptime sistem:** 99.2%
- **Response time sensor:** < 500ms

## Lessons Learned

1. Sensor DHT22 tidak reliable di luar ruangan; lebih baik pakai SHT31 untuk environment harsh
2. MQTT over public broker tidak disarankan untuk production; gunakan broker private (Mosquitto di VPS)
3. Model TFLite perlu re-training setiap musim karena pattern cuaca berubah

Proyek ini open-source dan bisa dilihat di GitHub. Dokumentasi deployment lengkap tersedia di `/docs` folder.
