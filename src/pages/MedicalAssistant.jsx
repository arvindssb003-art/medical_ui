import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import "./MedicalAssistant.css";

function MedicalAssistant() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setMessage("");
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header">
        <div className="assistant-title">
          <div className="assistant-icon">
            <Bot size={28} />
          </div>

          <div>
            <h1>Medical Assistant</h1>
            <p>Get healthcare information and assistance.</p>
          </div>
        </div>

        <button className="clear-chat-button">
          <Trash2 size={17} />
          Clear Chat
        </button>
      </div>

      <div className="assistant-layout">
        <section className="chat-container">
          <div className="chat-messages">
            <div className="chat-message assistant-message">
              <div className="message-avatar assistant-avatar">
                <Bot size={18} />
              </div>

              <div className="message-content">
                <span className="message-name">Medical Assistant</span>
                <div className="message-bubble">
                  <p>
                    Hello! I’m your medical assistant. How can I help you
                    today?
                  </p>
                </div>
              </div>
            </div>

            <div className="chat-message user-message">
              <div className="message-content">
                <span className="message-name">You</span>
                <div className="message-bubble">
                  <p>Your questions will appear here when the chatbot is connected.</p>
                </div>
              </div>

              <div className="message-avatar user-avatar">
                <User size={18} />
              </div>
            </div>
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask a healthcare question..."
            />

            <button type="submit" aria-label="Send message">
              <Send size={19} />
            </button>
          </form>
        </section>

        <aside className="assistant-sidebar">
          <div className="assistant-info-card">
            <div className="info-card-icon">
              <Sparkles size={21} />
            </div>

            <h2>How I can help</h2>

            <ul>
              <li>Explain general health information</li>
              <li>Provide medicine-related information</li>
              <li>Help you understand prescriptions</li>
              <li>Guide you through the platform</li>
            </ul>
          </div>

          <div className="assistant-disclaimer">
            <ShieldCheck size={20} />
            <div>
              <strong>Important</strong>
              <p>
                The assistant provides general information and does not replace
                professional medical advice or emergency care.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MedicalAssistant;