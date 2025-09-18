// Hardcoded digests for past dates. These will override server digests for the same dates
// and will be used as a fallback when the API is unavailable.

export const hardcodedDigests = [
  // Sun Aug 31, 2025
  {
    _id: 'hardcoded-2025-08-31',
    date: '2025-08-31',
    totalTools: 120,
    newTools: 16,
    summary:
      'Kickoff of the week saw updates to lightweight inference servers and improved eval harnesses. RAG infrastructure and compact VLMs continued trending.',
    topEntries: {
      github: [
        { name: 'LiteServe', url: 'https://github.com/example/liteserve', description: 'Minimal GPU inference server with queue-aware schedulers.', metrics: { stars: 8530 } },
        { name: 'EvalKit', url: 'https://github.com/example/evalkit', description: 'Unified evaluation harness for RAG and agents.', metrics: { stars: 6240 } },
        { name: 'VecDB Lite', url: 'https://github.com/example/vecdb-lite', description: 'Embedded vector DB with SQLite persistence.', metrics: { stars: 4102 } }
      ],
      huggingface: [
        { name: 'Mini-VLM-2B', url: 'https://huggingface.co/example/mini-vlm-2b', description: 'Compact VLM for edge devices.', metrics: { downloads: 156210 } },
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Base LM optimized for speculative decoding.', metrics: { downloads: 99120 } },
        { name: 'AudioLM Tiny', url: 'https://huggingface.co/example/audiolm-tiny', description: 'Tiny speech model for on-device ASR.', metrics: { downloads: 77050 } }
      ],
      arxiv: [
        { name: 'Sparse Fine-Tuning for Multimodal LMs', url: 'https://arxiv.org/abs/2508.01234', description: 'Parameter-sparse adapters for efficient multimodal tuning.', metrics: { citations: 44 } },
        { name: 'Benchmarking Tool Use in Agents', url: 'https://arxiv.org/abs/2508.02345', description: 'Evaluation suite for tool-augmented agents.', metrics: { citations: 38 } },
        { name: 'Draft Distillation for Speculative Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Improves draft quality for faster decoding.', metrics: { citations: 30 } }
      ]
    }
  },
  // Mon Sep 1, 2025
  {
    _id: 'hardcoded-2025-09-01',
    date: '2025-09-01',
    totalTools: 122,
    newTools: 18,
    summary:
      'More activity on agents with better planning and observability. Streaming TTS and low-latency inference gained attention.',
    topEntries: {
      github: [
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Composable multi-agent workflows with tracing.', metrics: { stars: 5205 } },
        { name: 'StreamTTS', url: 'https://github.com/example/streamtts', description: 'Streaming TTS engine for real-time apps.', metrics: { stars: 4620 } },
        { name: 'Traceboard', url: 'https://github.com/example/traceboard', description: 'Distributed tracing for LLM apps.', metrics: { stars: 3920 } }
      ],
      huggingface: [
        { name: 'Whisper-Edge', url: 'https://huggingface.co/example/whisper-edge', description: 'Optimized Whisper for edge devices.', metrics: { downloads: 73900 } },
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact cross-encoder reranker.', metrics: { downloads: 84990 } },
        { name: 'StructLM', url: 'https://huggingface.co/example/structlm', description: 'Structured output training objectives.', metrics: { downloads: 52550 } }
      ],
      arxiv: [
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware retrieval and answer validation.', metrics: { citations: 34 } },
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'Fast vision encoders for VLMs.', metrics: { citations: 28 } },
        { name: 'Agent Planning with Hierarchical Memory', url: 'https://arxiv.org/abs/2507.03030', description: 'Long-horizon planning via episodic memory.', metrics: { citations: 25 } }
      ]
    }
  },
  // Tue Sep 2, 2025
  {
    _id: 'hardcoded-2025-09-02',
    date: '2025-09-02',
    totalTools: 119,
    newTools: 15,
    summary:
      'Compact models and on-device inference led the day. Improved KV cache techniques and schema-constrained decoding remained popular.',
    topEntries: {
      github: [
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'JSON schema-constrained decoding for valid outputs.', metrics: { stars: 3188 } },
        { name: 'TinyEmbed', url: 'https://github.com/example/tinyembed', description: 'Ultra-compact embeddings with CPU-first design.', metrics: { stars: 2030 } },
        { name: 'PlanCraft', url: 'https://github.com/example/plancraft', description: 'Agent planning primitives and memory backends.', metrics: { stars: 2130 } }
      ],
      huggingface: [
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT for batch-1 inference.', metrics: { downloads: 41780 } },
        { name: 'VisionTiny-Base', url: 'https://huggingface.co/example/visiontiny-base', description: 'Tiny ViT backbone for mobile.', metrics: { downloads: 50700 } },
        { name: 'SmallLM-1.3B', url: 'https://huggingface.co/example/smalllm-1.3b', description: 'Balanced 1.3B model optimized for CPU.', metrics: { downloads: 48620 } }
      ],
      arxiv: [
        { name: 'Latency-Aware KV Cache', url: 'https://arxiv.org/abs/2506.03333', description: 'Reduce KV cache with minimal quality loss.', metrics: { citations: 20 } },
        { name: 'Constrained Decoding with Grammars', url: 'https://arxiv.org/abs/2506.02222', description: 'Formal grammar constraints for structured outputs.', metrics: { citations: 27 } },
        { name: 'Robust Agent Benchmarks', url: 'https://arxiv.org/abs/2504.02020', description: 'Safety and robustness benchmarks for agents.', metrics: { citations: 12 } }
      ]
    }
  },
  // Wed Sep 3, 2025
  {
    _id: 'hardcoded-2025-09-03',
    date: '2025-09-03',
    totalTools: 121,
    newTools: 19,
    summary:
      'Evaluation and observability dominated. New tracing integrations and RAG eval datasets shipped incremental improvements.',
    topEntries: {
      github: [
        { name: 'EvalKit', url: 'https://github.com/example/evalkit', description: 'Evaluation harness with adapters for common stacks.', metrics: { stars: 6290 } },
        { name: 'Traceboard', url: 'https://github.com/example/traceboard', description: 'LLM app tracing with low instrumentation overhead.', metrics: { stars: 3955 } },
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Interactive reranking demos.', metrics: { stars: 1995 } }
      ],
      huggingface: [
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA eval benchmark for instruction following.', metrics: { downloads: 35290 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier for prompts and outputs.', metrics: { downloads: 40490 } },
        { name: 'CodeInstruct-7B', url: 'https://huggingface.co/example/codeinstruct-7b', description: 'Code-focused instruction-tuned model.', metrics: { downloads: 65980 } }
      ],
      arxiv: [
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Failure mode identification via tracing.', metrics: { citations: 23 } },
        { name: 'Program-of-Thought for Code', url: 'https://arxiv.org/abs/2505.02002', description: 'Structured program-of-thought for code gen.', metrics: { citations: 19 } },
        { name: 'Monitoring Drift in RAG', url: 'https://arxiv.org/abs/2505.03003', description: 'Detects retrieval and answer drift.', metrics: { citations: 16 } }
      ]
    }
  },
  // Thu Sep 4, 2025
  {
    _id: 'hardcoded-2025-09-04',
    date: '2025-09-04',
    totalTools: 123,
    newTools: 17,
    summary:
      'Tool-use agents improved with better planners and datasets. Lightweight inference projects kept climbing in popularity.',
    topEntries: {
      github: [
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Agents with tool calling and fine-grained tracing.', metrics: { stars: 5265 } },
        { name: 'LiteServe', url: 'https://github.com/example/liteserve', description: 'Fast, minimal inference server.', metrics: { stars: 8590 } },
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'Batteries-included RAG starter template.', metrics: { stars: 3050 } }
      ],
      huggingface: [
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Spec decoding compatible base model.', metrics: { downloads: 99880 } },
        { name: 'Mini-VLM-2B', url: 'https://huggingface.co/example/mini-vlm-2b', description: 'Compact VLM.', metrics: { downloads: 157300 } },
        { name: 'Vision-Tiny-256', url: 'https://huggingface.co/example/vision-tiny-256', description: '256px vision backbone.', metrics: { downloads: 25210 } }
      ],
      arxiv: [
        { name: 'Benchmarking Tool Use in Agents', url: 'https://arxiv.org/abs/2508.02345', description: 'Standardized evaluation for agent tools.', metrics: { citations: 39 } },
        { name: 'Compact Vision Backbones', url: 'https://arxiv.org/abs/2504.03030', description: 'Compact backbones for edge inference.', metrics: { citations: 10 } },
        { name: 'Efficient KV Cache Paging', url: 'https://arxiv.org/abs/2504.01010', description: 'Virtual memory for KV caches.', metrics: { citations: 13 } }
      ]
    }
  },
  // Fri Sep 5, 2025
  {
    _id: 'hardcoded-2025-09-05',
    date: '2025-09-05',
    totalTools: 125,
    newTools: 20,
    summary:
      'Strong growth in code generation tools and safety infrastructure. Rerankers and retrieval components saw notable upgrades.',
    topEntries: {
      github: [
        { name: 'GuardRails', url: 'https://github.com/example/guardrails', description: 'Safety policy enforcement toolkit.', metrics: { stars: 2810 } },
        { name: 'Coder-Play', url: 'https://github.com/example/coder-play', description: 'Constrained code generation playground.', metrics: { stars: 1825 } },
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Reranking demos and datasets.', metrics: { stars: 2010 } }
      ],
      huggingface: [
        { name: 'CodeLM-9B-Instruct', url: 'https://huggingface.co/example/codelm-9b-instruct', description: 'Instruction-tuned code model.', metrics: { downloads: 61800 } },
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 85420 } },
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT variant.', metrics: { downloads: 41990 } }
      ],
      arxiv: [
        { name: 'Program-of-Thought for Code', url: 'https://arxiv.org/abs/2505.02002', description: 'Structured reasoning for code gen.', metrics: { citations: 20 } },
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware RAG.', metrics: { citations: 35 } },
        { name: 'Monitoring Drift in RAG', url: 'https://arxiv.org/abs/2505.03003', description: 'Continuous evaluation for drift.', metrics: { citations: 17 } }
      ]
    }
  },
  // Sat Sep 6, 2025
  {
    _id: 'hardcoded-2025-09-06',
    date: '2025-09-06',
    totalTools: 123,
    newTools: 14,
    summary:
      'Week wrapped with stability releases and documentation updates. Emphasis on reliability for production deployments of RAG and agents.',
    topEntries: {
      github: [
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'RAG starter with observability and eval.', metrics: { stars: 3075 } },
        { name: 'LiteTokenizers', url: 'https://github.com/example/litetokenizers', description: 'Fast tokenizers with SIMD paths.', metrics: { stars: 1615 } },
        { name: 'PlanCraft', url: 'https://github.com/example/plancraft', description: 'Planning primitives for agents.', metrics: { stars: 2140 } }
      ],
      huggingface: [
        { name: 'SmallLM-1.3B', url: 'https://huggingface.co/example/smalllm-1.3b', description: '1.3B CPU-friendly model.', metrics: { downloads: 48890 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA eval benchmark.', metrics: { downloads: 35410 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier.', metrics: { downloads: 40720 } }
      ],
      arxiv: [
        { name: 'Draft Distillation for Speculative Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Draft model distillation strategies.', metrics: { citations: 31 } },
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'Encoders for VLM speedups.', metrics: { citations: 29 } },
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Trace-based debugging.', metrics: { citations: 24 } }
      ]
    }
  }
  ,
  // Sun Sep 7, 2025
  {
    _id: 'hardcoded-2025-09-07',
    date: '2025-09-07',
    totalTools: 124,
    newTools: 18,
    summary:
      'Focus on small models and structured outputs. Tooling around schema enforcement and compact embeddings advanced.',
    topEntries: {
      github: [
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'Schema-constrained decoding for reliable JSON.', metrics: { stars: 3210 } },
        { name: 'TinyEmbed', url: 'https://github.com/example/tinyembed', description: 'CPU-first tiny embeddings.', metrics: { stars: 2050 } },
        { name: 'LiteTokenizers', url: 'https://github.com/example/litetokenizers', description: 'Fast tokenizer implementations with SIMD.', metrics: { stars: 1630 } }
      ],
      huggingface: [
        { name: 'SmallLM-1.3B', url: 'https://huggingface.co/example/smalllm-1.3b', description: 'Balanced CPU-friendly model.', metrics: { downloads: 49010 } },
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast batch-1 ViT.', metrics: { downloads: 42100 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier for prompts/outputs.', metrics: { downloads: 40910 } }
      ],
      arxiv: [
        { name: 'Constrained Decoding with Grammars', url: 'https://arxiv.org/abs/2506.02222', description: 'Formal grammars for valid outputs.', metrics: { citations: 28 } },
        { name: 'Latency-Aware KV Cache', url: 'https://arxiv.org/abs/2506.03333', description: 'Reducing KV cache overhead.', metrics: { citations: 21 } },
        { name: 'Compact Vision Backbones', url: 'https://arxiv.org/abs/2504.03030', description: 'Edge-focused vision backbones.', metrics: { citations: 11 } }
      ]
    }
  },
  // Mon Sep 8, 2025
  {
    _id: 'hardcoded-2025-09-08',
    date: '2025-09-08',
    totalTools: 126,
    newTools: 19,
    summary:
      'RAG evaluation and indexing improved. New features in vector DBs and rerankers shipped.',
    topEntries: {
      github: [
        { name: 'VecDB Lite', url: 'https://github.com/example/vecdb-lite', description: 'Embedded vector store with SQLite.', metrics: { stars: 4135 } },
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Interactive reranking demos.', metrics: { stars: 2020 } },
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'Batteries-included RAG starter.', metrics: { stars: 3090 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker for low latency.', metrics: { downloads: 86050 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA eval dataset.', metrics: { downloads: 35620 } },
        { name: 'VisionTiny-Base', url: 'https://huggingface.co/example/visiontiny-base', description: 'Tiny ViT backbone.', metrics: { downloads: 50980 } }
      ],
      arxiv: [
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware retrieval.', metrics: { citations: 36 } },
        { name: 'Monitoring Drift in RAG', url: 'https://arxiv.org/abs/2505.03003', description: 'Continuous evaluation for drift.', metrics: { citations: 18 } },
        { name: 'Robust Agent Benchmarks', url: 'https://arxiv.org/abs/2504.02020', description: 'Safety/robustness benchmarks.', metrics: { citations: 13 } }
      ]
    }
  },
  // Tue Sep 9, 2025
  {
    _id: 'hardcoded-2025-09-09',
    date: '2025-09-09',
    totalTools: 127,
    newTools: 17,
    summary:
      'Observability took center stage. Tracing and metrics for agentic systems improved alongside inference server updates.',
    topEntries: {
      github: [
        { name: 'Traceboard', url: 'https://github.com/example/traceboard', description: 'Distributed tracing for LLM apps.', metrics: { stars: 3980 } },
        { name: 'LiteServe', url: 'https://github.com/example/liteserve', description: 'Queue-aware GPU inference server.', metrics: { stars: 8625 } },
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Composable multi-agent workflows.', metrics: { stars: 5290 } }
      ],
      huggingface: [
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Speculative decoding base model.', metrics: { downloads: 100210 } },
        { name: 'CodeInstruct-7B', url: 'https://huggingface.co/example/codeinstruct-7b', description: 'Instruction-tuned code model.', metrics: { downloads: 66210 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier.', metrics: { downloads: 41140 } }
      ],
      arxiv: [
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Trace-based debugging.', metrics: { citations: 25 } },
        { name: 'Draft Distillation for Spec Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Distilled draft models for speedups.', metrics: { citations: 32 } },
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'VLM encoders with speedups.', metrics: { citations: 30 } }
      ]
    }
  },
  // Wed Sep 10, 2025
  {
    _id: 'hardcoded-2025-09-10',
    date: '2025-09-10',
    totalTools: 125,
    newTools: 16,
    summary:
      'RAG and retrieval focus continued. Improvements landed in indexing, reranking quality, and schema safety.',
    topEntries: {
      github: [
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Reranking demos and baselines.', metrics: { stars: 2040 } },
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'Schema enforcement for outputs.', metrics: { stars: 3235 } },
        { name: 'VecDB Lite', url: 'https://github.com/example/vecdb-lite', description: 'SQLite-backed vector DB.', metrics: { stars: 4160 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 86650 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA eval dataset.', metrics: { downloads: 35790 } },
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT.', metrics: { downloads: 42340 } }
      ],
      arxiv: [
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware retrieval.', metrics: { citations: 37 } },
        { name: 'Constrained Decoding with Grammars', url: 'https://arxiv.org/abs/2506.02222', description: 'Grammar-constrained decoding.', metrics: { citations: 29 } },
        { name: 'Latency-Aware KV Cache', url: 'https://arxiv.org/abs/2506.03333', description: 'KV cache techniques.', metrics: { citations: 22 } }
      ]
    }
  },
  // Thu Sep 11, 2025
  {
    _id: 'hardcoded-2025-09-11',
    date: '2025-09-11',
    totalTools: 126,
    newTools: 18,
    summary:
      'Better planning for agents and improved tracing. Tool-use benchmarks and datasets saw updates.',
    topEntries: {
      github: [
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Tool-calling agents with tracing.', metrics: { stars: 5335 } },
        { name: 'Traceboard', url: 'https://github.com/example/traceboard', description: 'LLM tracing toolkit.', metrics: { stars: 4010 } },
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'RAG starter with observability.', metrics: { stars: 3110 } }
      ],
      huggingface: [
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Spec decoding base model.', metrics: { downloads: 100900 } },
        { name: 'Mini-VLM-2B', url: 'https://huggingface.co/example/mini-vlm-2b', description: 'Compact VLM.', metrics: { downloads: 158000 } },
        { name: 'VisionTiny-Base', url: 'https://huggingface.co/example/visiontiny-base', description: 'Tiny ViT backbone.', metrics: { downloads: 51220 } }
      ],
      arxiv: [
        { name: 'Benchmarking Tool Use in Agents', url: 'https://arxiv.org/abs/2508.02345', description: 'Tool-use benchmark updates.', metrics: { citations: 40 } },
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Trace-based debugging.', metrics: { citations: 26 } },
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'Fast encoders for VLMs.', metrics: { citations: 31 } }
      ]
    }
  },
  // Fri Sep 12, 2025
  {
    _id: 'hardcoded-2025-09-12',
    date: '2025-09-12',
    totalTools: 128,
    newTools: 21,
    summary:
      'Notable releases in inference servers and safety. Reranker quality and retrieval plugins improved across the board.',
    topEntries: {
      github: [
        { name: 'LiteServe', url: 'https://github.com/example/liteserve', description: 'Minimal inference server.', metrics: { stars: 8680 } },
        { name: 'GuardRails', url: 'https://github.com/example/guardrails', description: 'Safety policy enforcement.', metrics: { stars: 2835 } },
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Reranking playground.', metrics: { stars: 2065 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 87210 } },
        { name: 'CodeInstruct-7B', url: 'https://huggingface.co/example/codeinstruct-7b', description: 'Code instruction model.', metrics: { downloads: 66490 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA evaluation benchmark.', metrics: { downloads: 36010 } }
      ],
      arxiv: [
        { name: 'Program-of-Thought for Code', url: 'https://arxiv.org/abs/2505.02002', description: 'Structured code reasoning.', metrics: { citations: 21 } },
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware RAG.', metrics: { citations: 38 } },
        { name: 'Draft Distillation for Spec Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Draft distillation speedups.', metrics: { citations: 33 } }
      ]
    }
  },
  // Sat Sep 13, 2025
  {
    _id: 'hardcoded-2025-09-13',
    date: '2025-09-13',
    totalTools: 124,
    newTools: 15,
    summary:
      'Stability and documentation day. Multiple projects released maintenance updates and docs.',
    topEntries: {
      github: [
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'RAG starter with docs and examples.', metrics: { stars: 3130 } },
        { name: 'PlanCraft', url: 'https://github.com/example/plancraft', description: 'Agent planning primitives.', metrics: { stars: 2160 } },
        { name: 'LiteTokenizers', url: 'https://github.com/example/litetokenizers', description: 'Fast tokenizers.', metrics: { stars: 1650 } }
      ],
      huggingface: [
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT variant.', metrics: { downloads: 42520 } },
        { name: 'SmallLM-1.3B', url: 'https://huggingface.co/example/smalllm-1.3b', description: 'CPU-friendly 1.3B model.', metrics: { downloads: 49260 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier.', metrics: { downloads: 41310 } }
      ],
      arxiv: [
        { name: 'Monitoring Drift in RAG', url: 'https://arxiv.org/abs/2505.03003', description: 'Detects retrieval/answer drift.', metrics: { citations: 19 } },
        { name: 'Robust Agent Benchmarks', url: 'https://arxiv.org/abs/2504.02020', description: 'Agent robustness benchmarks.', metrics: { citations: 14 } },
        { name: 'Efficient KV Cache Paging', url: 'https://arxiv.org/abs/2504.01010', description: 'KV cache paging.', metrics: { citations: 14 } }
      ]
    }
  },
  // Sun Sep 14, 2025
  {
    _id: 'hardcoded-2025-09-14',
    date: '2025-09-14',
    totalTools: 122,
    newTools: 13,
    summary:
      'Quiet day with incremental updates. On-device inference and reranking continued to trend steadily.',
    topEntries: {
      github: [
        { name: 'TinyEmbed', url: 'https://github.com/example/tinyembed', description: 'Tiny embeddings for CPU.', metrics: { stars: 2065 } },
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'Schema-constrained decoding.', metrics: { stars: 3250 } },
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Reranker demos.', metrics: { stars: 2075 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 87680 } },
        { name: 'VisionTiny-Base', url: 'https://huggingface.co/example/visiontiny-base', description: 'Tiny vision backbone.', metrics: { downloads: 51420 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA evaluation dataset.', metrics: { downloads: 36250 } }
      ],
      arxiv: [
        { name: 'Constrained Decoding with Grammars', url: 'https://arxiv.org/abs/2506.02222', description: 'Grammar-constrained decoding.', metrics: { citations: 30 } },
        { name: 'Draft Distillation for Spec Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Draft distillation.', metrics: { citations: 34 } },
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware RAG.', metrics: { citations: 39 } }
      ]
    }
  },
  // Mon Sep 15, 2025
  {
    _id: 'hardcoded-2025-09-15',
    date: '2025-09-15',
    totalTools: 129,
    newTools: 22,
    summary:
      'Busy start to the week: agents, inference servers, and safety tooling all shipped new features.',
    topEntries: {
      github: [
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Agents with robust planning.', metrics: { stars: 5410 } },
        { name: 'LiteServe', url: 'https://github.com/example/liteserve', description: 'Minimal inference server.', metrics: { stars: 8715 } },
        { name: 'GuardRails', url: 'https://github.com/example/guardrails', description: 'Safety policy toolkit.', metrics: { stars: 2850 } }
      ],
      huggingface: [
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Spec decoding base.', metrics: { downloads: 101550 } },
        { name: 'Mini-VLM-2B', url: 'https://huggingface.co/example/mini-vlm-2b', description: 'Compact VLM.', metrics: { downloads: 159400 } },
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT.', metrics: { downloads: 42780 } }
      ],
      arxiv: [
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'Fast VLM encoders.', metrics: { citations: 32 } },
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Trace-based debugging.', metrics: { citations: 27 } },
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware RAG.', metrics: { citations: 40 } }
      ]
    }
  },
  // Tue Sep 16, 2025
  {
    _id: 'hardcoded-2025-09-16',
    date: '2025-09-16',
    totalTools: 126,
    newTools: 18,
    summary:
      'Stable day with strong focus on retrieval quality and compact models for edge.',
    topEntries: {
      github: [
        { name: 'Reranker-Playground', url: 'https://github.com/example/reranker-playground', description: 'Reranker testbed.', metrics: { stars: 2080 } },
        { name: 'TinyEmbed', url: 'https://github.com/example/tinyembed', description: 'Tiny embeddings.', metrics: { stars: 2085 } },
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'Structured output safety.', metrics: { stars: 3270 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 88020 } },
        { name: 'SmallLM-1.3B', url: 'https://huggingface.co/example/smalllm-1.3b', description: 'CPU-friendly LM.', metrics: { downloads: 49520 } },
        { name: 'DetectorSafe', url: 'https://huggingface.co/example/detectorsafe', description: 'Safety classifier.', metrics: { downloads: 41610 } }
      ],
      arxiv: [
        { name: 'Latency-Aware KV Cache', url: 'https://arxiv.org/abs/2506.03333', description: 'KV cache performance.', metrics: { citations: 23 } },
        { name: 'Draft Distillation for Spec Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Spec decoding draft distillation.', metrics: { citations: 35 } },
        { name: 'Robust Agent Benchmarks', url: 'https://arxiv.org/abs/2504.02020', description: 'Agent robustness.', metrics: { citations: 15 } }
      ]
    }
  },
  // Wed Sep 17, 2025
  {
    _id: 'hardcoded-2025-09-17',
    date: '2025-09-17',
    totalTools: 127,
    newTools: 19,
    summary:
      'Agents and observability updates continued. New releases strengthened planning, memory, and tracing.',
    topEntries: {
      github: [
        { name: 'AgentFlow', url: 'https://github.com/example/agentflow', description: 'Agent workflows with planning.', metrics: { stars: 5460 } },
        { name: 'Traceboard', url: 'https://github.com/example/traceboard', description: 'Tracing toolkit.', metrics: { stars: 4040 } },
        { name: 'PlanCraft', url: 'https://github.com/example/plancraft', description: 'Planning primitives.', metrics: { stars: 2180 } }
      ],
      huggingface: [
        { name: 'SpecLM-Base', url: 'https://huggingface.co/example/speclm-base', description: 'Spec decoding base.', metrics: { downloads: 102100 } },
        { name: 'Mini-VLM-2B', url: 'https://huggingface.co/example/mini-vlm-2b', description: 'Compact VLM.', metrics: { downloads: 160100 } },
        { name: 'VisionTiny-Base', url: 'https://huggingface.co/example/visiontiny-base', description: 'Tiny ViT backbone.', metrics: { downloads: 51600 } }
      ],
      arxiv: [
        { name: 'Debugging LLMs with Traces', url: 'https://arxiv.org/abs/2505.01001', description: 'Trace-based debugging.', metrics: { citations: 28 } },
        { name: 'Calibrated RAG with Confidence', url: 'https://arxiv.org/abs/2507.01010', description: 'Confidence-aware RAG.', metrics: { citations: 41 } },
        { name: 'Lightweight Vision Encoders', url: 'https://arxiv.org/abs/2507.02020', description: 'Fast encoders for VLMs.', metrics: { citations: 33 } }
      ]
    }
  },
  // Thu Sep 18, 2025
  {
    _id: 'hardcoded-2025-09-18',
    date: '2025-09-18',
    totalTools: 126,
    newTools: 17,
    summary:
      'Week concluded with improvements to retrieval and schema safety. Multiple projects shipped minor releases.',
    topEntries: {
      github: [
        { name: 'JSONGuard', url: 'https://github.com/example/jsonguard', description: 'Schema-constrained decoding.', metrics: { stars: 3290 } },
        { name: 'VecDB Lite', url: 'https://github.com/example/vecdb-lite', description: 'Embedded vector DB.', metrics: { stars: 4190 } },
        { name: 'RAGBox', url: 'https://github.com/example/ragbox', description: 'RAG starter kit.', metrics: { stars: 3150 } }
      ],
      huggingface: [
        { name: 'MiniRerank-110M', url: 'https://huggingface.co/example/minirerank-110m', description: 'Compact reranker.', metrics: { downloads: 88450 } },
        { name: 'VisionLite-Turbo', url: 'https://huggingface.co/example/visionlite-turbo', description: 'Fast ViT.', metrics: { downloads: 43050 } },
        { name: 'EvalBench-QA', url: 'https://huggingface.co/datasets/example/evalbench-qa', description: 'QA eval dataset.', metrics: { downloads: 36590 } }
      ],
      arxiv: [
        { name: 'Latency-Aware KV Cache', url: 'https://arxiv.org/abs/2506.03333', description: 'KV cache techniques.', metrics: { citations: 24 } },
        { name: 'Draft Distillation for Spec Decoding', url: 'https://arxiv.org/abs/2508.03456', description: 'Draft distillation.', metrics: { citations: 36 } },
        { name: 'Program-of-Thought for Code', url: 'https://arxiv.org/abs/2505.02002', description: 'Structured code reasoning.', metrics: { citations: 22 } }
      ]
    }
  }
];


