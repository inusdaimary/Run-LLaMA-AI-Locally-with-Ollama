const axios = require('axios');
const express = require('express');
const app = express()
const cors = require('cors');
const port = 3000;
app.use(express.json());
app.use(cors())


app.post('/ask', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama2',
            prompt: prompt,
            stream: false
        });

        res.status(200).json({ reply: response.data.response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
});
