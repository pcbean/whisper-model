# 🎵 Cloudflare Whisper Worker

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/airhao3/cloudflare-whisper-worker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/airhao3/cloudflare-whisper-worker/releases)

A powerful Cloudflare Worker implementation of OpenAI Whisper speech-to-text service with advanced features including **Cloudflare R2 storage support**, comprehensive **performance monitoring**, and extensive **API testing capabilities**.

## ✨ Features

### 🎯 Core Functionality
- **Speech-to-Text Transcription**: Convert audio to text using OpenAI Whisper Large V3 Turbo
- **Audio Translation**: Translate audio content to English
- **Multiple Input Methods**: Support file upload, audio recording, and R2 storage links
- **OpenAI API Compatibility**: Drop-in replacement for OpenAI Whisper API

### ☁️ Advanced R2 Storage Integration
- **Direct R2 Processing**: Process audio files directly from Cloudflare R2 storage
- **Optimized Performance**: Reduce client upload time for large files
- **Security Validation**: Domain whitelist and file size verification
- **Download Analytics**: Detailed R2 fetch performance metrics

### 📊 Performance Monitoring
- **High-Precision Timing**: Microsecond-level performance measurement
- **Network Separation**: Distinguish between network latency and processing time
- **Real-time Analysis**: Processing speed vs audio duration comparison
- **Detailed Breakdown**: File reading, encoding, AI processing, and response generation

### 🔧 Comprehensive API Testing
- **Multi-endpoint Testing**: Test all API endpoints from web interface
- **cURL Generation**: Automatic command generation for CLI testing
- **Postman Integration**: Export collections for advanced testing
- **Response Analysis**: Detailed HTTP response inspection

### 🛡️ Security & Rate Limiting
- **API Key Authentication**: Optional API key protection
- **IP-based Rate Limiting**: Configurable request limits per client
- **File Validation**: Size and format restrictions
- **Request Logging**: Comprehensive audit trail

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account with Workers AI enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/airhao3/cloudflare-whisper-worker.git
   cd cloudflare-whisper-worker
   ```

2. **Configure Wrangler**
   ```bash
   wrangler login
   ```

3. **Deploy to Cloudflare Workers**
   ```bash
   wrangler deploy
   ```

4. **Access your deployed worker**
   - Web Interface: `https://your-worker-name.your-subdomain.workers.dev/`
   - API Endpoint: `https://your-worker-name.your-subdomain.workers.dev/api/info`

## 📖 Usage Guide

### Web Interface

The worker provides a comprehensive web interface with three main sections:

#### 📁 File Upload Tab
- **Drag & Drop**: Simply drag audio files to the upload area
- **Audio Recording**: Record audio directly using your microphone
- **Performance Testing**: Measure worker performance without AI processing
- **Supported Formats**: MP3, WAV, MP4, FLAC, OGG, WebM

#### ☁️ R2 Storage Tab
- **Direct R2 Processing**: Enter R2 storage URLs for processing
- **Link Validation**: Verify R2 links before processing
- **Processing Options**: Choose between transcription or translation
- **Performance Analytics**: R2 download speed and efficiency metrics

#### 🔧 API Testing Tab
- **Endpoint Testing**: Test all available API endpoints
- **Authentication**: Test with optional API keys
- **Developer Tools**: Generate cURL commands and Postman collections
- **Response Analysis**: Detailed HTTP response inspection

### API Endpoints

#### Standard Audio Processing
```bash
# Transcription
curl -X POST "https://your-worker.workers.dev/api/v1/audio/transcriptions" \
  -F "file=@audio.mp3"

# Translation to English
curl -X POST "https://your-worker.workers.dev/api/v1/audio/translations" \
  -F "file=@audio.mp3"
```

#### R2 Storage Processing
```bash
# R2 Transcription
curl -X POST "https://your-worker.workers.dev/api/v1/audio/r2/transcriptions" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-bucket.r2.cloudflarestorage.com/audio.mp3"}'

# R2 Translation
curl -X POST "https://your-worker.workers.dev/api/v1/audio/r2/translations" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-bucket.r2.cloudflarestorage.com/audio.mp3"}'
```

