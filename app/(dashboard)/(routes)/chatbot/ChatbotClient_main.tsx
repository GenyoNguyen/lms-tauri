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
  sender: "user" | "bot" | "welcome";
  text: string;
  timestamp: Date;
  avatarUrl?: string;
}

const backgroundImages = [
  '/bg6.jpg',
  '/bg4.jpg',
  '/bg5.jpg',
];

const userAvatar = '/user.png';
const botAvatar = '/bot.png';

const ChatbotClient = () => {
  const { isDark } = useContext(ThemeContext); 
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: 'welcome-message',
      sender: 'welcome',
      text: 'Xin chào! Tôi là trợ lý ảo, rất vui được hỗ trợ bạn. Bạn cần giúp gì?',
      timestamp: new Date(),
      avatarUrl: botAvatar
    };

    setChatHistory([welcomeMessage]);

    // Auto-fade welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typingText, isBotTyping]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
      avatarUrl: userAvatar
    };

    setChatHistory(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsInputEmpty(true);

    try {
      setIsBotTyping(true);
      const result = await invoke<string>('generate_text', {
        prompt: userInput,
        sampleLen: 400, 
        style: true,
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
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        timestamp: new Date(),
        avatarUrl: botAvatar
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
          timestamp: new Date(),
          avatarUrl: botAvatar
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
    setBackgroundImage('bg4.jpg');
    try {
      await invoke('clear_history');
      console.log('Chat history cleared successfully');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  return (
    <div className={cn("main-chatbot-container", isDark && "main-dark")}>
      <div className="main-chatbot-controls">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            "main-settings-button",
            isDark && "bg-gray-800 text-white border-gray-700"
          )}
        >
          Cài đặt
        </button>
      </div>

      {isSettingsOpen && (
        <div className={cn(
          "main-settings-menu",
          isDark && "bg-gray-800 text-white"
        )}>
          <button 
            onClick={handleReset} 
            className="main-reset-button"
          >
            Xóa cuộc trò chuyện
          </button>

          <div className="main-background-selector">
            <span>Chọn hình nền:</span>
            <div className="main-background-options">
              {backgroundImages.map((bg, index) => (
                <button
                  key={index}
                  className={cn(
                    "main-background-button",
                    backgroundImage === bg && "main-selected",
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
        className="main-chat-history"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
        }}
      >
        <AnimatePresence>
          {showWelcomeMessage && chatHistory.filter(m => m.sender === 'welcome').map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                transition: { duration: 0.5 } 
              }}
              className={cn(
                "main-chat-message main-bot main-welcome-message",
                isDark && "main-dark"
              )}
            >
              {message.avatarUrl && (
                <img 
                  src={message.avatarUrl} 
                  alt={`${message.sender} avatar`} 
                  className="main-message-avatar" 
                />
              )}
              <div className="main-message-content">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {!showWelcomeMessage && chatHistory.filter(m => m.sender !== 'welcome').map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={cn(
                "main-chat-message",
                message.sender === "user" ? "main-user" : "main-bot",
                isDark && "main-dark"
              )}
            >
              {message.avatarUrl && (
                <img 
                  src={message.avatarUrl} 
                  alt={`${message.sender} avatar`} 
                  className="main-message-avatar" 
                />
              )}
              <div className="main-message-content">
                {message.sender === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <span>{message.text}</span>
                )}
                <span className="main-message-timestamp">
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
            className={cn("main-chat-message main-bot", isDark && "main-dark")}
          >
            {botAvatar && (
              <img 
                src={botAvatar} 
                alt="Bot avatar" 
                className="main-message-avatar" 
              />
            )}
            <div className="main-message-content">
              <ReactMarkdown>{typingText}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {isBotTyping && !typingText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("main-chat-message main-bot", isDark && "main-dark")}
          >
            {botAvatar && (
              <img 
                src={botAvatar} 
                alt="Bot avatar" 
                className="main-message-avatar" 
              />
            )}
            <div className="message-content main-typing-indicator">
              <div className="main-typing-dot"></div>
              <div className="main-typing-dot"></div>
              <div className="main-typing-dot"></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        className={cn(
          "main-chat-input-container",
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
          placeholder="Nhập tin nhắn của bạn..."
          className={cn(
            "main-chat-input",
            isDark && "bg-gray-700 text-white border-gray-600"
          )}
        />
        <motion.button
          onClick={handleSendMessage}
          className={cn(
            "main-send-button",
            isInputEmpty && "main-disabled",
            isDark && "bg-purple-600 hover:bg-purple-700"
          )}
          whileHover={!isInputEmpty ? { scale: 1.05 } : {}}
          whileTap={!isInputEmpty ? { scale: 0.95 } : {}}
          disabled={isInputEmpty}
        >
          Gửi
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChatbotClient;