import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import openai from 'openai';
import {OpenAIApi} from 'openai';

dotenv.config();
//const OPENAI_API_KEY_2 = "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";

const configuration = {
  apiKey: process.env.OpenAI_API_KEY,
};

const openaiInstance = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log('Received prompt:', prompt);

    // const response = await openaiInstance.createCompletion({
    //   model: "text-davinci-003",
    //   // messages: [
    //   //   {
    //   //     "role": "user",
    //   //     "content": "Make a single page website that shows off different neat javascript features for drop-downs and things to display information. The website should be an HTML file with embedded javascript and CSS."
    //   //   }
    //   // ],
    //   prompt: `${prompt}`,
    //   temperature: 0,
    //   max_tokens: 3000,
    //   top_p: 1,
    //   frequency_penalty: 0.5,
    //   presence_penalty: 0,
    // });

    const response = await openaiInstance.createCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        
        {
          "role": "user",
          "content": prompt,
        }
      ],

      temperature: 0,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log('OpenAI API Response:', response);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));