#### Performance Testing
```bash
# Worker performance test (no AI processing)
curl -X POST "https://your-worker.workers.dev/api/performance/test" \
  -F "file=@audio.mp3"
```

#### Service Information
```bash
# Get API information
curl "https://your-worker.workers.dev/api/info"
```

## 🔧 Configuration

### Security Settings

Edit the `SECURITY_CONFIG` object in `whisper-worker.js`:

```javascript
const SECURITY_CONFIG = {
  API_KEYS: ['your-api-key-here'],           // Optional API keys
  MAX_FILE_SIZE: 25 * 1024 * 1024,          // 25MB max file size
  RATE_LIMIT_PER_MINUTE: 10,                // Requests per minute per IP
  ALLOWED_IPS: [],                          // IP whitelist (empty = allow all)
  BLOCKED_IPS: [],                          // IP blacklist
  REQUIRE_API_KEY: false,                   // Enforce API key authentication
  ALLOWED_AUDIO_TYPES: [                    // Supported file types
    'audio/mpeg', 'audio/wav', 'audio/mp4',
    'audio/flac', 'audio/ogg', 'audio/webm'
  ]
};
```

### R2 Domain Configuration

Configure allowed R2 domains for security:

```javascript
const allowedDomains = [
  '.r2.cloudflarestorage.com',
  '.r2.dev',
  'r2.storage'
];
```

## 📊 Performance Features

### High-Precision Metrics
- **Microsecond Timing**: Uses `performance.now()` for precise measurements
- **Network Separation**: Separates network latency from processing time
- **Component Breakdown**: Individual timing for each processing stage

### R2 Performance Analysis
- **Download Speed**: R2 fetch speed in MB/s
- **Processing Efficiency**: R2 vs direct upload comparison
- **Optimization Recommendations**: Suggestions based on file size and performance

### Real-time Monitoring
- **Processing Speed Ratio**: AI processing time vs audio duration
- **Real-time Factor**: Capability assessment for real-time processing
- **Throughput Analysis**: Data processing rates and bottleneck identification

## 🛡️ Security Features

### Authentication Options
- **API Key Support**: Bearer token or X-API-Key header authentication
- **Rate Limiting**: Configurable per-IP request limits
- **IP Filtering**: Whitelist/blacklist IP address management

### File Security
- **Size Limits**: Configurable maximum file size restrictions
- **Type Validation**: MIME type verification for uploaded files
- **R2 Domain Validation**: Security checks for R2 storage URLs

### Audit & Logging
- **Request Logging**: Comprehensive request/response logging
- **Performance Tracking**: Detailed performance metrics logging
- **Error Tracking**: Error reporting and debugging information

## 🔄 API Response Format

### Success Response
```json
{
  "text": "Transcribed text content",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello world"
    }
  ],
  "language": "en",
  "duration": 10.5,
  "source_type": "file_upload", // or "r2_storage"
  "performance_metrics": {
    "total_duration_ms": 1250,
    "core_processing_times": {
      "ai_model_duration_ms": 850,
      "r2_download_duration_ms": 150, // Only for R2 requests
      "pure_worker_processing_ms": 1100
    },
    "performance_analysis": {
      "processing_speed_ratio": "0.085x",
      "realtime_factor": "0.085",
      "r2_download_efficiency": "Excellent" // Only for R2 requests
    }
  }
}
```

### Error Response
```json
{
  "error": {
    "message": "File too large. Maximum size: 25MB",
    "type": "file_too_large",
    "code": "file_size_exceeded"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI Whisper](https://github.com/openai/whisper) for the amazing speech recognition model
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) for providing the AI inference platform
- [Cloudflare R2](https://developers.cloudflare.com/r2/) for scalable object storage

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/airhao3/cloudflare-whisper-worker/issues)
- 📖 **Documentation**: [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 💬 **Community**: [Cloudflare Community](https://community.cloudflare.com/)

## 🔗 Related Projects

- [OpenAI Whisper](https://github.com/openai/whisper)
- [Cloudflare Workers Examples](https://github.com/cloudflare/workers-examples)
- [Wrangler CLI](https://github.com/cloudflare/workers-sdk)

---

**Built with ❤️ for the Cloudflare Workers community**