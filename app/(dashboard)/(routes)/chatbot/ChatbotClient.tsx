"use client";

import { useState, useEffect, useRef, useContext } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import './Chatbot.css';
import { ThemeContext } from "../../ThemeContext"; 


interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const backgroundImages = [
  '/bg1.png',
  '/bg2.png',
  '/bg3.png',
];

const ChatbotClient = () => {
  const { isDark } = useContext(ThemeContext); 
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typingText, isBotTyping]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsInputEmpty(true);

    try {
      setIsBotTyping(true);
      const result = await invoke<string>('generate_text', {
        prompt: userInput,
        sampleLen: 400
      });

      if (inputRef.current) {
        inputRef.current.classList.add('success-flash');
        setTimeout(() => {
          inputRef.current?.classList.remove('success-flash');
        }, 1000);
      }

      startTypingEffect(result);
    } catch (error) {
      console.error('Error generating text:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      setIsBotTyping(false);

      if (inputRef.current) {
        inputRef.current.classList.add('error-flash');
        setTimeout(() => {
          inputRef.current?.classList.remove('error-flash');
        }, 1000);
      }
    }
  };

  const startTypingEffect = (text: string) => {
    setTypingText('');
    let index = -1;

    const typeCharacter = () => {
      if (index < text.length) {
        setTypingText(prev => prev + text[index]);
        index++;
        setTimeout(typeCharacter, 20);
      } else {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, botMessage]);
        setTypingText('');
        setIsBotTyping(false);
      }
    };

    typeCharacter();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsInputEmpty(e.target.value.trim() === '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleBackgroundChange = (image: string) => {
    setBackgroundImage(image);
  };

  const handleReset = async () => {
    setChatHistory([]);
    setInput('');
    setTypingText('');
    setIsBotTyping(false);
    setIsInputEmpty(true);
    setBackgroundImage('bg3.png');
    try {
      await invoke('clear_history');
      console.log('Chat history cleared successfully');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  return (
    <div className={cn("chatbot-container", isDark && "dark")}>
      <div className="chatbot-controls">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            "settings-button",
            isDark && "bg-gray-800 text-white border-gray-700"
          )}
        >
          Settings
        </button>
      </div>

      {isSettingsOpen && (
        <div className={cn(
          "settings-menu",
          isDark && "bg-gray-800 text-white"
        )}>
          <button 
            onClick={handleReset} 
            className="reset-button"
          >
            Reset Conversation!
          </button>

          <div className="background-selector">
            <span>Choose background:</span>
            <div className="background-options">
              {backgroundImages.map((bg, index) => (
                <button
                  key={index}
                  className={cn(
                    "background-button",
                    backgroundImage === bg && "selected",
                    isDark && "border-gray-600"
                  )}
                  style={{
                    backgroundImage: `url(${bg})`,
                    border: backgroundImage === bg
                      ? '2px solid #0084ff'
                      : isDark 
                        ? '2px solid #4a5568'
                        : '2px solid transparent'
                  }}
                  onClick={() => handleBackgroundChange(bg)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="chat-history"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
        }}
      >
        <AnimatePresence>
          {chatHistory.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={cn(
                "chat-message",
                message.sender,
                isDark && "dark"
              )}
            >
              <div className="message-content">
                {message.sender === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <span>{message.text}</span>
                )}
                <span className="message-timestamp">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("chat-message bot", isDark && "dark")}
          >
            <div className="message-content">
              <ReactMarkdown>{typingText}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {isBotTyping && !typingText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("chat-message bot", isDark && "dark")}
          >
            <div className="message-content typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        className={cn(
          "chat-input-container",
          isDark && "bg-gray-800 border-t border-gray-700"
        )}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className={cn(
            "chat-input",
            isDark && "bg-gray-700 text-white border-gray-600"
          )}
        />
        <motion.button
          onClick={handleSendMessage}
          className={cn(
            "send-button",
            isInputEmpty && "disabled",
            isDark && "bg-purple-600 hover:bg-purple-700"
          )}
          whileHover={!isInputEmpty ? { scale: 1.05 } : {}}
          whileTap={!isInputEmpty ? { scale: 0.95 } : {}}
          disabled={isInputEmpty}
        >
          Send
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChatbotClient;