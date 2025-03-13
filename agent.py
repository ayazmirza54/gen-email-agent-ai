import os
import streamlit as st
import google.generativeai as genai
from datetime import datetime


class GeminiInterface:
    def __init__(self, api_key, model_name="gemini-2.0-flash-exp"):
        # Configure API
        genai.configure(api_key=api_key)

        # Generation configuration
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        # Create the model with system instruction
        self.model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=self.generation_config,
        )

    def generate_email(self, prompt_data):
        """
        Generate email content based on the structured prompt.
        """
        prompt_template = """Compose an email with the following characteristics:

        *   **Purpose:** {purpose}
        *   **Recipient:** {recipient_info}
        *   **Sender:** {sender_name}
        *   **Tone:** {tone}
        *   **Subject:** {subject}
        *   **Key Points/Content:**
            {key_points}
        *   **Optional Considerations (when applicable):**
            *   **Context:** {context}
            *   **Actions Required:** {actions}
            *   **Attachments:** {attachments}
            *   **Desired Length:** {length}

        Write the email including this information, with an appropriate greeting and closing, considering the desired tone. 
        """

        final_prompt = prompt_template.format(**prompt_data)

        chat = self.model.start_chat(history=[]) #start new session
        try:
           response = chat.send_message(final_prompt)
           if response.candidates and response.candidates[0].finish_reason == "RECITATION":
               print("RECITATION STOPPED")
               return None  # Indicate failure, you may want to retry here.
           else:
               return response.text
        except genai.types.generation_types.StopCandidateException as e:
           print(f"Error: {e}")
           return None # Indicate failure
        
    def paraphrase_text(self, text, tone="neutral"):
        """
        Paraphrase the given text with a specified tone.
        """
        response = self.model.start_chat(history=[]).send_message(
            f"Paraphrase the following text with a '{tone}' tone and return it in Markdown format:\n\n{text}"
        )
        return response.text

    def summarize_email(self, email_content):
        """
        Summarize an email's content to extract key points.
        """
        prompt = f"""Summarize the following email content concisely, extracting:
        - The main purpose/request
        - Any key deadlines or time-sensitive information
        - Important details or context
        - Any specific questions that need answers
        
        Format the summary as bullet points.
        
        Email content:
        {email_content}
        """
        
        chat = self.model.start_chat(history=[])
        response = chat.send_message(prompt)
        return response.text
    
    def generate_reply(self, email_content, summary, user_tone="professional", user_name="", additional_context=""):
        """
        Generate a personalized reply to an email based on its content and summary.
        """
        prompt = f"""Generate a personalized reply to the following email.

        Original email:
        {email_content}
        
        Email summary:
        {summary}
        
        Reply characteristics:
        - Tone: {user_tone}
        - Sender name: {user_name}
        - Additional context or information to include: {additional_context}
        
        Create a thoughtful reply that addresses the key points from the original email.
        Include an appropriate greeting and signature.
        """
        
        chat = self.model.start_chat(history=[])
        response = chat.send_message(prompt)
        return response.text


def render_download_button(content, file_name, mime_type="text/plain"):
    """
    Render a download button for content.
    """
    st.download_button(
        label="📥 Download",
        data=content,
        file_name=file_name,
        mime=mime_type,
    )


