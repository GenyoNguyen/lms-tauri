"use client";

import { useState, useEffect, useRef, useContext } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragConstraints, setDragConstraints] = useState({
    left: -20,
    right: 20,
    top: -20,
    bottom: 20,
  });
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('bg3.png');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [width, setWidth] = useState(400); // Default width
  const [height, setHeight] = useState(500); // Default height
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typingText, isBotTyping]);

  // Set drag constraints
  useEffect(() => {
    const updateConstraints = () => {
      if (!containerRef.current) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      setDragConstraints({
        left: -(windowWidth - containerWidth) / 2,
        right: (windowWidth - containerWidth) / 2,
        top: -(windowHeight - containerHeight) / 2,
        bottom: (windowHeight - containerHeight) / 2,
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [isMinimized, width, height]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
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
      });
      startTypingEffect(result);
    } catch (error) {
      console.error('Error generating text:', error);
      setChatHistory(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
      setIsBotTyping(false);
    }
  };

  // Typing effect - word-by-word
  const startTypingEffect = (text: string) => {
    setTypingText('');
    const words = text.split(' ');
    let index = 0;

    const typeWord = () => {
      if (index < words.length) {
        setTypingText(prev => (prev + ' ' + words[index]).trim());
        index++;
        setTimeout(typeWord, 200); // Delay for word-by-word effect
      } else {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, botMessage]);
        setTypingText('');
        setIsBotTyping(false);
      }
    };

    typeWord();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 500) return;
    setInput(value);
    setIsInputEmpty(value.trim() === '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackgroundChange = (image: string) => {
    setBackgroundImage(image);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(e.target.value));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(e.target.value));
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
    <motion.div
      ref={containerRef}
      className={cn("chatbot-container", isDark && "dark", isMinimized && "minimized")}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={dragConstraints}
      style={{
        x,
        y,
        width: `${width}px`,
        height: isMinimized ? '60px' : `${height}px`,
        position: 'fixed',
        zIndex: 1000,
        touchAction: 'none',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <div className={cn("chatbot-header", isDark ? "dark-header" : "light-header")}>
        <div className="header-title">{isMinimized ? "Chat" : "Chatbot"}</div>
        <div className="header-controls">
          <button onClick={toggleMinimize} className="control-button">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="control-button">
            Settings
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isSettingsOpen && (
              <div className="settings-menu">
                <button onClick={handleReset} className="reset-button">Reset Conversation</button>
                
                <div className="background-selector">
                  <span>Choose background:</span>
                  <div className="background-options">
                    {backgroundImages.map((bg, index) => (
                      <button
                        key={index}
                        className={cn("background-button", backgroundImage === bg && "selected")}
                        style={{ backgroundImage: `url(${bg})` }}
                        onClick={() => handleBackgroundChange(bg)}
                      />
                    ))}
                  </div>
                </div>

                <div className="width-selector">
                  <span>Adjust width:</span>
                  <input type="range" min="300" max="600" value={width} onChange={handleWidthChange} />
                </div>
                <div className="height-selector">
                  <span>Adjust height:</span>
                  <input type="range" min="300" max="800" value={height} onChange={handleHeightChange} />
                </div>
              </div>
            )}

            <div className="chat-history" style={{ overflowY: 'auto', flex: 1 }}>
              <AnimatePresence>
                {chatHistory.map((message) => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', duration: 0.5 }} className={cn("chat-message", message.sender)}>
                    <div className="message-content">
                      {message.sender === 'bot' ? <ReactMarkdown>{message.text}</ReactMarkdown> : <span>{message.text}</span>}
                      <span className="message-timestamp">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="chat-input-container">
        <input ref={inputRef} type="text" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Type your message here..." className="chat-input" />
        <motion.button onClick={handleSendMessage} className={cn("send-button", isInputEmpty && "disabled")} disabled={isInputEmpty}>Send</motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ChatbotClient;