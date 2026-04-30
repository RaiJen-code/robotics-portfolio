---
title: "DANCETRON — KRI 2024 Humanoid Dance Robot"
date: "2024-05-01"
excerpt: "Core team member in Indonesian Robot Contest 2024 — Robot Dance category. Humanoid robot performing Oleg Tamulilingan traditional Balinese dance. Responsible for hemodynamic system design for fluid expressive motion."
tags: ["Arduino", "Autodesk Inventor", "CAD", "Servo Systems", "Python", "Humanoid Robotics", "KRI"]
category: "Robotics"
coverImage: "/images/projects/dancetron.jpg"
status: "completed"
featured: false
tech: ["Arduino Mega", "Autodesk Inventor", "Python", "Servo Systems", "CAD", "PCA9685", "Inverse Kinematics"]
---

## Overview

DANCETRON is a humanoid robot developed by the Intelligent Robotic Club (IRC) team at Institut Teknologi PLN for the **Indonesian Robot Contest (KRI) 2024** — Robot Dance category, organized by Puspresnas and BPTI.

The robot performs the **Oleg Tamulilingan** — a traditional Balinese courtship dance — with expressive, fluid movements designed to reflect the grace and precision of human dancers.

**My Role:** Hemodynamic System Design  
**Event:** KRI 2024, Regional Level  
**Division:** Robot Dance (KRSRD)

## What is the Hemodynamic System?

In humanoid robotics, "hemodynamic system" refers to the controlled distribution of energy/torque through the robot's joints to achieve smooth, natural motion — analogous to blood circulation in biological systems.

My specific contribution was designing the **torque distribution and joint synchronization** system that enables:
1. Smooth interpolation between dance poses
2. Natural inertia simulation (limbs decelerate gradually)
3. Synchronized multi-joint motion for expressive gestures

## Motion System Design

### Pose Library Structure
```python
import numpy as np

# Each dance pose = dictionary of servo angles
# Format: {servo_name: angle_degrees}

OLEG_POSES = {
    "sembah_open": {
        "shoulder_R": 90, "elbow_R": 45, "wrist_R": 30,
        "shoulder_L": 90, "elbow_L": 45, "wrist_L": 30,
        "hip": 0, "knee": 10, "ankle": 0,
        "neck_pitch": 15, "neck_yaw": 0
    },
    "ngelo_R": {  # Head tilt right, right arm raised
        "shoulder_R": 130, "elbow_R": 60, "wrist_R": 45,
        "shoulder_L": 60, "elbow_L": 30, "wrist_L": 20,
        "hip": 5, "knee": 15, "ankle": 5,
        "neck_pitch": 20, "neck_yaw": 15
    },
    "ngelayak": {  # Body sway
        "shoulder_R": 110, "elbow_R": 50, "wrist_R": 35,
        "shoulder_L": 70, "elbow_L": 40, "wrist_L": 25,
        "hip": -10, "knee": 20, "ankle": 8,
        "neck_pitch": 10, "neck_yaw": 5
    },
    # ... 24 total poses
}
```

### Hemodynamic Interpolation Engine
```python
class HemodynamicEngine:
    """
    Simulates natural joint dynamics — like biological hemodynamics,
    energy flows through joints with natural inertia and decay.
    """
    
    def __init__(self, servos: dict):
        self.servos = servos
        self.velocities = {k: 0.0 for k in servos}  # Current angular velocity
        
    def move_to_pose(self, target_pose: dict, duration_ms: int, style='fluid'):
        """
        Move all joints from current to target position.
        
        Styles:
        - 'fluid': Sinusoidal ease-in-out (natural dance motion)
        - 'sharp': Linear (mechanical, precise)
        - 'snap': Quick settle with slight overshoot (expressive)
        """
        steps = duration_ms // 20  # 50Hz update rate
        
        current = {k: self.servos[k].read() for k in target_pose}
        
        for step in range(steps + 1):
            t = step / steps
            eased_t = self._ease(t, style)
            
            for joint, target in target_pose.items():
                interpolated = current[joint] + (target - current[joint]) * eased_t
                
                # Apply velocity damping (hemodynamic effect)
                velocity = self.velocities[joint]
                damped = interpolated + velocity * 0.1
                
                self.servos[joint].write(int(np.clip(damped, 0, 180)))
                
                # Update velocity for next frame
                self.velocities[joint] = (interpolated - current[joint]) / steps
                self.velocities[joint] *= 0.85  # Decay factor
            
            time.sleep(0.02)  # 50Hz
    
    def _ease(self, t: float, style: str) -> float:
        if style == 'fluid':
            return (1 - np.cos(t * np.pi)) / 2  # Sinusoidal ease-in-out
        elif style == 'snap':
            # Overshoot and settle (spring-like)
            return 1 - (1 - t)**2 * np.cos(t * np.pi * 3)
        else:
            return t  # Linear

# Choreography sequence
class DanceChoreography:
    def __init__(self, engine: HemodynamicEngine):
        self.engine = engine
        
    def perform_oleg_sequence(self):
        """Full Oleg Tamulilingan sequence — 3 minutes"""
        self.engine.move_to_pose(OLEG_POSES["sembah_open"], 2000, 'fluid')
        time.sleep(1.0)
        
        # Repeating ngelo (head-tilt sway) — 8 counts
        for _ in range(4):
            self.engine.move_to_pose(OLEG_POSES["ngelo_R"], 800, 'fluid')
            self.engine.move_to_pose(OLEG_POSES["ngelo_L"], 800, 'fluid')
        
        self.engine.move_to_pose(OLEG_POSES["ngelayak"], 1200, 'snap')
        # ... continues for full routine
```

## Mechanical Design Contribution

Using **Autodesk Inventor**, I designed:
1. **Joint brackets** — optimized for servo torque distribution
2. **Cable routing channels** — to prevent wire binding during dance poses
3. **Counterweight system** — for lateral balance during single-leg poses

## Robot Specifications

| Parameter | Spec |
|-----------|------|
| Height | 58 cm |
| Weight | 3.2 kg |
| DOF | 18 (upper body + legs) |
| Servos | MG996R × 12, MG90S × 6 |
| Controller | Arduino Mega 2560 |
| Power | LiPo 7.4V 3000mAh |
| Dance repertoire | Oleg Tamulilingan (Bali) |

## Competition Result

Participated in **KRI 2024 Regional Level** (organized by Puspresnas + BPTI).

The experience of making a robot dance traditional Indonesian art was one of the most challenging and rewarding engineering problems I've tackled — combining mechanical design, control theory, and cultural understanding into a single system.