def main():
    # Set page configuration
    st.set_page_config(
        page_title="Email Writer & Responder",
        page_icon="✉️",
        layout="wide",
    )

    # Title
    st.title("✉️ Email Writer & Responder 🛠️")
    st.markdown("Create, respond to, and paraphrase emails with the help of Gemini AI.")
    

    # Fetch API Key from environment variables
    api_key = os.environ.get("GEMINI_API_KEY", "")

    if not api_key:
        st.error("API key not found in environment variables! Set GEMINI_API_KEY.")
        return

    # Initialize Gemini Interface
    gemini_interface = GeminiInterface(api_key)

    # Tabs for Email Generator, Reply Agent, and Paraphraser
    tab1, tab2, tab3 = st.tabs(["📧 Email Generator", "↩️ Email Reply Agent", "🔄 Paraphraser"])

    with tab1:
        st.subheader("📧 Email Generator")
        st.markdown("Please provide the following details for your email:")
         # Input fields for the structured prompt
        purpose = st.text_input("Purpose", placeholder="e.g. Schedule a meeting", key="gen_purpose")
        recipient_info = st.text_input("Recipient", placeholder="e.g. John Doe, john@example.com", key="gen_recipient")
        sender_name = st.text_input("Sender name", placeholder="e.g. Jane Doe", key="gen_sender")
        tone = st.text_input("Tone", placeholder="e.g. professional and polite", key="gen_tone")
        subject = st.text_input("Subject", placeholder="e.g. Meeting Request", key="gen_subject")
        key_points = st.text_area("Key points (each on a new line)", placeholder="e.g. \n - Confirm availability \n - Discuss the project \n - Assign tasks", key="gen_points")
        context = st.text_input("Context (Optional)", placeholder="Background information", key="gen_context")
        actions = st.text_input("Actions (Optional)", placeholder="e.g. Please confirm by...", key="gen_actions")
        attachments = st.text_input("Attachments (Optional)", placeholder="e.g. file1.pdf, file2.docx", key="gen_attachments")
        length = st.text_input("Desired Length (Optional)", placeholder="short, medium, or long", key="gen_length")

        if st.button("Generate Email", key="btn_generate"):
            if any([purpose.strip(), recipient_info.strip(), sender_name.strip(), tone.strip(), subject.strip(), key_points.strip()]):
                prompt_data = {
                    "purpose": purpose,
                    "recipient_info": recipient_info,
                    "sender_name": sender_name,
                    "tone": tone,
                    "subject": subject,
                    "key_points": key_points,
                    "context": context,
                    "actions": actions,
                    "attachments": attachments,
                    "length": length,
                }
                with st.spinner("Generating email..."):
                   email_content = gemini_interface.generate_email(prompt_data)
                if email_content:
                     st.markdown("### Generated Email")
                     st.markdown(email_content, unsafe_allow_html=True)
                     render_download_button(email_content, "generated_email.md", "text/markdown")
                else:
                   st.error("Email generation failed due to recitation issues or an error. Please adjust the prompts.")

            else:
                st.warning("Please provide required details for the email (Purpose, Recipient, Sender, Tone, Subject, and Key Points).")

    with tab2:
        st.subheader("↩️ Email Reply Agent")
        st.markdown("Paste an email you received, and the agent will help create a personalized reply.")
        
        # User profile section (for personalization)
        with st.expander("User Profile Settings", expanded=False):
            user_name = st.text_input("Your Name", placeholder="e.g. Jane Doe", key="reply_name")
            default_tone = st.selectbox(
                "Default Reply Tone",
                options=["professional", "friendly", "formal", "casual", "concise", "detailed"],
                index=0,
                key="reply_tone"
            )
            st.info("These settings will be used to personalize your email replies.")
        
        # Input original email
        original_email = st.text_area(
            "Paste the email you received",
            placeholder="Dear Jane,\n\nI hope this email finds you well...",
            height=200,
            key="original_email"
        )
        
        col1, col2 = st.columns(2)
        with col1:
            selected_tone = st.selectbox(
                "Reply Tone",
                options=["professional", "friendly", "formal", "casual", "concise", "detailed"],
                index=0,
                key="selected_tone"
            )
        with col2:
            additional_context = st.text_input(
                "Additional Context (Optional)",
                placeholder="e.g. Mention the updated project timeline",
                key="additional_context"
            )
        
        if st.button("Analyze Email & Generate Reply", key="btn_analyze"):
            if original_email.strip():
                # Create container for outputs
                analysis_container = st.container()
                
                with analysis_container:
                    # Step 1: Summarize the email
                    with st.spinner("Analyzing email content..."):
                        summary = gemini_interface.summarize_email(original_email)
                    
                    st.markdown("### 📋 Email Summary")
                    st.markdown(summary)
                    
                    # Step 2: Generate reply based on summary
                    with st.spinner("Generating personalized reply..."):
                        reply = gemini_interface.generate_reply(
                            original_email,
                            summary,
                            user_tone=selected_tone,
                            user_name=user_name,
                            additional_context=additional_context
                        )
                    
                    st.markdown("### 📤 Suggested Reply")
                    st.markdown(reply)
                    
                    # Step 3: Ask for approval
                    st.markdown("### 👍 Approve or Edit Reply")
                    edited_reply = st.text_area(
                        "Edit reply if needed",
                        value=reply,
                        height=250,
                        key="edited_reply"
                    )
                    
                    # Provide options for using the reply
                    col1, col2 = st.columns(2)
                    with col1:
                        render_download_button(edited_reply, f"email_reply_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md", "text/markdown")
                    with col2:
                        st.button("Copy to Clipboard", key="btn_copy", on_click=lambda: st.write("Reply copied to clipboard!"))
            else:
                st.warning("Please paste the email content to analyze.")

    with tab3:
        st.subheader("🔄 Paraphraser")
        text_to_paraphrase = st.text_area(
            "Enter text to paraphrase",
            placeholder="Paste or type the text you want paraphrased here.",
            key="text_paraphrase"
        )

        # Tone selector
        predefined_tones = [
            "neutral", "fluent", "academic", "natural", "formal",
            "simple", "creative", "expand", "shorten"
        ]
        paraphrase_tone = st.selectbox(
            "Select a tone",
            options=predefined_tones,
            index=0,
            key="paraphrase_tone"
        )

        custom_tone = st.text_input(
            "Or specify a custom tone",
            placeholder="E.g., persuasive, friendly, assertive",
            key="custom_tone"
        )

        # Determine final tone
        selected_paraphrase_tone = custom_tone.strip() if custom_tone.strip() else paraphrase_tone

        if st.button("Paraphrase Text", key="btn_paraphrase"):
            if text_to_paraphrase.strip():
                with st.spinner(f"Paraphrasing text with a '{selected_paraphrase_tone}' tone..."):
                    paraphrased_content = gemini_interface.paraphrase_text(
                        text_to_paraphrase,
                        tone=selected_paraphrase_tone
                    )
                st.markdown("### Paraphrased Text")
                st.markdown(paraphrased_content, unsafe_allow_html=True)
                render_download_button(paraphrased_content, "paraphrased_text.md", "text/markdown")
            else:
                st.warning("Please enter text to paraphrase.")


if __name__ == "__main__":
    main()
