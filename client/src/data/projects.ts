import type { Project } from '@/types'

export const projects: Project[] = [
  {
    title: 'Stock Market Prediction',
    slug: 'stock-market-prediction',
    shortDescription:
      'A full-stack web application that uses machine learning techniques to analyze stock market data and provide prediction insights.',
    longDescription:
      'Operation Stock Market Prediction is a comprehensive full-stack platform that ingests historical market data, processes it through machine learning pipelines, and serves predictive insights through an interactive dashboard. The system demonstrates the complete ML lifecycle from data collection and feature engineering to model training and forecast visualization.',
    objective:
      'Build a system that predicts future stock trends using machine learning, delivering actionable insights through a clean web interface.',
    problem:
      'Retail investors struggle to interpret raw market data and often lack tools that translate complex signals into clear predictions, creating information asymmetry with institutional players.',
    solution:
      'A unified platform combining Python-based ML pipelines with a responsive React dashboard. Historical data feeds feature engineering (moving averages, momentum indicators), models like Linear Regression and LSTM are trained server-side, and forecasts are exposed through a REST API consumed by the frontend.',
    architecture: [
      'React SPA (Vite) composes the tactical command dashboard',
      'Express.js REST API brokers data between layers',
      'MongoDB stores symbols, snapshots, and prediction history',
      'Python service trains models and exposes inference endpoints',
      'Node.js orchestrates scheduled re-training via background jobs',
    ],
    keyFeatures: [
      'Interactive candlestick and trend charts',
      'Multi-model forecasting (Linear Regression, LSTM)',
      'Technical indicator overlays (MA, RSI, MACD)',
      'Confidence scoring per prediction',
      'Historical accuracy reporting',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'Machine Learning'],
    images: [],
    githubUrl: 'https://github.com/supritpanda/stock-market-prediction',
    liveUrl: 'https://stock-predict-demo.example.com',
    status: 'completed',
    featured: true,
    difficulty: 'hard',
    missionNumber: 1,
  },
]

export const getFeaturedProject = (): Project | undefined =>
  projects.find((p) => p.featured) || projects[0]