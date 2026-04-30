---
title: "Membangun Robot Arm 6-DOF dengan ROS2 dan Raspberry Pi"
date: "2024-02-10"
excerpt: "Tutorial lengkap implementasi inverse kinematics dan kontrol servo untuk robot arm 6 derajat kebebasan menggunakan ROS2 Humble dan Raspberry Pi 4."
tags: ["ROS2", "Robotics", "Python", "Raspberry Pi", "Servo"]
category: "Robotics"
coverImage: "/images/posts/robot-arm.jpg"
published: true
---

## Overview

Robot arm 6-DOF (Degree of Freedom) adalah salah satu platform robotik paling versatile. Dengan 6 joint, robot ini mampu mencapai hampir semua orientasi dalam ruang 3D.

Dalam artikel ini, saya akan membahas implementasi lengkap menggunakan:
- **ROS2 Humble** sebagai middleware robotik
- **Raspberry Pi 4** sebagai controller utama
- **Servo MG996R** untuk aktuasi setiap joint
- **Python** untuk kontrol dan algoritma

## Prerequisites

Sebelum mulai, pastikan kamu memiliki:
- Raspberry Pi 4 (minimal 4GB RAM)
- Ubuntu 22.04 Server terinstall
- ROS2 Humble terinstall
- 6x Servo MG996R + PCA9685 PWM driver
- Power supply 5V/10A untuk servo

## Setup ROS2 Workspace

```bash
# Buat workspace ROS2
mkdir -p ~/robot_arm_ws/src
cd ~/robot_arm_ws

# Clone package kita
git clone https://github.com/RaiJenCode/robot-arm-ros2 src/robot_arm

# Install dependencies
rosdep install --from-paths src --ignore-src -r -y

# Build
colcon build --symlink-install
source install/setup.bash
```

## Inverse Kinematics Implementation

IK adalah inti dari kontrol robot arm. Alih-alih menentukan sudut tiap joint secara manual, kita memberi target posisi (x, y, z) dan sistem menghitung sudut joint yang diperlukan.

```python
import numpy as np

class InverseKinematics:
    def __init__(self, link_lengths: list[float]):
        self.links = link_lengths  # Panjang tiap link dalam mm
    
    def solve(self, target: np.ndarray) -> list[float] | None:
        """
        Solve IK untuk robot arm planar 3-DOF
        target: [x, y, z] dalam koordinat world
        returns: [theta1, theta2, theta3] dalam radian
        """
        x, y, z = target
        l1, l2, l3 = self.links
        
        # Base rotation (joint 1)
        theta1 = np.arctan2(y, x)
        
        # Planar reach ke target (di bidang yang berputar)
        r = np.sqrt(x**2 + y**2)  # radial distance
        s = z - l1                  # vertical offset
        
        # Hitung sudut untuk joints 2 & 3 via cosine rule
        d = np.sqrt(r**2 + s**2)
        
        if d > (l2 + l3) or d < abs(l2 - l3):
            return None  # Target di luar jangkauan
        
        cos_theta3 = (d**2 - l2**2 - l3**2) / (2 * l2 * l3)
        theta3 = np.arccos(np.clip(cos_theta3, -1, 1))
        
        alpha = np.arctan2(s, r)
        beta = np.arctan2(l3 * np.sin(theta3), l2 + l3 * np.cos(theta3))
        theta2 = alpha - beta
        
        return [theta1, theta2, theta3]
```

## ROS2 Node untuk Kontrol Servo

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from adafruit_pca9685 import PCA9685
import board, busio

class ArmController(Node):
    def __init__(self):
        super().__init__('arm_controller')
        
        # Init PCA9685
        i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(i2c)
        self.pca.frequency = 50  # 50Hz untuk servo
        
        # Subscribe ke joint states
        self.subscription = self.create_subscription(
            JointState,
            'joint_commands',
            self.joint_callback,
            10
        )
        self.get_logger().info('Arm Controller initialized ✓')
    
    def angle_to_duty(self, angle_deg: float) -> int:
        """Convert sudut (0-180°) ke duty cycle PWM"""
        # Range: 0.5ms - 2.5ms dalam 4096 steps (12-bit)
        min_duty = int(0.5 / 20.0 * 4096)
        max_duty = int(2.5 / 20.0 * 4096)
        return int(min_duty + (angle_deg / 180.0) * (max_duty - min_duty))
    
    def joint_callback(self, msg: JointState):
        for i, (name, pos) in enumerate(zip(msg.name, msg.position)):
            angle_deg = np.degrees(pos) + 90  # Offset ke tengah
            angle_deg = np.clip(angle_deg, 0, 180)
            duty = self.angle_to_duty(angle_deg)
            self.pca.channels[i].duty_cycle = duty
            self.get_logger().debug(f'{name}: {angle_deg:.1f}°')

def main():
    rclpy.init()
    node = ArmController()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Testing & Kalibrasi

Setelah install, test dulu masing-masing servo:

```bash
# Launch controller
ros2 launch robot_arm arm_controller.launch.py

# Di terminal lain, kirim command manual
ros2 topic pub /joint_commands sensor_msgs/msg/JointState \
  "{name: ['joint1'], position: [0.785]}"
# 0.785 radian = 45 derajat
```

## Hasil

Dengan setup ini, robot arm mampu:
- Precision picking ±2mm dalam radius 300mm
- Kecepatan max 60°/detik per joint
- Payload max 200g di end-effector

## Kesimpulan

ROS2 + Raspberry Pi adalah kombinasi yang powerful untuk robotics prototyping. Library IK di atas bisa dikembangkan untuk 6-DOF penuh menggunakan library seperti `ikpy` atau `roboticstoolbox-python`.

Semua source code tersedia di GitHub. Jika ada pertanyaan atau butuh konsultasi implementasi, feel free untuk [book sesi konsultasi](/services).
