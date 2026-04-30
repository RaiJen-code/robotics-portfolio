---
title: "Robotic Arm — Computer Vision Control"
date: "2024-06-01"
excerpt: "MediaPipe Hands + Jetson Nano robotic arm replicating human gestures in real-time. 21-landmark detection mapped to 6 servos with 75% finger accuracy. Published in Jurnal Ilmiah Setrum. Received IDR 6,000,000 research funding."
tags: ["MediaPipe", "Jetson Nano", "PCA9685", "Python", "Servo", "Computer Vision", "Research"]
category: "Robotics"
coverImage: "/images/projects/robotic-arm.jpg"
githubUrl: "https://github.com/RaiJen-code/robotic-arm-cv"
status: "completed"
featured: true
tech: ["MediaPipe", "Jetson Nano", "PCA9685", "Python", "OpenCV", "I2C", "Servo Motors"]
---

## Overview

A robotic arm that mirrors human hand gestures in real-time using computer vision. Built on Jetson Nano with MediaPipe Hands for 21-point hand landmark detection, mapped to a 6-DOF servo arm via PCA9685 I2C driver.

This project was funded by LPPM IT-PLN (IDR 6,000,000) and published in **Jurnal Ilmiah Setrum** (DOI: 10.62870/setrum.v14i1.30964).

## System Overview

```
[USB Camera] → [Jetson Nano] → [MediaPipe Hands] → [Angle Calculator]
                                                          │
                                                    [PCA9685 I2C]
                                                          │
                                          ┌───────────────┴──────────┐
                                     [Servo 1]  [Servo 2] ... [Servo 6]
                                     (Base)     (Shoulder)    (Finger)
```

## Core Implementation

### Hand Landmark Detection
```python
import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands

class HandTracker:
    def __init__(self):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.75,
            min_tracking_confidence=0.75
        )

    def get_landmarks(self, frame):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb)
        if results.multi_hand_landmarks:
            return results.multi_hand_landmarks[0]
        return None

    def get_finger_angles(self, landmarks, img_shape):
        """Extract joint angles for 5 fingers from 21 landmarks"""
        h, w = img_shape[:2]
        points = [(int(lm.x * w), int(lm.y * h)) 
                  for lm in landmarks.landmark]

        # Finger tip and joint indices (MediaPipe convention)
        fingers = {
            'thumb':  [1, 2, 3, 4],
            'index':  [5, 6, 7, 8],
            'middle': [9, 10, 11, 12],
            'ring':   [13, 14, 15, 16],
            'pinky':  [17, 18, 19, 20],
        }

        angles = {}
        for name, joints in fingers.items():
            angle = self._calculate_bend(points, joints)
            angles[name] = angle
        
        return angles

    def _calculate_bend(self, points, joints):
        """Calculate bend angle between 3 consecutive joints"""
        a = np.array(points[joints[0]])
        b = np.array(points[joints[1]])
        c = np.array(points[joints[2]])

        ba = a - b
        bc = c - b
        cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
        return np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
```

### Servo Control via PCA9685
```python
from adafruit_pca9685 import PCA9685
from adafruit_motor import servo
import board, busio

class ArmController:
    SERVO_MIN_ANGLE = 0
    SERVO_MAX_ANGLE = 180
    
    # Map: finger → servo channel on PCA9685
    FINGER_CHANNELS = {
        'base':    0,   # Wrist rotation (from wrist angle)
        'thumb':   1,
        'index':   2,
        'middle':  3,
        'ring':    4,
        'pinky':   5,
    }

    def __init__(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        pca = PCA9685(i2c)
        pca.frequency = 50
        
        self.servos = {
            name: servo.Servo(pca.channels[ch], min_pulse=500, max_pulse=2500)
            for name, ch in self.FINGER_CHANNELS.items()
        }

    def move(self, finger_angles: dict):
        """Map finger bend angles to servo positions"""
        for finger, angle in finger_angles.items():
            if finger in self.servos:
                # Map bend angle (0-180°) to servo angle (0-180°)
                servo_angle = np.clip(angle, 0, 180)
                self.servos[finger].angle = servo_angle

    def smooth_move(self, target_angles: dict, steps=5):
        """Smooth interpolation to prevent jerky movement"""
        current = {f: s.angle or 90 for f, s in self.servos.items()}
        for step in range(steps):
            interp = {}
            for f in target_angles:
                t = (step + 1) / steps
                interp[f] = current.get(f, 90) * (1 - t) + target_angles[f] * t
            self.move(interp)
```

### Main Control Loop
```python
def main():
    tracker = HandTracker()
    arm = ArmController()
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    while True:
        ret, frame = cap.read()
        if not ret: break
        
        landmarks = tracker.get_landmarks(frame)
        if landmarks:
            angles = tracker.get_finger_angles(landmarks, frame.shape)
            arm.smooth_move(angles)
        
        cv2.imshow("Robotic Arm Control", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

if __name__ == "__main__":
    main()
```

## Hardware Bill of Materials

| Component | Qty | Cost (IDR) |
|-----------|-----|------------|
| Jetson Nano 4GB | 1 | 1,500,000 |
| USB Camera 1080p | 1 | 150,000 |
| PCA9685 Servo Driver | 1 | 45,000 |
| MG996R Servo (Metal Gear) | 6 | 450,000 |
| 3D Printed Arm Frame (PLA) | 1 | 120,000 |
| 5V 10A Power Supply | 1 | 85,000 |
| Jumper Wires + PCB | - | 50,000 |

**Total:** ~IDR 2,400,000

## Research Results

After systematic evaluation:

- **Overall accuracy:** 78% across all gestures
- **Finger position accuracy:** 75% for individual finger states
- **Latency:** ~80ms camera-to-servo response
- **Frame rate:** 25 FPS on Jetson Nano with CUDA
- **Supported gestures:** Open, close, pinch, point, thumbs-up, and custom

## Publication

Published in **Jurnal Ilmiah Setrum** Vol. 14, No. 1:
- DOI: `10.62870/setrum.v14i1.30964`
- Copyright registered with HKI (Hak Kekayaan Intelektual Indonesia)
- Research funding: IDR 6,000,000 from LPPM IT-PLN

## Future Work

1. Add EMG (electromyography) sensor for muscle-based control
2. Implement force feedback for teleoperation
3. Extend to dual-arm manipulation
4. Deploy on lower-cost hardware (Orange Pi + NPU)
