const HTML_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whisper 音频转文字测试</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .upload-area {
            border: 2px dashed #ccc;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            margin-bottom: 20px;
            background-color: #fafafa;
            transition: border-color 0.3s ease;
        }
        .upload-area:hover {
            border-color: #007cba;
        }
        .upload-area.dragover {
            border-color: #007cba;
            background-color: #f0f8ff;
        }
        input[type="file"] {
            margin: 10px 0;
        }
        button {
            background-color: #007cba;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #005a8a;
        }
        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            min-height: 100px;
        }
        .loading {
            text-align: center;
            color: #007cba;
            font-style: italic;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border-color: #f5c6cb;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border-color: #c3e6cb;
        }
        .file-info {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .record-controls {
            margin: 20px 0;
            text-align: center;
        }
        .recording {
            background-color: #dc3545 !important;
        }
        .recording:hover {
            background-color: #c82333 !important;
        }
        
        /* Tab styles */
        .tab-container {
            margin-bottom: 30px;
        }
        .tab-nav {
            display: flex;
            border-bottom: 2px solid #e9ecef;
            margin-bottom: 20px;
        }
        .tab-btn {
            background: none;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            margin-right: 5px;
        }
        .tab-btn:hover {
            color: #007cba;
            background-color: #f8f9fa;
        }
        .tab-btn.active {
            color: #007cba;
            border-bottom-color: #007cba;
            background-color: #fff;
        }
        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }
        .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* R2 input styles */
        .r2-input-area, .api-test-area {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            margin-bottom: 20px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }
        .input-group input, .input-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }
        .input-group input:focus, .input-group select:focus {
            outline: none;
            border-color: #007cba;
            box-shadow: 0 0 0 3px rgba(0, 124, 186, 0.1);
        }
        .r2-controls, .api-controls {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .r2-controls button, .api-controls button {
            flex: 1;
            min-width: 140px;
        }
        
        /* API test specific styles */
        .api-config {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        #apiCopyBtn {
            background-color: #6c757d;
        }
        #apiCopyBtn:hover {
            background-color: #545b62;
        }
        #apiExportBtn {
            background-color: #ff6b35;
        }
        #apiExportBtn:hover {
            background-color: #e55a2b;
        }
        #r2ProcessBtn {
            background-color: #28a745;
        }
        #r2ProcessBtn:hover {
            background-color: #218838;
        }
        #r2ValidateBtn {
            background-color: #17a2b8;
        }
        #r2ValidateBtn:hover {
            background-color: #138496;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Whisper 音频转文字测试</h1>
        
        <!-- Tab Navigation -->
        <div class="tab-container">
            <div class="tab-nav">
                <button class="tab-btn active" onclick="switchTab('upload')">📁 文件上传</button>
                <button class="tab-btn" onclick="switchTab('r2')">☁️ R2链接</button>
                <button class="tab-btn" onclick="switchTab('api')">🔧 API测试</button>
            </div>
        </div>
        
        <!-- File Upload Tab -->
        <div id="uploadTab" class="tab-content active">
            <div class="upload-area" id="uploadArea">
                <p>📁 拖拽音频文件到此处或点击选择文件</p>
                <input type="file" id="audioFile" accept="audio/*" />
                <div class="file-info" id="fileInfo"></div>
            </div>

            <div class="record-controls">
                <button id="recordBtn">🎤 开始录音</button>
                <button id="stopBtn" disabled>⏹️ 停止录音</button>
                <button id="uploadBtn" disabled>📤 上传转换</button>
                <button id="perfTestBtn" disabled style="background: #17a2b8;">🔬 性能测试</button>
            </div>
        </div>
        
        <!-- R2 Link Tab -->
        <div id="r2Tab" class="tab-content">
            <div class="r2-input-area">
                <h3>☁️ 使用R2存储链接</h3>
                <p style="color: #666; margin-bottom: 15px;">输入Cloudflare R2存储的音频文件链接进行处理</p>
                
                <div class="input-group">
                    <label for="r2Url">R2音频文件链接：</label>
                    <input type="url" id="r2Url" placeholder="https://your-bucket.r2.cloudflarestorage.com/path/to/audio.mp3" />
                </div>
                
                <div class="input-group">
                    <label for="r2ProcessType">处理类型：</label>
                    <select id="r2ProcessType">
                        <option value="transcriptions">转录 (Transcription)</option>
                        <option value="translations">翻译为英文 (Translation)</option>
                    </select>
                </div>
                
                <div class="r2-controls">
                    <button id="r2ProcessBtn">🚀 处理R2文件</button>
                    <button id="r2ValidateBtn">✅ 验证链接</button>
                </div>
            </div>
        </div>
        
        <!-- API Test Tab -->
        <div id="apiTab" class="tab-content">
            <div class="api-test-area">
                <h3>🔧 API接口测试</h3>
                <p style="color: #666; margin-bottom: 15px;">测试不同的API端点和参数</p>
                
                <div class="api-config">
                    <div class="input-group">
                        <label for="apiEndpoint">API端点：</label>
                        <select id="apiEndpoint">
                            <option value="/api/v1/audio/transcriptions">转录端点 (/api/v1/audio/transcriptions)</option>
                            <option value="/api/v1/audio/translations">翻译端点 (/api/v1/audio/translations)</option>
                            <option value="/api/v1/audio/r2/transcriptions">R2转录端点 (/api/v1/audio/r2/transcriptions)</option>
                            <option value="/api/v1/audio/r2/translations">R2翻译端点 (/api/v1/audio/r2/translations)</option>
                        </select>
                    </div>
                    
                    <div class="input-group" id="apiKeyGroup">
                        <label for="apiKey">API密钥 (可选)：</label>
                        <input type="password" id="apiKey" placeholder="wh-sk-1234567890abcdef" />
                    </div>
                    
                    <div class="input-group" id="fileInputGroup">
                        <label for="apiFile">选择音频文件：</label>
                        <input type="file" id="apiFile" accept="audio/*" />
                    </div>
                    
                    <div class="input-group" id="r2UrlGroup" style="display: none;">
                        <label for="apiR2Url">R2文件链接：</label>
                        <input type="url" id="apiR2Url" placeholder="https://your-bucket.r2.cloudflarestorage.com/path/to/audio.mp3" />
                    </div>
                    
                    <div class="api-controls">
                        <button id="apiTestBtn">🧪 执行API测试</button>
                        <button id="apiCopyBtn">📋 复制cURL命令</button>
                        <button id="apiExportBtn">📥 导出Postman</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="result" id="result">
            等待选择处理方式...
        </div>
    </div>

    <script>
        const WORKER_URL = window.location.origin;
        
        let selectedFile = null;
        let mediaRecorder = null;
        let recordedChunks = [];
        
        const uploadArea = document.getElementById('uploadArea');
        const audioFile = document.getElementById('audioFile');
        const fileInfo = document.getElementById('fileInfo');
        const recordBtn = document.getElementById('recordBtn');
        const stopBtn = document.getElementById('stopBtn');
        const uploadBtn = document.getElementById('uploadBtn');
        const perfTestBtn = document.getElementById('perfTestBtn');
        const result = document.getElementById('result');

        // 文件拖拽
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        audioFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        function handleFileSelect(file) {
            selectedFile = file;
            fileInfo.innerHTML = \`
                <strong>已选择文件：</strong>\${file.name}<br>
                <strong>文件大小：</strong>\${(file.size / 1024 / 1024).toFixed(2)} MB<br>
                <strong>文件类型：</strong>\${file.type}
            \`;
            uploadBtn.disabled = false;
            perfTestBtn.disabled = false;
        }

        // 录音功能
        recordBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                recordedChunks = [];
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
                    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
                    handleFileSelect(file);
                };
                
                mediaRecorder.start();
                recordBtn.disabled = true;
                recordBtn.classList.add('recording');
                recordBtn.textContent = '🎤 录音中...';
                stopBtn.disabled = false;
                
            } catch (error) {
                showResult('无法访问麦克风：' + error.message, 'error');
            }
        });

        stopBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                
                recordBtn.disabled = false;
                recordBtn.classList.remove('recording');
                recordBtn.textContent = '🎤 开始录音';
                stopBtn.disabled = true;
            }
        });

        uploadBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                showResult('请先选择或录制音频文件', 'error');
                return;
            }

            showResult('正在处理音频文件，请稍候...', 'loading');
            uploadBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('audio', selectedFile);

                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                
                if (data && (data.text || data.segments)) {
                    let performanceHtml = '';
                    if (data.performance_metrics) {
                        const pm = data.performance_metrics;
                        const core = pm.core_processing_times || {};
                        const analysis = pm.performance_analysis || {};
                        const audioInfo = pm.audio_info || {};
                        const rating = pm.performance_rating || {};
                        
                        performanceHtml = \`
                            <div style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 5px; border-left: 4px solid #2196f3;">
                                <h4 style="margin: 0 0 15px 0; color: #1565c0;">📊 详细性能分析</h4>
                                
                                <!-- 核心性能指标 -->
                                <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                                    <h5 style="margin: 0 0 8px 0; color: #28a745;">🎯 核心处理时间 (排除网络延迟)</h5>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 12px;">
                                        <div><strong>AI模型处理:</strong> \${core.ai_model_duration_ms || 'N/A'}ms</div>
                                        <div><strong>文件读取:</strong> \${core.file_read_duration_ms || 'N/A'}ms</div>
                                        <div><strong>Base64编码:</strong> \${core.base64_encode_duration_ms || 'N/A'}ms</div>
                                        <div><strong>预处理总计:</strong> \${core.total_preprocessing_ms || 'N/A'}ms</div>
                                        <div><strong>响应处理:</strong> \${core.response_processing_ms || 'N/A'}ms</div>
                                        <div style="color: #28a745;"><strong>纯Worker处理:</strong> \${core.pure_worker_processing_ms || 'N/A'}ms</div>
                                    </div>
                                </div>
                                
                                <!-- 性能分析 -->
                                <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                                    <h5 style="margin: 0 0 8px 0; color: #856404;">📈 性能分析</h5>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 12px;">
                                        <div><strong>处理速度比:</strong> \${analysis.processing_speed_ratio || 'N/A'}</div>
                                        <div><strong>实时因子:</strong> \${analysis.realtime_factor || 'N/A'}</div>
                                        <div><strong>处理效率:</strong> \${analysis.processing_efficiency || 'N/A'}</div>
                                        <div><strong>网络开销:</strong> \${analysis.network_overhead_percentage || 'N/A'}</div>
                                        <div><strong>性能等级:</strong> \${rating.overall_grade || 'N/A'}</div>
                                        <div><strong>处理类型:</strong> \${rating.processing_class || 'N/A'}</div>
                                    </div>
                                </div>
                                
                                <!-- 音频和文件信息 -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                                    <div>
                                        <strong>🎵 音频信息:</strong><br>
                                        时长: \${audioInfo.duration_formatted || audioInfo.duration_seconds || 'N/A'}<br>
                                        语言: \${audioInfo.detected_language || 'N/A'}<br>
                                        片段数: \${audioInfo.segments_count || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>📁 文件信息:</strong><br>
                                        大小: \${pm.file_info?.size_mb || 'N/A'}MB<br>
                                        类型: \${pm.file_info?.type || 'N/A'}<br>
                                        比特率: \${pm.file_info?.estimated_bitrate || 'N/A'}
                                    </div>
                                </div>
                                
                                <!-- 网络延迟信息 -->
                                \${pm.estimated_network_latency_ms ? \`
                                    <div style="margin-top: 10px; padding: 8px; background: #d1ecf1; border-radius: 4px; font-size: 11px;">
                                        <strong>🌍 网络延迟估算:</strong> \${pm.estimated_network_latency_ms}ms 
                                        <span style="color: #0c5460;">(总时间 \${pm.total_duration_ms}ms - 纯Worker处理 \${core.pure_worker_processing_ms}ms)</span>
                                    </div>
                                \` : ''}
                                
                                <!-- 时间戳 -->
                                <div style="margin-top: 10px; font-size: 11px; color: #666;">
                                    开始: \${new Date(pm.request_start_time).toLocaleTimeString()} | 
                                    结束: \${new Date(pm.request_end_time).toLocaleTimeString()}
                                </div>
                            </div>
                        \`;
                    }
                    
                    showResult(\`
                        <h3>✅ 转换成功</h3>
                        \${performanceHtml}
                        <div style="margin-top: 15px;">
                            <button onclick="downloadJson()" style="background: #28a745; margin-right: 10px;">📥 下载完整JSON</button>
                            <button onclick="copyJson()" style="background: #6c757d;">📋 复制JSON</button>
                        </div>
                        <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
                            <pre style="margin: 0; white-space: pre-wrap; font-size: 12px;">\${JSON.stringify(data, null, 2)}</pre>
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; color: #666;">
                            模型：@cf/openai/whisper-large-v3-turbo | 文件：\${selectedFile.name} | 大小：\${(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    \`, 'success');
                    
                    // 存储完整响应数据用于下载
                    window.lastTranscriptionData = data;
                } else {
                    showResult('❌ 转换失败：' + (data.error || '未知错误'), 'error');
                }
            } catch (error) {
                showResult('❌ 请求失败：' + error.message, 'error');
            } finally {
                uploadBtn.disabled = false;
            }
        });

        // 🔬 性能测试功能 - 只测试Worker处理性能，不进行实际转录
        perfTestBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                showResult('请先选择或录制音频文件', 'error');
                return;
            }

            showResult('正在进行性能测试，不会实际转录音频内容...', 'loading');
            perfTestBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const response = await fetch('/api/performance/test', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                
                if (response.ok && data) {
                    let performanceHtml = '';
                    const wpp = data.worker_processing_performance || {};
                    const pa = data.performance_analysis || {};
                    const fi = data.file_info || {};
                    const pr = data.performance_recommendations || {};
                    const opr = data.overall_performance_rating || {};
                    
                    performanceHtml = \`
                        <div style="margin: 15px 0; padding: 15px; background: #e8f5e9; border-radius: 5px; border-left: 4px solid #4caf50;">
                            <h4 style="margin: 0 0 15px 0; color: #2e7d32;">🔬 Worker性能测试结果 (无AI转录)</h4>
                            
                            <!-- Worker处理性能 -->
                            <div style="background: #f1f8e9; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <h5 style="margin: 0 0 10px 0; color: #388e3c;">🚀 Worker内部处理性能</h5>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13px;">
                                    <div><strong>文件读取:</strong> \${wpp.file_read_duration_ms || 'N/A'}ms</div>
                                    <div><strong>读取速度:</strong> \${wpp.file_read_speed_mbps || 'N/A'} MB/s</div>
                                    <div><strong>Base64编码:</strong> \${wpp.base64_encode_duration_ms || 'N/A'}ms</div>
                                    <div><strong>编码速度:</strong> \${wpp.base64_encode_speed_mbps || 'N/A'} MB/s</div>
                                    <div><strong>预处理总时间:</strong> \${wpp.total_preprocessing_ms || 'N/A'}ms</div>
                                    <div><strong>预处理吞吐量:</strong> \${wpp.preprocessing_throughput_mbps || 'N/A'} MB/s</div>
                                    <div style="color: #1976d2;"><strong>纯Worker开销:</strong> \${wpp.pure_worker_overhead_ms || 'N/A'}ms</div>
                                    <div><strong>响应生成:</strong> \${wpp.response_generation_ms || 'N/A'}ms</div>
                                    <div><strong>处理等级:</strong> \${pa.file_processing_grade || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <!-- 网络分析 -->
                            <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <h5 style="margin: 0 0 10px 0; color: #1976d2;">🌍 网络延迟分析</h5>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13px;">
                                    <div><strong>总请求时间:</strong> \${data.total_request_duration_ms || 'N/A'}ms</div>
                                    <div><strong>估算网络延迟:</strong> \${data.estimated_network_latency_ms || 'N/A'}ms</div>
                                    <div><strong>Worker效率:</strong> \${pa.network_efficiency_percentage || 'N/A'}</div>
                                    <div><strong>网络开销:</strong> \${pa.network_overhead_percentage || 'N/A'}</div>
                                    <div><strong>网络影响:</strong> \${opr.network_impact || 'N/A'}</div>
                                    <div><strong>生产就绪:</strong> \${opr.recommended_for_production || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <!-- 微秒级精度 -->
                            <div style="background: #fff3e0; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                                <h5 style="margin: 0 0 10px 0; color: #ef6c00;">⚡ 高精度时间测量 (微秒)</h5>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 12px;">
                                    <div><strong>文件读取:</strong> \${pa.high_precision_timings?.file_read_microseconds || 'N/A'}μs</div>
                                    <div><strong>Base64编码:</strong> \${pa.high_precision_timings?.base64_encode_microseconds || 'N/A'}μs</div>
                                    <div><strong>预处理:</strong> \${pa.high_precision_timings?.preprocessing_microseconds || 'N/A'}μs</div>
                                    <div><strong>响应生成:</strong> \${pa.high_precision_timings?.response_generation_microseconds || 'N/A'}μs</div>
                                    <div colspan="2"><strong>文件读取占比:</strong> \${pa.processing_breakdown_percentage?.file_reading || 'N/A'}%</div>
                                    <div><strong>编码占比:</strong> \${pa.processing_breakdown_percentage?.base64_encoding || 'N/A'}%</div>
                                </div>
                            </div>
                            
                            <!-- 文件信息 -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                                <div>
                                    <strong>📁 文件信息:</strong><br>
                                    大小: \${fi.size_mb || 'N/A'}MB (\${fi.size_kb || 'N/A'}KB)<br>
                                    类型: \${fi.type || 'N/A'}<br>
                                    名称: \${fi.name || 'N/A'}
                                </div>
                                <div>
                                    <strong>💡 性能建议:</strong><br>
                                    网络: \${pr.network_latency || 'N/A'}<br>
                                    文件: \${pr.file_size || 'N/A'}<br>
                                    处理: \${pr.processing_efficiency || 'N/A'}
                                </div>
                            </div>
                            
                            <!-- 时间戳 -->
                            <div style="margin-top: 12px; font-size: 11px; color: #666; text-align: center;">
                                性能测试完成时间: \${new Date(data.timestamp).toLocaleString()}<br>
                                <span style="color: #4caf50;">✅ 此测试仅评估Worker处理性能，未调用AI模型，可频繁使用</span>
                            </div>
                        </div>
                    \`;
                    
                    showResult(\`
                        <h3>🔬 性能测试完成</h3>
                        \${performanceHtml}
                        <div style="margin-top: 15px;">
                            <button onclick="downloadPerfResult()" style="background: #4caf50; margin-right: 10px;">📥 下载性能报告</button>
                            <button onclick="copyPerfResult()" style="background: #2196f3;">📋 复制测试结果</button>
                        </div>
                        <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
                            <pre style="margin: 0; white-space: pre-wrap; font-size: 11px;">\${JSON.stringify(data, null, 2)}</pre>
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; color: #666;">
                            测试类型：Worker性能测试 | 文件：\${selectedFile.name} | 大小：\${(selectedFile.size / 1024).toFixed(1)} KB | 无AI转录
                        </p>
                    \`, 'success');
                    
                    // 存储性能测试结果用于下载
                    window.lastPerformanceTestData = data;
                } else {
                    showResult('❌ 性能测试失败：' + (data.error || data.message || '未知错误'), 'error');
                }
            } catch (error) {
                showResult('❌ 性能测试请求失败：' + error.message, 'error');
            } finally {
                perfTestBtn.disabled = false;
            }
        });

        function showResult(content, type) {
            result.className = 'result';
            if (type) {
                result.classList.add(type);
            }
            result.innerHTML = content;
        }

        function downloadJson() {
            if (window.lastTranscriptionData) {
                const jsonStr = JSON.stringify(window.lastTranscriptionData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`transcription_\${window.lastTranscriptionData.filename || 'audio'}_\${new Date().getTime()}.json\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }

        function copyJson() {
            if (window.lastTranscriptionData) {
                const jsonStr = JSON.stringify(window.lastTranscriptionData, null, 2);
                navigator.clipboard.writeText(jsonStr).then(() => {
                    alert('JSON 已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
            }
        }

        // 🔬 性能测试结果下载和复制功能
        function downloadPerfResult() {
            if (window.lastPerformanceTestData) {
                const jsonStr = JSON.stringify(window.lastPerformanceTestData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`performance_test_\${window.lastPerformanceTestData.file_info?.name || 'audio'}_\${new Date().getTime()}.json\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }

        function copyPerfResult() {
            if (window.lastPerformanceTestData) {
                const jsonStr = JSON.stringify(window.lastPerformanceTestData, null, 2);
                navigator.clipboard.writeText(jsonStr).then(() => {
                    alert('性能测试结果已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
            }
        }
        
        // =================== 新功能: 标签页管理 ===================
        
        function switchTab(tabName) {
            // 隐藏所有标签页内容
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 移除所有标签按钮的激活状态
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 显示选中的标签页
            document.getElementById(tabName + 'Tab').classList.add('active');
            event.target.classList.add('active');
            
            // 更新结果显示
            if (tabName === 'upload') {
                showResult('等待上传音频文件...', '');
            } else if (tabName === 'r2') {
                showResult('等待输入R2链接...', '');
            } else if (tabName === 'api') {
                showResult('等待配置API测试...', '');
            }
        }
        
        // =================== 新功能: R2链接处理 ===================
        
        const r2ProcessBtn = document.getElementById('r2ProcessBtn');
        const r2ValidateBtn = document.getElementById('r2ValidateBtn');
        const r2Url = document.getElementById('r2Url');
        const r2ProcessType = document.getElementById('r2ProcessType');
        
        r2ValidateBtn.addEventListener('click', async () => {
            const url = r2Url.value.trim();
            if (!url) {
                showResult('请输入R2链接', 'error');
                return;
            }
            
            showResult('正在验证R2链接...', 'loading');
            
            try {
                // 简单的HEAD请求来验证链接
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    const contentType = response.headers.get('Content-Type') || 'unknown';
                    const contentLength = response.headers.get('Content-Length') || 'unknown';
                    showResult(\`✅ R2链接验证成功！<br>
                        文件类型: \${contentType}<br>
                        文件大小: \${contentLength !== 'unknown' ? (contentLength / 1024 / 1024).toFixed(2) + ' MB' : 'unknown'}\`, 'success');
                } else {
                    showResult(\`❌ R2链接验证失败: \${response.status} \${response.statusText}\`, 'error');
                }
            } catch (error) {
                showResult(\`❌ 验证失败: \${error.message}\`, 'error');
            }
        });
        
        r2ProcessBtn.addEventListener('click', async () => {
            const url = r2Url.value.trim();
            if (!url) {
                showResult('请输入R2链接', 'error');
                return;
            }
            
            showResult('正在处理R2音频文件，请稍候...', 'loading');
            r2ProcessBtn.disabled = true;
            
            try {
                const processType = r2ProcessType.value;
                const apiUrl = \`\${WORKER_URL}/api/v1/audio/r2/\${processType}\`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: url
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data && (data.text || data.segments)) {
                    let performanceHtml = '';
                    if (data.performance_metrics) {
                        const pm = data.performance_metrics;
                        const core = pm.core_processing_times || {};
                        const analysis = pm.performance_analysis || {};
                        const r2Info = pm.r2_file_info || {};
                        const rating = pm.r2_performance_rating || {};
                        
                        performanceHtml = \`
                            <div style="margin: 15px 0; padding: 15px; background: #e8f5e9; border-radius: 5px; border-left: 4px solid #4caf50;">
                                <h4 style="margin: 0 0 15px 0; color: #2e7d32;">☁️ R2处理性能分析</h4>
                                
                                <!-- R2下载性能 -->
                                <div style="background: #f1f8e9; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                                    <h5 style="margin: 0 0 8px 0; color: #388e3c;">📥 R2下载性能</h5>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 12px;">
                                        <div><strong>下载时间:</strong> \${core.r2_download_duration_ms || 'N/A'}ms</div>
                                        <div><strong>下载速度:</strong> \${core.r2_download_speed_mbps || 'N/A'} MB/s</div>
                                        <div><strong>下载效率:</strong> \${analysis.r2_download_efficiency || 'N/A'}</div>
                                        <div><strong>AI处理时间:</strong> \${core.ai_model_duration_ms || 'N/A'}ms</div>
                                        <div><strong>处理速度比:</strong> \${analysis.processing_speed_ratio || 'N/A'}</div>
                                        <div><strong>R2优势:</strong> \${analysis.r2_vs_upload_advantage || 'N/A'}</div>
                                    </div>
                                </div>
                                
                                <!-- 文件信息 -->
                                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                                    <h5 style="margin: 0 0 8px 0; color: #1976d2;">📁 R2文件信息</h5>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                                        <div><strong>文件名:</strong> \${r2Info.filename || 'N/A'}</div>
                                        <div><strong>文件大小:</strong> \${r2Info.size_mb || 'N/A'}MB</div>
                                        <div><strong>内容类型:</strong> \${r2Info.content_type || 'N/A'}</div>
                                        <div><strong>性能评级:</strong> \${rating.r2_download_grade || 'N/A'}</div>
                                    </div>
                                </div>
                                
                                <!-- 时间分析 -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11px; color: #666;">
                                    <div>总时间: \${pm.total_duration_ms || 'N/A'}ms</div>
                                    <div>网络延迟: \${pm.estimated_network_latency_ms || 'N/A'}ms</div>
                                    <div>Worker处理: \${core.pure_worker_processing_ms || 'N/A'}ms</div>
                                </div>
                            </div>
                        \`;
                    }
                    
                    showResult(\`
                        <h3>☁️ R2文件处理成功</h3>
                        \${performanceHtml}
                        <div style="margin-top: 15px;">
                            <button onclick="downloadR2Result()" style="background: #4caf50; margin-right: 10px;">📥 下载结果</button>
                            <button onclick="copyR2Result()" style="background: #2196f3;">📋 复制结果</button>
                        </div>
                        <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
                            <pre style="margin: 0; white-space: pre-wrap; font-size: 12px;">\${JSON.stringify(data, null, 2)}</pre>
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; color: #666;">
                            处理类型：\${processType === 'transcriptions' ? '转录' : '翻译'} | 来源：R2存储 | 链接：\${url}
                        </p>
                    \`, 'success');
                    
                    // 存储R2结果数据用于下载
                    window.lastR2Result = data;
                } else {
                    showResult('❌ R2文件处理失败：' + (data.error?.message || data.error || '未知错误'), 'error');
                }
            } catch (error) {
                showResult('❌ 请求失败：' + error.message, 'error');
            } finally {
                r2ProcessBtn.disabled = false;
            }
        });
        
        // =================== 新功能: API测试 ===================
        
        const apiEndpoint = document.getElementById('apiEndpoint');
        const apiKey = document.getElementById('apiKey');
        const apiFile = document.getElementById('apiFile');
        const apiR2Url = document.getElementById('apiR2Url');
        const apiTestBtn = document.getElementById('apiTestBtn');
        const apiCopyBtn = document.getElementById('apiCopyBtn');
        const apiExportBtn = document.getElementById('apiExportBtn');
        
        // 监听端点选择变化，显示/隐藏相关输入
        apiEndpoint.addEventListener('change', () => {
            const selectedEndpoint = apiEndpoint.value;
            const fileInputGroup = document.getElementById('fileInputGroup');
            const r2UrlGroup = document.getElementById('r2UrlGroup');
            
            if (selectedEndpoint.includes('/r2/')) {
                fileInputGroup.style.display = 'none';
                r2UrlGroup.style.display = 'block';
            } else {
                fileInputGroup.style.display = 'block';
                r2UrlGroup.style.display = 'none';
            }
        });
        
        apiTestBtn.addEventListener('click', async () => {
            const endpoint = apiEndpoint.value;
            const key = apiKey.value.trim();
            
            if (endpoint.includes('/r2/')) {
                // R2 API测试
                const url = apiR2Url.value.trim();
                if (!url) {
                    showResult('请输入R2链接', 'error');
                    return;
                }
                
                await testR2API(endpoint, url, key);
            } else {
                // 文件上传API测试
                const file = apiFile.files[0];
                if (!file) {
                    showResult('请选择音频文件', 'error');
                    return;
                }
                
                await testFileAPI(endpoint, file, key);
            }
        });
        
        async function testR2API(endpoint, url, apiKey) {
            showResult('正在执行R2 API测试...', 'loading');
            apiTestBtn.disabled = true;
            
            try {
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (apiKey) {
                    headers['Authorization'] = \`Bearer \${apiKey}\`;
                }
                
                const response = await fetch(\`\${WORKER_URL}\${endpoint}\`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ url: url })
                });
                
                const data = await response.json();
                displayAPITestResult(response, data, 'R2 API测试');
                
            } catch (error) {
                showResult('❌ API测试失败：' + error.message, 'error');
            } finally {
                apiTestBtn.disabled = false;
            }
        }
        
        async function testFileAPI(endpoint, file, apiKey) {
            showResult('正在执行文件API测试...', 'loading');
            apiTestBtn.disabled = true;
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const headers = {};
                if (apiKey) {
                    headers['Authorization'] = \`Bearer \${apiKey}\`;
                }
                
                const response = await fetch(\`\${WORKER_URL}\${endpoint}\`, {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });
                
                const data = await response.json();
                displayAPITestResult(response, data, '文件API测试');
                
            } catch (error) {
                showResult('❌ API测试失败：' + error.message, 'error');
            } finally {
                apiTestBtn.disabled = false;
            }
        }
        
        function displayAPITestResult(response, data, testType) {
            const statusColor = response.ok ? '#28a745' : '#dc3545';
            const statusIcon = response.ok ? '✅' : '❌';
            
            showResult(\`
                <h3>\${statusIcon} \${testType}结果</h3>
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid \${statusColor};">
                    <h4 style="margin: 0 0 10px 0;">📊 响应信息</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 12px;">
                        <div><strong>状态码:</strong> \${response.status}</div>
                        <div><strong>状态文本:</strong> \${response.statusText}</div>
                        <div><strong>内容类型:</strong> \${response.headers.get('Content-Type') || 'N/A'}</div>
                        <div><strong>请求ID:</strong> \${response.headers.get('X-Request-ID') || 'N/A'}</div>
                        <div><strong>剩余请求:</strong> \${response.headers.get('X-RateLimit-Remaining') || 'N/A'}</div>
                        <div><strong>来源类型:</strong> \${response.headers.get('X-Source-Type') || 'N/A'}</div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <button onclick="downloadAPIResult()" style="background: #007cba; margin-right: 10px;">📥 下载响应</button>
                    <button onclick="copyAPIResult()" style="background: #6c757d;">📋 复制响应</button>
                </div>
                <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
                    <pre style="margin: 0; white-space: pre-wrap; font-size: 11px;">\${JSON.stringify(data, null, 2)}</pre>
                </div>
            \`, response.ok ? 'success' : 'error');
            
            // 存储API测试结果
            window.lastAPIResult = { response: response, data: data };
        }
        
        apiCopyBtn.addEventListener('click', () => {
            const endpoint = apiEndpoint.value;
            const key = apiKey.value.trim();
            const baseUrl = WORKER_URL;
            
            let curlCommand;
            
            if (endpoint.includes('/r2/')) {
                const url = apiR2Url.value.trim();
                curlCommand = \`curl -X POST "\${baseUrl}\${endpoint}" \\\\\`;
                if (key) {
                    curlCommand += \`\\n  -H "Authorization: Bearer \${key}" \\\\\`;
                }
                curlCommand += \`\\n  -H "Content-Type: application/json" \\\\\`;
                curlCommand += \`\\n  -d '{"url": "\${url}"}'\`;
            } else {
                curlCommand = \`curl -X POST "\${baseUrl}\${endpoint}" \\\\\`;
                if (key) {
                    curlCommand += \`\\n  -H "Authorization: Bearer \${key}" \\\\\`;
                }
                curlCommand += \`\\n  -F "file=@/path/to/your/audio.mp3"\`;
            }
            
            navigator.clipboard.writeText(curlCommand).then(() => {
                alert('cURL命令已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });
        });
        
        apiExportBtn.addEventListener('click', () => {
            const endpoint = apiEndpoint.value;
            const key = apiKey.value.trim();
            const baseUrl = WORKER_URL;
            
            const postmanCollection = {
                "info": {
                    "name": "Whisper API Test",
                    "description": "Generated Postman collection for Whisper API testing",
                    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                },
                "item": [
                    {
                        "name": endpoint.includes('/r2/') ? "R2 Audio Processing" : "File Audio Processing",
                        "request": {
                            "method": "POST",
                            "header": [
                                ...(key ? [{"key": "Authorization", "value": \`Bearer \${key}\`, "type": "text"}] : []),
                                ...(endpoint.includes('/r2/') ? [{"key": "Content-Type", "value": "application/json", "type": "text"}] : [])
                            ],
                            "body": endpoint.includes('/r2/') ? {
                                "mode": "raw",
                                "raw": JSON.stringify({"url": apiR2Url.value.trim() || "https://example.r2.cloudflarestorage.com/audio.mp3"}),
                                "options": {
                                    "raw": {
                                        "language": "json"
                                    }
                                }
                            } : {
                                "mode": "formdata",
                                "formdata": [
                                    {
                                        "key": "file",
                                        "type": "file",
                                        "src": "/path/to/your/audio.mp3"
                                    }
                                ]
                            },
                            "url": {
                                "raw": \`\${baseUrl}\${endpoint}\`,
                                "protocol": "https",
                                "host": [baseUrl.replace(/https?:\\/\\//, '').split('/')[0]],
                                "path": endpoint.split('/').filter(p => p)
                            }
                        }
                    }
                ]
            };
            
            const jsonStr = JSON.stringify(postmanCollection, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`whisper-api-\${endpoint.replace(/\\//g, '-')}.postman_collection.json\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        // =================== 辅助下载和复制功能 ===================
        
        function downloadR2Result() {
            if (window.lastR2Result) {
                const jsonStr = JSON.stringify(window.lastR2Result, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`r2_result_\${window.lastR2Result.performance_metrics?.r2_file_info?.filename || 'audio'}_\${new Date().getTime()}.json\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }
        
        function copyR2Result() {
            if (window.lastR2Result) {
                const jsonStr = JSON.stringify(window.lastR2Result, null, 2);
                navigator.clipboard.writeText(jsonStr).then(() => {
                    alert('R2处理结果已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
            }
        }
        
        function downloadAPIResult() {
            if (window.lastAPIResult) {
                const jsonStr = JSON.stringify(window.lastAPIResult.data, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`api_test_result_\${new Date().getTime()}.json\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }
        
        function copyAPIResult() {
            if (window.lastAPIResult) {
                const jsonStr = JSON.stringify(window.lastAPIResult.data, null, 2);
                navigator.clipboard.writeText(jsonStr).then(() => {
                    alert('API测试结果已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
            }
        }
    </script>
</body>
</html>`;

// 安全配置
const SECURITY_CONFIG = {
  API_KEYS: ['wh-sk-1234567890abcdef', 'wh-sk-demo-key-for-testing'],
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
  RATE_LIMIT_PER_MINUTE: 10,
  ALLOWED_IPS: [], // 空数组允许所有IP
  BLOCKED_IPS: [], // 黑名单IP列表
  REQUIRE_API_KEY: false, // 是否强制要求API Key
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac', 'audio/ogg', 'audio/webm']
};

// 频率限制存储 (生产环境应使用 KV 存储)
let rateLimitStore = new Map();

/**
 * 清理过期的频率限制记录
 */
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > 60000) { // 60秒窗口
      rateLimitStore.delete(key);
    }
  }
}

/**
 * 检查频率限制
 */
function checkRateLimit(clientIP) {
  cleanupRateLimit();
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;
  const existing = rateLimitStore.get(key);
  
  if (!existing) {
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now
    });
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_PER_MINUTE - 1 };
  }
  
  // 检查是否在同一分钟窗口内
  if (now - existing.windowStart < 60000) {
    if (existing.count >= SECURITY_CONFIG.RATE_LIMIT_PER_MINUTE) {
      return { allowed: false, remaining: 0, resetTime: existing.windowStart + 60000 };
    }
    existing.count++;
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_PER_MINUTE - existing.count };
  } else {
    // 新的时间窗口
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now
    });
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_PER_MINUTE - 1 };
  }
}

/**
 * 验证API Key
 */
function validateApiKey(request) {
  if (!SECURITY_CONFIG.REQUIRE_API_KEY) {
    return { valid: true };
  }
  
  const authHeader = request.headers.get('Authorization');
  const apiKeyHeader = request.headers.get('X-API-Key');
  
  let apiKey = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader;
  }
  
  if (!apiKey) {
    return { valid: false, error: 'API key required' };
  }
  
  if (!SECURITY_CONFIG.API_KEYS.includes(apiKey)) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  return { valid: true };
}

/**
 * 检查IP访问权限
 */
function checkIPAccess(clientIP) {
  // 检查黑名单
  if (SECURITY_CONFIG.BLOCKED_IPS.includes(clientIP)) {
    return { allowed: false, reason: 'IP blocked' };
  }
  
  // 检查白名单（如果配置了白名单）
  if (SECURITY_CONFIG.ALLOWED_IPS.length > 0 && !SECURITY_CONFIG.ALLOWED_IPS.includes(clientIP)) {
    return { allowed: false, reason: 'IP not in whitelist' };
  }
  
  return { allowed: true };
}

/**
 * 执行安全检查
 */
function performSecurityChecks(request) {
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   'unknown';
  
  // IP访问检查
  const ipCheck = checkIPAccess(clientIP);
  if (!ipCheck.allowed) {
    return {
      allowed: false,
      status: 403,
      error: `Access denied: ${ipCheck.reason}`,
      clientIP
    };
  }
  
  // API Key验证
  const apiKeyCheck = validateApiKey(request);
  if (!apiKeyCheck.valid) {
    return {
      allowed: false,
      status: 401,
      error: apiKeyCheck.error,
      clientIP
    };
  }
  
  // 频率限制检查
  const rateLimitCheck = checkRateLimit(clientIP);
  if (!rateLimitCheck.allowed) {
    return {
      allowed: false,
      status: 429,
      error: 'Rate limit exceeded',
      resetTime: rateLimitCheck.resetTime,
      clientIP
    };
  }
  
  return {
    allowed: true,
    remaining: rateLimitCheck.remaining,
    clientIP
  };
}

/**
 * 验证音频文件
 */
function validateAudioFile(audioFile) {
  if (!audioFile) {
    return { valid: false, error: 'No audio file provided' };
  }
  
  if (audioFile.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }
  
  if (audioFile.type && !SECURITY_CONFIG.ALLOWED_AUDIO_TYPES.includes(audioFile.type)) {
    return { 
      valid: false, 
      error: `Unsupported audio type: ${audioFile.type}. Supported types: ${SECURITY_CONFIG.ALLOWED_AUDIO_TYPES.join(', ')}` 
    };
  }
  
  return { valid: true };
}

/**
 * 记录请求日志
 */
function logRequest(request, securityResult, processingTime, success, error = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    clientIP: securityResult.clientIP,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('User-Agent'),
    success,
    processingTime,
    remainingRequests: securityResult.remaining,
    error: error
  };
  
  console.log('WHISPER_REQUEST_LOG:', JSON.stringify(logEntry));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestStartTime = Date.now();
    
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // 根路径显示测试页面
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(HTML_PAGE, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }
    
    // API 信息端点
    if (request.method === 'GET' && url.pathname === '/api/info') {
      return new Response(JSON.stringify({
        service: 'Whisper Speech-to-Text API',
        version: '1.0.0',
        model: '@cf/openai/whisper-large-v3-turbo',
        endpoints: {
          '/api/v1/audio/transcriptions': 'POST - Audio transcription (OpenAI compatible)',
          '/api/v1/audio/translations': 'POST - Audio translation to English',
          '/api/v1/audio/r2/transcriptions': 'POST - R2 audio transcription from storage URL',
          '/api/v1/audio/r2/translations': 'POST - R2 audio translation from storage URL',
          '/api/performance/test': 'POST - Performance test (no transcription, timing only)',
          '/': 'GET - Web interface for testing',
          '/upload': 'POST - Original upload endpoint for web interface'
        },
        supported_formats: SECURITY_CONFIG.ALLOWED_AUDIO_TYPES,
        max_file_size: `${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
        rate_limit: `${SECURITY_CONFIG.RATE_LIMIT_PER_MINUTE} requests per minute`,
        performance_features: {
          network_latency_separation: 'High-precision timing excludes network overhead',
          microsecond_precision: 'Performance.now() based microsecond timing',
          detailed_breakdown: 'File read, base64 encoding, AI processing, response generation',
          real_time_analysis: 'Processing speed vs audio duration comparison',
          efficiency_metrics: 'Network overhead, processing efficiency, throughput analysis'
        }
      }, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 🔬 专用性能测试端点 - 测试Worker处理性能，不进行实际转录
    if (request.method === 'POST' && url.pathname === '/api/performance/test') {
      return handlePerformanceTest(request, env, requestStartTime);
    }
    
    // 新的API端点 - 使用安全检查
    if (url.pathname.startsWith('/api/v1/audio/r2/')) {
      return handleR2AudioAPI(request, env, requestStartTime);
    }
    if (url.pathname.startsWith('/api/v1/audio/')) {
      return handleSecureAudioAPI(request, env, requestStartTime);
    }
    
    // 原有的Web测试功能 - 保持简单，无安全检查
    if (request.method === 'POST' && (url.pathname === '/' || url.pathname === '/upload')) {
      return handleOriginalUpload(request, env, requestStartTime);
    }
    
    // 404 处理
    return new Response(JSON.stringify({
      error: 'Not found',
      message: 'Available endpoints: /, /api/info, /api/v1/audio/transcriptions, /api/v1/audio/translations, /upload'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

/**
 * 处理R2链接音频API请求
 */
async function handleR2AudioAPI(request, env, requestStartTime) {
  const url = new URL(request.url);
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed',
      message: 'Only POST method is supported'
    }), { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 执行安全检查
  const securityResult = performSecurityChecks(request);
  if (!securityResult.allowed) {
    const errorResponse = {
      error: {
        message: securityResult.error,
        type: 'security_error',
        code: securityResult.status === 429 ? 'rate_limit_exceeded' : 'access_denied'
      }
    };
    
    if (securityResult.resetTime) {
      errorResponse.error.reset_time = new Date(securityResult.resetTime).toISOString();
    }
    
    logRequest(request, securityResult, Date.now() - requestStartTime, false, securityResult.error);
    
    return new Response(JSON.stringify(errorResponse), {
      status: securityResult.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': securityResult.resetTime ? Math.ceil(securityResult.resetTime / 1000).toString() : ''
      }
    });
  }

  try {
    const requestStartISO = new Date().toISOString();
    
    // 获取请求数据
    const requestData = await request.json();
    const r2Url = requestData.url || requestData.r2_url;
    
    if (!r2Url) {
      return new Response(JSON.stringify({
        error: {
          message: 'No R2 URL provided',
          type: 'invalid_request_error',
          code: 'missing_r2_url'
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 验证R2 URL格式
    let parsedUrl;
    try {
      parsedUrl = new URL(r2Url);
    } catch (error) {
      return new Response(JSON.stringify({
        error: {
          message: 'Invalid R2 URL format',
          type: 'invalid_request_error',
          code: 'invalid_url_format'
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 安全检查：只允许特定的R2域名
    const allowedDomains = [
      '.r2.cloudflarestorage.com',
      '.r2.dev',
      'r2.storage'
    ];
    
    const isAllowedDomain = allowedDomains.some(domain => 
      parsedUrl.hostname.endsWith(domain) || parsedUrl.hostname.includes('r2')
    );
    
    if (!isAllowedDomain) {
      return new Response(JSON.stringify({
        error: {
          message: 'R2 domain not allowed',
          type: 'security_error',
          code: 'domain_not_allowed',
          allowed_domains: allowedDomains
        }
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 详细时间测量 - R2下载阶段
    const r2DownloadStartTime = performance.now();
    
    // 从R2下载音频文件
    const r2Response = await fetch(r2Url, {
      headers: {
        'User-Agent': 'Cloudflare-Worker-Whisper/1.0'
      }
    });
    
    if (!r2Response.ok) {
      return new Response(JSON.stringify({
        error: {
          message: `Failed to fetch R2 file: ${r2Response.status} ${r2Response.statusText}`,
          type: 'r2_fetch_error',
          code: 'r2_download_failed'
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const audioArrayBuffer = await r2Response.arrayBuffer();
    const r2DownloadEndTime = performance.now();
    
    // 获取文件信息
    const contentType = r2Response.headers.get('Content-Type') || 'audio/unknown';
    const contentLength = parseInt(r2Response.headers.get('Content-Length') || '0');
    const fileName = parsedUrl.pathname.split('/').pop() || 'unknown.audio';

    // 验证文件大小
    if (contentLength > SECURITY_CONFIG.MAX_FILE_SIZE) {
      return new Response(JSON.stringify({
        error: {
          message: `File too large. Maximum size: ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
          type: 'file_too_large',
          code: 'file_size_exceeded'
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 详细时间测量 - 预处理阶段
    const preprocessStartTime = performance.now();
    const base64EncodeStartTime = performance.now();
    
    const uint8Array = new Uint8Array(audioArrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize));
    }
    const audioBase64 = btoa(binary);
    const base64EncodeEndTime = performance.now();
    const preprocessEndTime = performance.now();
    
    // AI模型调用 - 核心处理时间
    const aiStartTime = performance.now();
    const aiResponse = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: audioBase64
    });
    const aiEndTime = performance.now();
    
    // 响应处理时间
    const responseProcessStartTime = performance.now();
    const requestEndTime = Date.now();
    const requestEndISO = new Date().toISOString();

    // 根据端点类型处理响应
    let responseData;
    if (url.pathname.includes('/transcriptions')) {
      responseData = {
        text: aiResponse.text || '',
        segments: aiResponse.segments || [],
        language: aiResponse.language || 'unknown',
        duration: aiResponse.segments ? Math.max(...aiResponse.segments.map(s => s.end || 0)) : null,
        words: aiResponse.words || null
      };
    } else if (url.pathname.includes('/translations')) {
      responseData = {
        text: aiResponse.text || '',
        language: 'en'
      };
    } else {
      responseData = aiResponse;
    }

    const responseProcessEndTime = performance.now();
    
    // 📊 详细性能指标 - 包含R2下载性能
    const audioDurationSeconds = aiResponse.segments ? 
      Math.max(...aiResponse.segments.map(s => s.end || 0)) : 0;
    
    // 计算核心处理时间 (包含R2下载)
    const totalCoreProcessingMs = (r2DownloadEndTime - r2DownloadStartTime) + 
                                  (preprocessEndTime - preprocessStartTime) + 
                                  (aiEndTime - aiStartTime) + 
                                  (responseProcessEndTime - responseProcessStartTime);
    
    // 估算网络传输时间
    const estimatedNetworkLatencyMs = Math.round(requestEndTime - requestStartTime) - totalCoreProcessingMs;
    
    const performanceMetrics = {
      // ⏰ 时间戳
      request_start_time: requestStartISO,
      request_end_time: requestEndISO,
      
      // 🌍 总体时间 (包含网络传输)
      total_duration_ms: Math.round(requestEndTime - requestStartTime),
      estimated_network_latency_ms: Math.max(0, estimatedNetworkLatencyMs),
      
      // 🎯 核心处理时间 (包含R2下载)
      core_processing_times: {
        // R2下载时间 - R2专用指标
        r2_download_duration_ms: Math.round(r2DownloadEndTime - r2DownloadStartTime),
        r2_download_speed_mbps: contentLength > 0 ? 
          ((contentLength / 1024 / 1024) / ((r2DownloadEndTime - r2DownloadStartTime) / 1000)).toFixed(2) : 'unknown',
        
        // AI模型调用时间
        ai_model_duration_ms: Math.round(aiEndTime - aiStartTime),
        
        // 文件处理分解 (不包括R2下载时的文件读取)
        base64_encode_duration_ms: Math.round(base64EncodeEndTime - base64EncodeStartTime),
        total_preprocessing_ms: Math.round(preprocessEndTime - preprocessStartTime),
        
        // 响应处理时间
        response_processing_ms: Math.round(responseProcessEndTime - responseProcessStartTime),
        
        // 🚀 纯Worker内部处理时间 (包含R2下载)
        pure_worker_processing_ms: Math.round(totalCoreProcessingMs),
        
        // 详细处理阶段时间 (微秒级精度)
        high_precision_times: {
          r2_download_microseconds: Math.round((r2DownloadEndTime - r2DownloadStartTime) * 1000),
          ai_model_microseconds: Math.round((aiEndTime - aiStartTime) * 1000),
          base64_encode_microseconds: Math.round((base64EncodeEndTime - base64EncodeStartTime) * 1000),
          preprocessing_microseconds: Math.round((preprocessEndTime - preprocessStartTime) * 1000),
          response_processing_microseconds: Math.round((responseProcessEndTime - responseProcessStartTime) * 1000)
        }
      },
      
      // 📈 性能分析 - R2专用
      performance_analysis: {
        // R2下载效率
        r2_download_efficiency: contentLength > 0 ? 
          ((contentLength / 1024 / 1024) / ((r2DownloadEndTime - r2DownloadStartTime) / 1000) > 10 ? 'Excellent' : 'Good') : 'Unknown',
        
        // 处理速度比例
        processing_speed_ratio: audioDurationSeconds > 0 ? 
          ((aiEndTime - aiStartTime) / 1000 / audioDurationSeconds).toFixed(3) + 'x' : 'unknown',
        
        // 实时处理因子
        realtime_factor: audioDurationSeconds > 0 ? 
          ((aiEndTime - aiStartTime) / 1000 / audioDurationSeconds).toFixed(3) : 'unknown',
        
        // R2 vs 直接上传优势
        r2_vs_upload_advantage: 'Reduced client upload time, better for large files',
        
        // 处理效率
        processing_efficiency: Math.round(((aiEndTime - aiStartTime) / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        
        // 网络开销占比
        network_overhead_percentage: Math.round((estimatedNetworkLatencyMs / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        
        // 各阶段时间占比
        r2_time_breakdown_percentage: {
          r2_download: Math.round(((r2DownloadEndTime - r2DownloadStartTime) / totalCoreProcessingMs) * 100),
          ai_processing: Math.round(((aiEndTime - aiStartTime) / totalCoreProcessingMs) * 100),
          file_preprocessing: Math.round(((preprocessEndTime - preprocessStartTime) / totalCoreProcessingMs) * 100),
          response_processing: Math.round(((responseProcessEndTime - responseProcessStartTime) / totalCoreProcessingMs) * 100)
        }
      },
      
      // 📁 R2文件信息
      r2_file_info: {
        url: r2Url,
        filename: fileName,
        content_type: contentType,
        size_bytes: contentLength,
        size_mb: (contentLength / 1024 / 1024).toFixed(3),
        size_kb: (contentLength / 1024).toFixed(1),
        r2_headers: {
          'content-length': r2Response.headers.get('Content-Length'),
          'content-type': r2Response.headers.get('Content-Type'),
          'last-modified': r2Response.headers.get('Last-Modified'),
          'etag': r2Response.headers.get('ETag')
        }
      },
      
      // 🎵 音频信息
      audio_info: {
        duration_seconds: audioDurationSeconds ? audioDurationSeconds.toFixed(3) : 'unknown',
        duration_formatted: audioDurationSeconds ? 
          `${Math.floor(audioDurationSeconds / 60)}:${String(Math.floor(audioDurationSeconds % 60)).padStart(2, '0')}.${String(Math.floor((audioDurationSeconds % 1) * 1000)).padStart(3, '0')}` : 'unknown',
        segments_count: aiResponse.segments ? aiResponse.segments.length : 0,
        detected_language: aiResponse.language || 'unknown',
        words_count: aiResponse.words ? aiResponse.words.length : 0
      },
      
      // 🎯 R2专用性能评级
      r2_performance_rating: {
        r2_download_grade: (() => {
          if (contentLength <= 0) return 'N/A';
          const speed = (contentLength / 1024 / 1024) / ((r2DownloadEndTime - r2DownloadStartTime) / 1000);
          if (speed > 100) return 'S+ (Excellent)';
          if (speed > 50) return 'S (Very Fast)';
          if (speed > 20) return 'A (Fast)';
          if (speed > 10) return 'B (Good)';
          if (speed > 5) return 'C (Acceptable)';
          return 'D (Slow)';
        })(),
        overall_grade: (() => {
          if (audioDurationSeconds <= 0) return 'N/A';
          const factor = (aiEndTime - aiStartTime) / 1000 / audioDurationSeconds;
          if (factor < 0.1) return 'S+ (Excellent)';
          if (factor < 0.3) return 'S (Very Fast)';
          if (factor < 0.5) return 'A (Fast)';
          if (factor < 1.0) return 'B (Good)';
          if (factor < 2.0) return 'C (Acceptable)';
          return 'D (Slow)';
        })(),
        r2_optimization_benefit: contentLength > 10 * 1024 * 1024 ? 'High - Large file benefits from R2 storage' : 'Medium - Good for workflow optimization'
      }
    };

    // 最终响应数据
    const finalResponse = {
      ...responseData,
      source_type: 'r2_storage',
      performance_metrics: performanceMetrics
    };

    // 记录成功日志
    logRequest(request, securityResult, requestEndTime - requestStartTime, true);

    return new Response(JSON.stringify(finalResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'X-RateLimit-Remaining': securityResult.remaining?.toString() || '0',
        'X-Request-ID': `whisper_r2_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        'X-Source-Type': 'r2_storage'
      }
    });

  } catch (error) {
    const errorMessage = error.message || 'Internal server error';
    logRequest(request, securityResult, Date.now() - requestStartTime, false, errorMessage);
    
    return new Response(JSON.stringify({
      error: {
        message: errorMessage,
        type: 'server_error',
        code: 'r2_processing_failed'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Remaining': securityResult.remaining?.toString() || '0'
      }
    });
  }
}

/**
 * 处理原有的Web上传功能 - 保持原有逻辑，无安全检查
 */
async function handleOriginalUpload(request, env, requestStartTime) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const requestStartISO = new Date().toISOString();
    
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No audio file provided'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const preprocessStartTime = Date.now();
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(audioArrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize));
    }
    const audioBase64 = btoa(binary);
    const preprocessEndTime = Date.now();
    
    const aiStartTime = Date.now();
    const response = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: audioBase64
    });
    const aiEndTime = Date.now();
    
    const requestEndTime = Date.now();
    const requestEndISO = new Date().toISOString();

    // 添加性能统计信息
    const performanceData = {
      ...response,
      performance_metrics: {
        request_start_time: requestStartISO,
        request_end_time: requestEndISO,
        total_duration_ms: requestEndTime - requestStartTime,
        preprocessing_duration_ms: preprocessEndTime - preprocessStartTime,
        ai_processing_duration_ms: aiEndTime - aiStartTime,
        file_info: {
          name: audioFile.name,
          size_bytes: audioFile.size,
          size_mb: (audioFile.size / 1024 / 1024).toFixed(2),
          type: audioFile.type
        },
        audio_duration_estimate: response.segments ? 
          Math.max(...response.segments.map(s => s.end || 0)).toFixed(2) + 's' : 'unknown',
        processing_speed_ratio: response.segments ? 
          ((aiEndTime - aiStartTime) / 1000 / Math.max(...response.segments.map(s => s.end || 1))).toFixed(2) + 'x' : 'unknown'
      }
    };

    return new Response(JSON.stringify(performanceData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * 🔬 专用性能测试处理器 - 仅测试Worker处理性能，不进行AI转录
 */
async function handlePerformanceTest(request, env, requestStartTime) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed',
      message: 'Only POST method is supported'
    }), { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const requestStartISO = new Date().toISOString();
    
    // 获取表单数据 - 仅进行性能测试，不调用AI
    const formData = await request.formData();
    const audioFile = formData.get('file') || formData.get('audio');
    
    if (!audioFile) {
      return new Response(JSON.stringify({
        error: 'No audio file provided for performance test'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 📊 详细时间测量 - 文件处理性能
    const preprocessStartTime = performance.now();
    const fileReadStartTime = performance.now();
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const fileReadEndTime = performance.now();
    
    const base64EncodeStartTime = performance.now();
    const uint8Array = new Uint8Array(audioArrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize));
    }
    const audioBase64 = btoa(binary);
    const base64EncodeEndTime = performance.now();
    const preprocessEndTime = performance.now();
    
    // 模拟AI处理时间测量 (不实际调用AI)
    const mockAiStartTime = performance.now();
    // 添加小延迟来模拟最小处理时间
    await new Promise(resolve => setTimeout(resolve, 1));
    const mockAiEndTime = performance.now();
    
    // 响应处理时间
    const responseProcessStartTime = performance.now();
    const requestEndTime = Date.now();
    const requestEndISO = new Date().toISOString();
    
    // 计算核心处理时间 (排除网络)
    const totalCoreProcessingMs = (preprocessEndTime - preprocessStartTime) + 
                                  (mockAiEndTime - mockAiStartTime) + 
                                  (performance.now() - responseProcessStartTime);
    
    // 估算网络传输时间
    const estimatedNetworkLatencyMs = Math.round(requestEndTime - requestStartTime) - totalCoreProcessingMs;
    
    const responseProcessEndTime = performance.now();
    
    // 🎯 专用性能测试结果
    const performanceTestResults = {
      test_type: 'Performance Test Only (No AI Transcription)',
      timestamp: requestStartISO,
      
      // 🌍 总体时间
      total_request_duration_ms: Math.round(requestEndTime - requestStartTime),
      estimated_network_latency_ms: Math.max(0, estimatedNetworkLatencyMs),
      
      // 🚀 Worker内部处理性能 (核心指标)
      worker_processing_performance: {
        // 文件处理性能
        file_read_duration_ms: Math.round(fileReadEndTime - fileReadStartTime),
        file_read_speed_mbps: ((audioFile.size / 1024 / 1024) / ((fileReadEndTime - fileReadStartTime) / 1000)).toFixed(2),
        
        // Base64编码性能
        base64_encode_duration_ms: Math.round(base64EncodeEndTime - base64EncodeStartTime),
        base64_encode_speed_mbps: ((audioFile.size / 1024 / 1024) / ((base64EncodeEndTime - base64EncodeStartTime) / 1000)).toFixed(2),
        
        // 总预处理性能
        total_preprocessing_ms: Math.round(preprocessEndTime - preprocessStartTime),
        preprocessing_throughput_mbps: ((audioFile.size / 1024 / 1024) / ((preprocessEndTime - preprocessStartTime) / 1000)).toFixed(2),
        
        // 响应生成性能
        response_generation_ms: Math.round(responseProcessEndTime - responseProcessStartTime),
        
        // 纯Worker处理时间 (排除网络和AI)
        pure_worker_overhead_ms: Math.round(totalCoreProcessingMs - (mockAiEndTime - mockAiStartTime))
      },
      
      // 📈 详细性能分析
      performance_analysis: {
        // 网络效率
        network_efficiency_percentage: Math.round((totalCoreProcessingMs / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        network_overhead_percentage: Math.round((estimatedNetworkLatencyMs / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        
        // 处理效率等级
        file_processing_grade: (() => {
          const speed = (audioFile.size / 1024 / 1024) / ((preprocessEndTime - preprocessStartTime) / 1000);
          if (speed > 100) return 'S+ (Excellent)';
          if (speed > 50) return 'S (Very Fast)';
          if (speed > 20) return 'A (Fast)';
          if (speed > 10) return 'B (Good)';
          if (speed > 5) return 'C (Acceptable)';
          return 'D (Slow)';
        })(),
        
        // 微秒级精度时间
        high_precision_timings: {
          file_read_microseconds: Math.round((fileReadEndTime - fileReadStartTime) * 1000),
          base64_encode_microseconds: Math.round((base64EncodeEndTime - base64EncodeStartTime) * 1000),
          preprocessing_microseconds: Math.round((preprocessEndTime - preprocessStartTime) * 1000),
          response_generation_microseconds: Math.round((responseProcessEndTime - responseProcessStartTime) * 1000)
        },
        
        // 处理阶段占比
        processing_breakdown_percentage: {
          file_reading: Math.round(((fileReadEndTime - fileReadStartTime) / (preprocessEndTime - preprocessStartTime)) * 100),
          base64_encoding: Math.round(((base64EncodeEndTime - base64EncodeStartTime) / (preprocessEndTime - preprocessStartTime)) * 100),
          other_preprocessing: Math.round((100 - 
            (((fileReadEndTime - fileReadStartTime) + (base64EncodeEndTime - base64EncodeStartTime)) / (preprocessEndTime - preprocessStartTime)) * 100))
        }
      },
      
      // 📁 文件信息
      file_info: {
        name: audioFile.name || 'unknown',
        size_bytes: audioFile.size,
        size_mb: (audioFile.size / 1024 / 1024).toFixed(3),
        size_kb: (audioFile.size / 1024).toFixed(1),
        type: audioFile.type || 'unknown'
      },
      
      // 🎯 性能建议
      performance_recommendations: {
        network_latency: estimatedNetworkLatencyMs > 500 ? 
          'Consider optimizing network connection or using a closer server' : 'Network latency is acceptable',
        file_size: audioFile.size > 10 * 1024 * 1024 ? 
          'Large file detected. Consider compression for better performance' : 'File size is optimal',
        processing_efficiency: ((audioFile.size / 1024 / 1024) / ((preprocessEndTime - preprocessStartTime) / 1000)) > 20 ? 
          'Worker processing performance is excellent' : 'Worker processing could be optimized'
      },
      
      // 🏆 综合评级
      overall_performance_rating: {
        worker_efficiency: 'High',
        network_impact: estimatedNetworkLatencyMs < 200 ? 'Low' : estimatedNetworkLatencyMs < 500 ? 'Medium' : 'High',
        recommended_for_production: estimatedNetworkLatencyMs < 1000 && 
          ((audioFile.size / 1024 / 1024) / ((preprocessEndTime - preprocessStartTime) / 1000)) > 10 ? 'Yes' : 'Consider optimization'
      }
    };

    return new Response(JSON.stringify(performanceTestResults, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Performance-Test': 'true',
        'X-Request-ID': `perf_test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Performance test failed',
      message: error.message,
      test_type: 'Performance Test Only'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * 处理安全的API请求 - 新增功能，包含完整安全检查
 */
async function handleSecureAudioAPI(request, env, requestStartTime) {
  const url = new URL(request.url);
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed',
      message: 'Only POST method is supported'
    }), { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 执行安全检查
  const securityResult = performSecurityChecks(request);
  if (!securityResult.allowed) {
    const errorResponse = {
      error: {
        message: securityResult.error,
        type: 'security_error',
        code: securityResult.status === 429 ? 'rate_limit_exceeded' : 'access_denied'
      }
    };
    
    if (securityResult.resetTime) {
      errorResponse.error.reset_time = new Date(securityResult.resetTime).toISOString();
    }
    
    logRequest(request, securityResult, Date.now() - requestStartTime, false, securityResult.error);
    
    return new Response(JSON.stringify(errorResponse), {
      status: securityResult.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': securityResult.resetTime ? Math.ceil(securityResult.resetTime / 1000).toString() : ''
      }
    });
  }

  try {
    const requestStartISO = new Date().toISOString();
    
    // 获取表单数据
    const formData = await request.formData();
    const audioFile = formData.get('file') || formData.get('audio'); // 兼容两种字段名
    
    // 验证音频文件
    const fileValidation = validateAudioFile(audioFile);
    if (!fileValidation.valid) {
      logRequest(request, securityResult, Date.now() - requestStartTime, false, fileValidation.error);
      return new Response(JSON.stringify({
        error: {
          message: fileValidation.error,
          type: 'invalid_request_error',
          code: 'file_validation_failed'
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-RateLimit-Remaining': securityResult.remaining?.toString() || '0'
        }
      });
    }

    // 详细时间测量 - 预处理阶段
    const preprocessStartTime = performance.now();
    const fileReadStartTime = performance.now();
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const fileReadEndTime = performance.now();
    
    const base64EncodeStartTime = performance.now();
    const uint8Array = new Uint8Array(audioArrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize));
    }
    const audioBase64 = btoa(binary);
    const base64EncodeEndTime = performance.now();
    const preprocessEndTime = performance.now();
    
    // AI模型调用 - 核心处理时间
    const aiStartTime = performance.now();
    const aiResponse = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: audioBase64
    });
    const aiEndTime = performance.now();
    
    // 响应处理时间
    const responseProcessStartTime = performance.now();
    const requestEndTime = Date.now();
    const requestEndISO = new Date().toISOString();

    // 根据端点类型处理响应
    let responseData;
    if (url.pathname.includes('/transcriptions') || url.pathname === '/') {
      // 转录端点 - 返回 OpenAI 兼容格式
      responseData = {
        text: aiResponse.text || '',
        segments: aiResponse.segments || [],
        language: aiResponse.language || 'unknown',
        duration: aiResponse.segments ? Math.max(...aiResponse.segments.map(s => s.end || 0)) : null,
        words: aiResponse.words || null
      };
    } else if (url.pathname.includes('/translations')) {
      // 翻译端点 - 只返回英文翻译
      responseData = {
        text: aiResponse.text || '',
        language: 'en'
      };
    } else {
      // 默认返回完整数据（兼容性）
      responseData = aiResponse;
    }

    const responseProcessEndTime = performance.now();
    
    // 📊 详细性能指标 - 高精度时间分析，排除网络延迟
    const audioDurationSeconds = aiResponse.segments ? 
      Math.max(...aiResponse.segments.map(s => s.end || 0)) : 0;
    
    // 计算核心处理时间 (仅Worker内部处理，不含网络传输)
    const totalCoreProcessingMs = (preprocessEndTime - preprocessStartTime) + 
                                  (aiEndTime - aiStartTime) + 
                                  (responseProcessEndTime - responseProcessStartTime);
    
    // 估算网络传输时间
    const estimatedNetworkLatencyMs = Math.round(requestEndTime - requestStartTime) - totalCoreProcessingMs;
    
    const performanceMetrics = {
      // ⏰ 时间戳
      request_start_time: requestStartISO,
      request_end_time: requestEndISO,
      
      // 🌍 总体时间 (包含网络传输)
      total_duration_ms: Math.round(requestEndTime - requestStartTime),
      estimated_network_latency_ms: Math.max(0, estimatedNetworkLatencyMs),
      
      // 🎯 核心处理时间 (排除网络延迟) - 主要性能指标
      core_processing_times: {
        // AI模型调用时间 - 最关键的性能指标
        ai_model_duration_ms: Math.round(aiEndTime - aiStartTime),
        
        // 文件处理分解
        file_read_duration_ms: Math.round(fileReadEndTime - fileReadStartTime),
        base64_encode_duration_ms: Math.round(base64EncodeEndTime - base64EncodeStartTime),
        total_preprocessing_ms: Math.round(preprocessEndTime - preprocessStartTime),
        
        // 响应处理时间
        response_processing_ms: Math.round(responseProcessEndTime - responseProcessStartTime),
        
        // 🚀 纯Worker内部处理时间 (完全排除网络影响)
        pure_worker_processing_ms: Math.round(totalCoreProcessingMs),
        
        // 详细处理阶段时间 (微秒级精度)
        high_precision_times: {
          ai_model_microseconds: Math.round((aiEndTime - aiStartTime) * 1000),
          file_read_microseconds: Math.round((fileReadEndTime - fileReadStartTime) * 1000),
          base64_encode_microseconds: Math.round((base64EncodeEndTime - base64EncodeStartTime) * 1000),
          preprocessing_microseconds: Math.round((preprocessEndTime - preprocessStartTime) * 1000),
          response_processing_microseconds: Math.round((responseProcessEndTime - responseProcessStartTime) * 1000)
        }
      },
      
      // 📈 性能分析
      performance_analysis: {
        // 处理速度比例 (AI处理时间 vs 音频时长)
        processing_speed_ratio: audioDurationSeconds > 0 ? 
          ((aiEndTime - aiStartTime) / 1000 / audioDurationSeconds).toFixed(3) + 'x' : 'unknown',
        
        // 实时处理因子 (小于1.0表示比实时快)
        realtime_factor: audioDurationSeconds > 0 ? 
          ((aiEndTime - aiStartTime) / 1000 / audioDurationSeconds).toFixed(3) : 'unknown',
        
        // 处理效率 (AI处理时间 vs 总时间)
        processing_efficiency: Math.round(((aiEndTime - aiStartTime) / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        
        // 网络开销占比
        network_overhead_percentage: Math.round((estimatedNetworkLatencyMs / Math.round(requestEndTime - requestStartTime)) * 100) + '%',
        
        // 各阶段时间占比 (基于核心处理时间)
        core_time_breakdown_percentage: {
          ai_processing: Math.round(((aiEndTime - aiStartTime) / totalCoreProcessingMs) * 100),
          file_preprocessing: Math.round(((preprocessEndTime - preprocessStartTime) / totalCoreProcessingMs) * 100),
          response_processing: Math.round(((responseProcessEndTime - responseProcessStartTime) / totalCoreProcessingMs) * 100)
        },
        
        // 音频处理效率指标
        audio_processing_metrics: {
          seconds_per_mb: audioDurationSeconds > 0 && audioFile.size > 0 ? 
            (audioDurationSeconds / (audioFile.size / 1024 / 1024)).toFixed(2) : 'unknown',
          processing_throughput_mbps: audioFile.size > 0 ? 
            ((audioFile.size / 1024 / 1024) / ((aiEndTime - aiStartTime) / 1000)).toFixed(2) : 'unknown',
          audio_compression_ratio: audioFile.size > 0 && audioDurationSeconds > 0 ? 
            (audioFile.size / (audioDurationSeconds * 1411200)).toFixed(3) : 'unknown' // 比较CD质量音频
        }
      },
      
      // 📁 文件信息
      file_info: {
        name: audioFile.name || 'unknown',
        size_bytes: audioFile.size,
        size_mb: (audioFile.size / 1024 / 1024).toFixed(3),
        size_kb: (audioFile.size / 1024).toFixed(1),
        type: audioFile.type || 'unknown',
        estimated_bitrate: audioDurationSeconds > 0 ? 
          Math.round((audioFile.size * 8) / audioDurationSeconds / 1000) + ' kbps' : 'unknown'
      },
      
      // 🎵 音频信息
      audio_info: {
        duration_seconds: audioDurationSeconds ? audioDurationSeconds.toFixed(3) : 'unknown',
        duration_formatted: audioDurationSeconds ? 
          `${Math.floor(audioDurationSeconds / 60)}:${String(Math.floor(audioDurationSeconds % 60)).padStart(2, '0')}.${String(Math.floor((audioDurationSeconds % 1) * 1000)).padStart(3, '0')}` : 'unknown',
        segments_count: aiResponse.segments ? aiResponse.segments.length : 0,
        detected_language: aiResponse.language || 'unknown',
        words_count: aiResponse.words ? aiResponse.words.length : 0,
        average_segment_duration: aiResponse.segments && aiResponse.segments.length > 0 ? 
          (audioDurationSeconds / aiResponse.segments.length).toFixed(2) + 's' : 'unknown'
      },
      
      // 🎯 专用性能评级
      performance_rating: {
        overall_grade: (() => {
          if (audioDurationSeconds <= 0) return 'N/A';
          const factor = (aiEndTime - aiStartTime) / 1000 / audioDurationSeconds;
          if (factor < 0.1) return 'S+ (Excellent)';
          if (factor < 0.3) return 'S (Very Fast)';
          if (factor < 0.5) return 'A (Fast)';
          if (factor < 1.0) return 'B (Good)';
          if (factor < 2.0) return 'C (Acceptable)';
          return 'D (Slow)';
        })(),
        network_efficiency: estimatedNetworkLatencyMs > 0 ? 
          (estimatedNetworkLatencyMs < 100 ? 'Excellent' : 
           estimatedNetworkLatencyMs < 300 ? 'Good' : 
           estimatedNetworkLatencyMs < 1000 ? 'Acceptable' : 'Poor') : 'N/A',
        processing_class: audioDurationSeconds > 0 ? 
          ((aiEndTime - aiStartTime) / 1000 < audioDurationSeconds ? 'Real-time capable' : 'Batch processing') : 'Unknown'
      }
    };

    // 最终响应数据
    const finalResponse = {
      ...responseData,
      performance_metrics: performanceMetrics
    };

    // 记录成功日志
    logRequest(request, securityResult, requestEndTime - requestStartTime, true);

    return new Response(JSON.stringify(finalResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'X-RateLimit-Remaining': securityResult.remaining?.toString() || '0',
        'X-Request-ID': `whisper_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      }
    });

  } catch (error) {
    const errorMessage = error.message || 'Internal server error';
    logRequest(request, securityResult, Date.now() - requestStartTime, false, errorMessage);
    
    return new Response(JSON.stringify({
      error: {
        message: errorMessage,
        type: 'server_error',
        code: 'processing_failed'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Remaining': securityResult.remaining?.toString() || '0'
      }
    });
  }
}