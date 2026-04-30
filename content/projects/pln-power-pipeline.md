---
title: "ADW310-4G Power Meter Pipeline — PLN ICON+"
date: "2025-01-15"
excerpt: "Enterprise real-time monitoring pipeline for industrial power meters at PT PLN ICON+. Docker + Kafka + Spark stream processing, Laravel dashboard, Modbus protocol layer, full MySQL persistence."
tags: ["Docker", "Kafka", "Apache Spark", "Laravel", "Modbus", "MQTT", "Big Data", "IoT"]
category: "IoT"
coverImage: "/images/projects/pln-pipeline.jpg"
status: "completed"
featured: true
tech: ["Docker", "Apache Kafka", "Apache Spark", "Laravel", "Modbus", "MQTT", "MySQL", "Python"]
---

## Overview

Developed during internship at PT PLN ICON+ (Sub-bidang Pengembang Aplikasi 1), this project built an enterprise-grade real-time data pipeline for monitoring ADW310-4G industrial power meters deployed across the PLN network.

The system processes telemetry from hundreds of power meters, detects leakage events, and surfaces them through a Laravel web dashboard — all in near-real-time.

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     DATA PIPELINE                            │
│                                                              │
│  [ADW310-4G]   [Modbus TCP]   [Python Collector]            │
│  Power Meter ──────────────── Reading every 5s              │
│                                      │                       │
│                               [Kafka Producer]               │
│                               Topic: power-meters            │
│                                      │                       │
│                         ┌────────────▼────────────┐         │
│                         │   Apache Kafka Cluster  │         │
│                         │   (3 brokers, Docker)   │         │
│                         └────────────┬────────────┘         │
│                                      │                       │
│                          [Spark Streaming Job]               │
│                          • Anomaly detection                 │
│                          • Energy calculation                │
│                          • Leakage flagging                  │
│                                      │                       │
│                                [MySQL DB]                    │
│                                      │                       │
│                          [Laravel Dashboard]                 │
│                          • Realtime charts                   │
│                          • Alert system                      │
│                          • Historical reports                │
└──────────────────────────────────────────────────────────────┘
```

## Docker Compose Setup

```yaml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on: [zookeeper]
    ports: ["9092:9092"]
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
      KAFKA_NUM_PARTITIONS: 3

  spark-master:
    image: bitnami/spark:3.5
    environment:
      SPARK_MODE: master
    ports: ["8080:8080"]

  spark-worker:
    image: bitnami/spark:3.5
    environment:
      SPARK_MODE: worker
      SPARK_MASTER_URL: spark://spark-master:7077
    depends_on: [spark-master]

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: powermetrics
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes: [mysql_data:/var/lib/mysql]

  laravel:
    build: ./laravel-app
    ports: ["8000:80"]
    depends_on: [mysql]
```

## Modbus Data Collector

```python
from pymodbus.client import ModbusTcpClient
from kafka import KafkaProducer
import json, time, logging

class PowerMeterCollector:
    # ADW310-4G register map
    REGISTERS = {
        'voltage_L1': 0x0000,    # V (×0.1)
        'voltage_L2': 0x0002,
        'voltage_L3': 0x0004,
        'current_L1': 0x0008,    # A (×0.001)
        'current_L2': 0x000A,
        'current_L3': 0x000C,
        'active_power': 0x0010,  # kW (×0.001)
        'power_factor': 0x002A,  # (×0.001)
        'energy_total': 0x0100,  # kWh (×0.01)
    }

    def __init__(self, host: str, meter_id: str):
        self.client = ModbusTcpClient(host, port=502, timeout=3)
        self.meter_id = meter_id
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

    def read_meter(self) -> dict:
        if not self.client.connect():
            raise ConnectionError(f"Cannot connect to meter {self.meter_id}")
        
        data = {'meter_id': self.meter_id, 'timestamp': time.time()}
        
        for name, register in self.REGISTERS.items():
            result = self.client.read_holding_registers(register, count=2)
            if not result.isError():
                # Combine two 16-bit registers to 32-bit float
                raw = (result.registers[0] << 16) | result.registers[1]
                data[name] = self._scale(name, raw)
        
        return data

    def _scale(self, field: str, raw: int) -> float:
        scales = {
            'voltage': 0.1, 'current': 0.001,
            'power': 0.001, 'energy': 0.01, 'factor': 0.001
        }
        for key, factor in scales.items():
            if key in field:
                return raw * factor
        return float(raw)

    def collect_and_publish(self):
        while True:
            try:
                data = self.read_meter()
                self.producer.send('power-meters', value=data)
                logging.info(f"Published: {data['meter_id']} @ {data['active_power']}kW")
            except Exception as e:
                logging.error(f"Collection error: {e}")
            time.sleep(5)
```

## Spark Streaming Anomaly Detection

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, when, lag
from pyspark.sql.types import StructType, StringType, DoubleType, LongType
from pyspark.sql.window import Window

spark = SparkSession.builder \
    .appName("PowerMeterStream") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0") \
    .getOrCreate()

schema = StructType() \
    .add("meter_id", StringType()) \
    .add("timestamp", LongType()) \
    .add("voltage_L1", DoubleType()) \
    .add("current_L1", DoubleType()) \
    .add("active_power", DoubleType()) \
    .add("energy_total", DoubleType())

# Read from Kafka
stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "power-meters") \
    .load() \
    .select(from_json(col("value").cast("string"), schema).alias("data")) \
    .select("data.*")

# Leakage detection: current spike without proportional power increase
anomalies = stream.withColumn(
    "leakage_flag",
    when(
        (col("current_L1") > 100) & (col("active_power") < col("current_L1") * 0.2),
        True
    ).otherwise(False)
)

# Write to MySQL
anomalies.writeStream \
    .format("jdbc") \
    .option("url", "jdbc:mysql://localhost:3306/powermetrics") \
    .option("dbtable", "meter_readings") \
    .option("checkpointLocation", "/tmp/checkpoints") \
    .outputMode("append") \
    .start() \
    .awaitTermination()
```

## Results & Impact

Deployed at PT PLN ICON+ for 4 months during internship:
- **Meters monitored:** 47 ADW310-4G units
- **Data throughput:** ~50,000 readings/day
- **Leakage events detected:** 12 (3 confirmed real anomalies)
- **Dashboard response time:** < 2s for 30-day historical queries
- **System uptime:** 98.6%
