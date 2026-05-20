# Story Intelligence & Editorial Dependency Platform

AI-assisted editorial intelligence platform for narrative analysis, rewrite dependency evaluation, and adaptation workflow exploration.

---

## Live Demo

url: https://story-intelligence-mvp.vercel.app


---

## Overview

Story Intelligence Analyzer is an AI-powered narrative analytics platform designed to explore how editorial and adaptation workflows can be augmented using narrative intelligence systems.

The platform analyzes uploaded stories or screenplays and generates insights around:

- Narrative pacing
- Adaptation readiness
- Cliffhanger density
- Retention risk
- Character prominence
- Emotional progression
- Rewrite dependency impact

This MVP explores how AI-assisted editorial tooling could support serialized storytelling ecosystems, adaptation pipelines, and continuity-sensitive rewrite workflows.

---

## Features

### Story Analysis Dashboard
- Upload `.txt` story files
- AI-powered narrative analysis
- Dynamic editorial intelligence metrics

### Narrative KPI Metrics
- Pacing Score
- Adaptation Readiness
- Cliffhanger Density
- Retention Risk

### Character Intelligence
- Character extraction from uploaded stories
- Character appearance frequency analysis
- Narrative dependency mapping

### Emotional Narrative Visualization
- Emotional intensity progression charts
- Story arc visualization
- Narrative flow tracking

### Rewrite Impact Analyzer
- Rewrite dependency analysis
- Continuity-sensitive impact evaluation
- Relationship disruption detection
- Suggested rewrite-risk areas

---

## Tech Stack

### Frontend
- React.js
- Vite
- Recharts
- Tailwind CSS

### Backend
- FastAPI
- Python
- OpenRouter API

### Deployment
- Vercel (Frontend)
- Render (Backend)

---
###Project Structure
Story Intelligence - MVP/
│
├── Backend/
│   ├── main.py
│   ├── ai_service.py
│   ├── requirements.txt
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── README.md

---

## Architecture

```plaintext
React Frontend
↓
FastAPI Backend
↓
OpenRouter LLM API