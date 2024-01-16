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
          "content": "class Log:\n        def __init__(self, path):\n            dirname = os.path.dirname(path)\n            os.makedirs(dirname, exist_ok=True)\n            f = open(path, \"a+\")\n    \n            # Check that the file is newline-terminated\n            size = os.path.getsize(path)\n            if size > 0:\n                f.seek(size - 1)\n                end = f.read(1)\n                if end != \"\\n\":\n                    f.write(\"\\n\")\n            self.f = f\n            self.path = path\n    \n        def log(self, event):\n            event[\"_event_id\"] = str(uuid.uuid4())\n            json.dump(event, self.f)\n            self.f.write(\"\\n\")\n    \n        def state(self):\n            state = {\"complete\": set(), \"last\": None}\n            for line in open(self.path):\n                event = json.loads(line)\n                if event[\"type\"] == \"submit\" and event[\"success\"]:\n                    state[\"complete\"].add(event[\"id\"])\n                    state[\"last\"] = event\n            return state"
        }
      ],
      //prompt: `${prompt}`,
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