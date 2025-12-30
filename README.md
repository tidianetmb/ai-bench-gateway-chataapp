A simple [Next.js](https://nextjs.org) chatbot app that uses [OpenRouter](https://openrouter.ai) to access multiple AI models including Gemini, OpenAI, DeepSeek, and Flux.

## Getting Started

### Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your-api-key-here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to try the chatbot

### Deployment to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com)
3. Add the following environment variable in your Vercel project settings:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
4. Deploy!

The app will automatically:
- Fetch available models from OpenRouter
- Filter to show only Gemini (Google), OpenAI, DeepSeek, and Flux models
- Group models by family with badges
- Support streaming responses

### Environment Variables

- `OPENROUTER_API_KEY` (required): Your OpenRouter API key from [openrouter.ai](https://openrouter.ai)

## Authors

This repository is maintained by the [Vercel](https://vercel.com) team and community contributors. 

Contributions are welcome! Feel free to open issues or submit pull requests to enhance functionality or fix bugs.
