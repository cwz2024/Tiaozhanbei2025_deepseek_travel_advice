// server.js
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 代理请求到DeepSeek API
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: 'deepseek-chat',
                messages: req.body.messages,
                temperature: 0.7,
                max_tokens: 2048
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        );

        res.json({
            success: true,
            content: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('API请求失败:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || 'API请求失败'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});