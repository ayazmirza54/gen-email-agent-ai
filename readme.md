# Gen-a-email : Email Writer & Responder Agent

## Overview

This is a Streamlit-based application that assists users in generating, responding to, and paraphrasing emails using Google's Gemini AI. The application provides three key functionalities:

1. **Email Generator** - Creates well-structured emails based on user input.
2. **Email Reply Agent** - Analyzes received emails, summarizes them, and generates a professional response.
3. **Paraphraser** - Rewrites text in different tones as per user preference.

## Features

- **Generate well-structured emails** with customized tone, recipient, key points, and attachments.
- **Analyze and summarize received emails** before generating a personalized reply.
- **Paraphrase text** with different tones such as formal, friendly, concise, and creative.
- **Download generated content** as markdown files for easy access.
- **User profile settings** for personalized responses.

## Installation

### Prerequisites

- Python 3.8+
- Streamlit
- Google Generative AI SDK

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/email-writer-responder.git
   cd email-writer-responder
   ```
2. Create a virtual environment (optional but recommended):
   ```sh
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Set up the API key:
   - Obtain a Gemini API key from Google Generative AI.
   - Set it as an environment variable:
     ```sh
     export GEMINI_API_KEY="your_api_key"  # macOS/Linux
     set GEMINI_API_KEY="your_api_key"  # Windows
     ```

## Usage

Run the application using:

```sh
streamlit run app.py
```

### Tabs:

- **Email Generator**: Fill in email details and click "Generate Email".
- **Email Reply Agent**: Paste a received email, generate a summary, and get a personalized reply.
- **Paraphraser**: Enter text, select a tone, and click "Paraphrase Text".

## Dependencies

- `streamlit`
- `google-generativeai`
- `os`
- `datetime`

## Contributing

Feel free to fork the repository and submit a pull request with improvements!

## License

This project is licensed under the MIT License.
