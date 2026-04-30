---
title: "S.O.M.E.B.O.D.Y. — Autonomous AI Robot"
date: "2024-11-01"
excerpt: "AI-powered autonomous robot on Jetson Nano + CUDA. Multimodal: seeing, moving, speaking, listening, thinking, and remembering. Integrates GPT-4 Vision, speech recognition, person tracking, and persistent conversation memory via SQLite."
tags: ["Jetson Nano", "CUDA", "Python", "OpenCV", "GPT-4", "SQLite", "AI Robotics"]
category: "AI"
coverImage: "/images/projects/somebody.jpg"
githubUrl: "https://github.com/RaiJen-code/somebody-robot"
status: "completed"
featured: true
tech: ["Jetson Nano", "CUDA", "Python", "OpenCV", "GPT-4 Vision", "SQLite", "ROS2", "Speech Recognition"]
---

## Overview

S.O.M.E.B.O.D.Y. (System Of Multimodal Embodied Bot for Observation, Dialogue, and Yielded responses) is a fully autonomous AI robot built on NVIDIA Jetson Nano with CUDA acceleration. The robot integrates six core capabilities: **Seeing, Moving, Speaking, Listening, Thinking, and Remembering**.

This project represents the convergence of computer vision, natural language processing, robotics control, and edge AI into a single coherent embodied intelligence system.

## System Architecture

```
┌─────────────────────────────────────────────┐
│              SOMEBODY ROBOT                 │
├──────────────┬──────────────────────────────┤
│  PERCEPTION  │  COGNITION                  │
│  OpenCV      │  GPT-4 Vision API           │
│  Person Track│  Local LLM (fallback)       │
│  CUDA accel  │  SQLite Memory              │
├──────────────┼──────────────────────────────┤
│  MOTION      │  SPEECH                     │
│  ROS2        │  Whisper STT                │
│  Servo Ctrl  │  TTS Engine                 │
│  Navigation  │  Wake Word Detection        │
└──────────────┴──────────────────────────────┘
```

## Key Features

### 1. Vision — Person Detection & Tracking
```python
import cv2
import numpy as np
from jetson import inference

# CUDA-accelerated person detection
detector = inference.detectNet("peoplenet", threshold=0.5)

def track_person(frame):
    detections = detector.Detect(frame)
    persons = [d for d in detections if d.ClassID == 1]
    if persons:
        target = max(persons, key=lambda d: d.Area)
        return calculate_center(target), target.Confidence
    return None, 0.0
```

### 2. Memory — Persistent Conversation with SQLite
```python
import sqlite3
from datetime import datetime

class ConversationMemory:
    def __init__(self, db_path="memory.db"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._init_tables()

    def _init_tables(self):
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY,
                person_id TEXT,
                role TEXT,         -- 'user' or 'assistant'
                content TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS persons (
                id TEXT PRIMARY KEY,
                name TEXT,
                face_encoding BLOB,
                last_seen DATETIME
            )
        """)
        self.conn.commit()

    def remember(self, person_id, role, content):
        self.conn.execute(
            "INSERT INTO conversations (person_id, role, content) VALUES (?, ?, ?)",
            (person_id, role, content)
        )
        self.conn.commit()

    def recall(self, person_id, limit=10):
        cursor = self.conn.execute(
            "SELECT role, content FROM conversations WHERE person_id=? ORDER BY timestamp DESC LIMIT ?",
            (person_id, limit)
        )
        return list(reversed(cursor.fetchall()))
```

### 3. Language — GPT-4 Vision Integration
```python
import openai
import base64

def analyze_scene(frame, question, memory_context):
    # Encode frame to base64
    _, buffer = cv2.imencode('.jpg', frame)
    img_b64 = base64.b64encode(buffer).decode('utf-8')

    messages = [
        {"role": "system", "content": "You are SOMEBODY, a friendly AI robot."},
        # Include conversation history
        *[{"role": r, "content": c} for r, c in memory_context],
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
                {"type": "text", "text": question}
            ]
        }
    ]

    response = openai.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=messages,
        max_tokens=300
    )
    return response.choices[0].message.content
```

## Hardware Setup

| Component | Spec | Role |
|-----------|------|------|
| NVIDIA Jetson Nano | 4GB RAM, 128 CUDA cores | Main compute |
| USB Camera | 1080p | Vision input |
| USB Microphone | Omnidirectional | Audio input |
| Speaker | 5W | Audio output |
| Servo Driver | PCA9685 | Motion control |
| Mobile Base | 4WD chassis | Locomotion |
| LiPo Battery | 11.1V 5000mAh | Power |

## Results

- **Person tracking accuracy:** 91% at 15fps
- **Wake word detection rate:** 97%  
- **Response latency:** 1.2s average (vision + GPT-4)
- **Memory retention:** Persistent across power cycles
- **Conversation coherence:** High — recalls previous interactions

## Lessons Learned

1. CUDA acceleration is critical — CPU-only runs at 3fps, CUDA achieves 15fps
2. SQLite is sufficient for local memory; Redis would be better for multi-robot scenarios
3. GPT-4 Vision adds latency but dramatically improves contextual understanding
4. Wake word detection must run on a separate thread to avoid blocking the control loop
