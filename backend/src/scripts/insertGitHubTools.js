const mongoose = require('mongoose');
const AITool = require('../models/AITool');
require('dotenv').config();

const aiTools = [
  {
    name: "TensorFlow",
    source: "GitHub",
    metrics: {
      stars: 175000,
      forks: 88000
    },
    url: "https://github.com/tensorflow/tensorflow",
    description: "An end-to-end open source machine learning platform",
    timeline: [{
      date: new Date(),
      value: 175000
    }]
  },
  {
    name: "PyTorch",
    source: "GitHub",
    metrics: {
      stars: 65000,
      forks: 18000
    },
    url: "https://github.com/pytorch/pytorch",
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration",
    timeline: [{
      date: new Date(),
      value: 65000
    }]
  },
  {
    name: "Transformers",
    source: "GitHub",
    metrics: {
      stars: 85000,
      forks: 19000
    },
    url: "https://github.com/huggingface/transformers",
    description: "State-of-the-art Machine Learning for JAX, PyTorch and TensorFlow",
    timeline: [{
      date: new Date(),
      value: 85000
    }]
  },
  {
    name: "Stable Diffusion",
    source: "GitHub",
    metrics: {
      stars: 45000,
      forks: 7000
    },
    url: "https://github.com/CompVis/stable-diffusion",
    description: "A latent text-to-image diffusion model",
    timeline: [{
      date: new Date(),
      value: 45000
    }]
  },
  {
    name: "LangChain",
    source: "GitHub",
    metrics: {
      stars: 55000,
      forks: 8000
    },
    url: "https://github.com/langchain-ai/langchain",
    description: "Building applications with LLMs through composability",
    timeline: [{
      date: new Date(),
      value: 55000
    }]
  },
  {
    name: "LlamaIndex",
    source: "GitHub",
    metrics: {
      stars: 20000,
      forks: 2500
    },
    url: "https://github.com/run-llama/llama_index",
    description: "LlamaIndex is a data framework for LLM applications",
    timeline: [{
      date: new Date(),
      value: 20000
    }]
  },
  {
    name: "AutoGPT",
    source: "GitHub",
    metrics: {
      stars: 140000,
      forks: 30000
    },
    url: "https://github.com/Significant-Gravitas/Auto-GPT",
    description: "An experimental open-source attempt to make GPT-4 fully autonomous",
    timeline: [{
      date: new Date(),
      value: 140000
    }]
  },
  {
    name: "DeepSpeed",
    source: "GitHub",
    metrics: {
      stars: 25000,
      forks: 3000
    },
    url: "https://github.com/microsoft/DeepSpeed",
    description: "Deep learning optimization library",
    timeline: [{
      date: new Date(),
      value: 25000
    }]
  },
  {
    name: "FastAI",
    source: "GitHub",
    metrics: {
      stars: 24000,
      forks: 7500
    },
    url: "https://github.com/fastai/fastai",
    description: "Deep learning library",
    timeline: [{
      date: new Date(),
      value: 24000
    }]
  },
  {
    name: "Keras",
    source: "GitHub",
    metrics: {
      stars: 58000,
      forks: 19000
    },
    url: "https://github.com/keras-team/keras",
    description: "Deep Learning for humans",
    timeline: [{
      date: new Date(),
      value: 58000
    }]
  },
  {
    name: "Scikit-learn",
    source: "GitHub",
    metrics: {
      stars: 55000,
      forks: 24000
    },
    url: "https://github.com/scikit-learn/scikit-learn",
    description: "Machine Learning in Python",
    timeline: [{
      date: new Date(),
      value: 55000
    }]
  },
  {
    name: "OpenAI Gym",
    source: "GitHub",
    metrics: {
      stars: 32000,
      forks: 9000
    },
    url: "https://github.com/openai/gym",
    description: "A toolkit for developing and comparing reinforcement learning algorithms",
    timeline: [{
      date: new Date(),
      value: 32000
    }]
  },
  {
    name: "Ray",
    source: "GitHub",
    metrics: {
      stars: 25000,
      forks: 4500
    },
    url: "https://github.com/ray-project/ray",
    description: "An open source framework that provides a simple, universal API for building distributed applications",
    timeline: [{
      date: new Date(),
      value: 25000
    }]
  },
  {
    name: "Detectron2",
    source: "GitHub",
    metrics: {
      stars: 24000,
      forks: 6500
    },
    url: "https://github.com/facebookresearch/detectron2",
    description: "FAI's next-generation platform for object detection and segmentation",
    timeline: [{
      date: new Date(),
      value: 24000
    }]
  },
  {
    name: "YOLOv5",
    source: "GitHub",
    metrics: {
      stars: 38000,
      forks: 14000
    },
    url: "https://github.com/ultralytics/yolov5",
    description: "YOLOv5 in PyTorch > ONNX > CoreML > TFLite",
    timeline: [{
      date: new Date(),
      value: 38000
    }]
  },
  {
    name: "DALL-E",
    source: "GitHub",
    metrics: {
      stars: 15000,
      forks: 2500
    },
    url: "https://github.com/openai/DALL-E",
    description: "DALL·E: Creating images from text",
    timeline: [{
      date: new Date(),
      value: 15000
    }]
  },
  {
    name: "CLIP",
    source: "GitHub",
    metrics: {
      stars: 18000,
      forks: 3000
    },
    url: "https://github.com/openai/CLIP",
    description: "Contrastive Language-Image Pre-Training",
    timeline: [{
      date: new Date(),
      value: 18000
    }]
  },
  {
    name: "Whisper",
    source: "GitHub",
    metrics: {
      stars: 42000,
      forks: 5000
    },
    url: "https://github.com/openai/whisper",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    timeline: [{
      date: new Date(),
      value: 42000
    }]
  },
  {
    name: "JAX",
    source: "GitHub",
    metrics: {
      stars: 23000,
      forks: 2100
    },
    url: "https://github.com/google/jax",
    description: "Composable transformations of Python+NumPy programs",
    timeline: [{
      date: new Date(),
      value: 23000
    }]
  },
  {
    name: "Flax",
    source: "GitHub",
    metrics: {
      stars: 4000,
      forks: 500
    },
    url: "https://github.com/google/flax",
    description: "Flax is a neural network library for JAX that is designed for flexibility",
    timeline: [{
      date: new Date(),
      value: 4000
    }]
  },
  {
    name: "Optuna",
    source: "GitHub",
    metrics: {
      stars: 8000,
      forks: 900
    },
    url: "https://github.com/optuna/optuna",
    description: "A hyperparameter optimization framework",
    timeline: [{
      date: new Date(),
      value: 8000
    }]
  },
  {
    name: "LightGBM",
    source: "GitHub",
    metrics: {
      stars: 15000,
      forks: 3800
    },
    url: "https://github.com/microsoft/LightGBM",
    description: "A fast, distributed, high performance gradient boosting framework",
    timeline: [{
      date: new Date(),
      value: 15000
    }]
  },
  {
    name: "XGBoost",
    source: "GitHub",
    metrics: {
      stars: 24000,
      forks: 8800
    },
    url: "https://github.com/dmlc/xgboost",
    description: "Scalable, Portable and Distributed Gradient Boosting",
    timeline: [{
      date: new Date(),
      value: 24000
    }]
  },
  {
    name: "CatBoost",
    source: "GitHub",
    metrics: {
      stars: 7000,
      forks: 1000
    },
    url: "https://github.com/catboost/catboost",
    description: "A fast, scalable, high performance Gradient Boosting on Decision Trees library",
    timeline: [{
      date: new Date(),
      value: 7000
    }]
  },
  {
    name: "ONNX",
    source: "GitHub",
    metrics: {
      stars: 15000,
      forks: 3500
    },
    url: "https://github.com/onnx/onnx",
    description: "Open Neural Network Exchange",
    timeline: [{
      date: new Date(),
      value: 15000
    }]
  },
  {
    name: "TensorRT",
    source: "GitHub",
    metrics: {
      stars: 6000,
      forks: 1500
    },
    url: "https://github.com/NVIDIA/TensorRT",
    description: "NVIDIA's Deep Learning Inference Runtime",
    timeline: [{
      date: new Date(),
      value: 6000
    }]
  },
  {
    name: "MMDetection",
    source: "GitHub",
    metrics: {
      stars: 12000,
      forks: 4000
    },
    url: "https://github.com/open-mmlab/mmdetection",
    description: "OpenMMLab Detection Toolbox and Benchmark",
    timeline: [{
      date: new Date(),
      value: 12000
    }]
  },
  {
    name: "MMSegmentation",
    source: "GitHub",
    metrics: {
      stars: 5000,
      forks: 1500
    },
    url: "https://github.com/open-mmlab/mmsegmentation",
    description: "OpenMMLab Semantic Segmentation Toolbox and Benchmark",
    timeline: [{
      date: new Date(),
      value: 5000
    }]
  },
  {
    name: "MMPose",
    source: "GitHub",
    metrics: {
      stars: 3000,
      forks: 800
    },
    url: "https://github.com/open-mmlab/mmpose",
    description: "OpenMMLab Pose Estimation Toolbox and Benchmark",
    timeline: [{
      date: new Date(),
      value: 3000
    }]
  },
  {
    name: "MMAction2",
    source: "GitHub",
    metrics: {
      stars: 2500,
      forks: 600
    },
    url: "https://github.com/open-mmlab/mmaction2",
    description: "OpenMMLab's Next Generation Video Understanding Toolbox and Benchmark",
    timeline: [{
      date: new Date(),
      value: 2500
    }]
  }
];

async function insertTools() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing GitHub tools
    await AITool.deleteMany({ source: 'GitHub' });
    console.log('Cleared existing GitHub tools');

    // Insert new tools
    const result = await AITool.insertMany(aiTools);
    console.log(`Successfully inserted ${result.length} AI tools`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertTools(); 