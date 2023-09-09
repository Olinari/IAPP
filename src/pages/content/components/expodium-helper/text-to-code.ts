import axios from "axios";

export const transcribeAudio = async (audioBlob) => {
  const data = new FormData();

  data.append("file", audioBlob, "recorded_audio.webm");
  data.append("model", "whisper-1");
  data.append("language", "en");

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.openai.com/v1/audio/transcriptions",
    headers: {
      Authorization: `Bearer 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`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);

    if (typeof response.data === "object") {
      console.log(response.data.text);

      return response.data.text;
    } else {
      console.error("Received non-JSON response:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    return {};
  }
};

export const generateCode = async ({ transcription, html, actions }) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer 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`,
    },
    data: {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that generates code snippets for the voice-impaired to surf the internet. Take into account the provided HTML, the JSON of functions, and the user's voice transcription. respond with one word ONLY, the key of func you see fit to complete the users request.",
        },
        {
          role: "system",
          content:
            "the key-value pair object is " +
            actions +
            "choose the correct key",
        },
        {
          role: "user",
          content: "my request is" + transcription,
        },
      ],
    },
  };

  try {
    const response = await axios.request(config);

    if (typeof response.data === "object") {
      return response.data.choices[0].message.content;
    } else {
      console.error("Received non-JSON response:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    return {};
  }
};
