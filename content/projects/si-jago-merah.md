---
title: "Si Jago Merah — Smart Aeroponic Chili Farm"
date: "2023-12-01"
excerpt: "IoT aeroponic smart farming for red chili at The Learning Farm, Cianjur. Custom growth-phase algorithm for vegetative and generative stages. Led as Project Manager. MSIB Indobot Academy program."
tags: ["ESP32", "Arduino", "MQTT", "Blynk", "IoT", "Smart Farming", "Aeroponics"]
category: "IoT"
coverImage: "/images/projects/si-jago-merah.jpg"
status: "completed"
featured: true
tech: ["ESP32", "Arduino", "MQTT", "Blynk API", "Aeroponics", "DHT22", "Relay Control", "Python"]
---

## Overview

Si Jago Merah (The Red Rooster) is an IoT-based aeroponic smart farming system developed for red chili cultivation at The Learning Farm, Cianjur. Built under the MSIB (Magang & Studi Independen Bersertifikat) program with Indobot Academy and Kampus Merdeka.

As **Project Manager** of a 5-person team, I led the design and implementation of an automated aeroponic system with phase-adaptive algorithms for both vegetative and generative growth stages.

## System Design

```
[Sensors]              [ESP32 Controller]         [Cloud]
Temp/Humid (DHT22) ─┐
Soil pH ────────────┤  ┌─────────────────┐   MQTT Broker
Water pH ───────────┤──┤   ESP32 WROOM   ├──────────────── Blynk IoT
Water Level ────────┤  │                 │                    │
Light (LDR) ────────┘  │ Phase Algorithm │                    │
                       │ ───────────────│              Mobile App
                       │ Vegetative     │
                       │ Generative     │
                       └────────────────┘
                              │
                    [Relay Module 8-CH]
                    Pump A │ Pump B │ Mist
                    Fans   │ Lights │ pH+/-
```

## Growth Phase Algorithm

The key innovation: different nutrient and environment profiles for each growth phase.

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Growth phase definitions
enum GrowthPhase { VEGETATIVE, GENERATIVE };

struct PhaseConfig {
  float tempMin, tempMax;      // °C
  float humidMin, humidMax;    // %
  float ecMin, ecMax;          // mS/cm (nutrient concentration)
  float phMin, phMax;          // pH range
  uint32_t mistInterval;       // ms between misting
  uint32_t mistDuration;       // ms of mist burst
  uint8_t lightHours;          // photoperiod
};

// Phase-specific configs (based on agronomy research)
const PhaseConfig PHASE_CONFIGS[] = {
  // VEGETATIVE: focus on leaf/stem growth
  { 22, 28, 65, 85, 1.5, 2.5, 5.5, 6.5, 30000, 3000, 16 },
  // GENERATIVE: focus on flowering & fruiting
  { 20, 26, 55, 75, 2.5, 3.5, 6.0, 7.0, 45000, 2000, 12 }
};

GrowthPhase currentPhase = VEGETATIVE;
uint32_t plantingDate = 0;  // timestamp

void updatePhase() {
  uint32_t daysGrown = (millis() - plantingDate) / (86400UL * 1000);
  // Transition to generative at day 45 for red chili
  currentPhase = (daysGrown >= 45) ? GENERATIVE : VEGETATIVE;
}

void adjustEnvironment(float temp, float humid, float ph) {
  const PhaseConfig& cfg = PHASE_CONFIGS[currentPhase];

  // Temperature control via fans
  if (temp > cfg.tempMax) activateFan(HIGH);
  else if (temp < cfg.tempMin) activateFan(LOW);
  else activateFan(OFF);

  // pH adjustment
  if (ph < cfg.phMin) dosePH(UP, 50);    // 50ms pump burst
  if (ph > cfg.phMax) dosePH(DOWN, 50);

  // Misting schedule
  static uint32_t lastMist = 0;
  if (millis() - lastMist >= cfg.mistInterval) {
    activateMistPump(true);
    delay(cfg.mistDuration);
    activateMistPump(false);
    lastMist = millis();
  }
}
```

## MQTT + Blynk Integration

```cpp
// Publish sensor data to MQTT and Blynk
void publishData(SensorData& data) {
  // MQTT publish
  char payload[256];
  snprintf(payload, sizeof(payload),
    "{\"temp\":%.1f,\"humid\":%.1f,\"ph\":%.2f,\"ec\":%.2f,\"phase\":%d}",
    data.temperature, data.humidity, data.ph, data.ec, (int)currentPhase
  );
  mqtt.publish("sija gomerah/sensors", payload);

  // Blynk virtual pins
  Blynk.virtualWrite(V1, data.temperature);
  Blynk.virtualWrite(V2, data.humidity);
  Blynk.virtualWrite(V3, data.ph);
  Blynk.virtualWrite(V4, data.ec);
  Blynk.virtualWrite(V5, currentPhase == VEGETATIVE ? "Vegetative" : "Generative");
}
```

## Hardware BOM

| Component | Function | Cost (IDR) |
|-----------|----------|------------|
| ESP32 WROOM-32 × 2 | Main controller | 160,000 |
| DHT22 × 4 | Temp/Humidity | 120,000 |
| pH Meter Module | Solution pH | 180,000 |
| EC Sensor | Nutrient level | 250,000 |
| Relay Module 8-ch | Pump/fan control | 75,000 |
| Submersible Pump × 3 | Water + nutrient | 150,000 |
| Aeroponic Mist Nozzles | Root misting | 200,000 |
| PVC pipe + fittings | Structure | 300,000 |
| LDR Module | Light sensing | 25,000 |

**Total hardware:** ~IDR 1,460,000

## Outcomes

After 90 days of operation at The Learning Farm:

- **Yield improvement:** 40% vs soil-based cultivation
- **Water usage:** 95% reduction (recirculating system)
- **System uptime:** 97.8%
- **Crop cycle:** 85 days from seedling to first harvest
- **pH stability:** ±0.2 variance from target

## Role & Learnings

As Project Manager, I coordinated:
1. Hardware procurement and BOM management
2. Firmware development (Arduino/ESP32)
3. Cloud integration (MQTT + Blynk)
4. Field installation and commissioning
5. Documentation and MSIB reporting

**Key lesson:** Real-world agricultural IoT requires extensive field calibration — lab values for pH sensors rarely match field conditions.
