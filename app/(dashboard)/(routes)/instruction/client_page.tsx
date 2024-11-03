'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, PaintBucket, RefreshCw, Sparkles } from 'lucide-react';

const InstructionContent = () => {
  const [bgColor, setBgColor] = useState('from-purple-50 to-pink-50');
  const [fontClass, setFontClass] = useState('font-sans'); // Default font class
  const [selectedColor, setSelectedColor] = useState('purple');
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number; color: string }>>([]);

  const getRandomColor = () => {
    const colors = [
      'rgba(255, 0, 255, 0.25)',  // Magenta
      'rgba(0, 255, 255, 0.25)',  // Cyan
      'rgba(255, 192, 203, 0.3)', // Pink
      'rgba(147, 112, 219, 0.3)', // Purple
      'rgba(135, 206, 250, 0.3)'  // Light Blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getRandomColor();
    setRipples(prev => [...prev, { x, y, id: Date.now(), color }]);
  };

  useEffect(() => {
    const timeouts = ripples.map(ripple => {
      return setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600); // Shorten duration to make it fade out faster
    });

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [ripples]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color); // cập nhật màu chính khi chọn
    switch (color) {
      case 'blue':
        setBgColor('from-blue-50 to-cyan-50');
        break;
      case 'purple':
        setBgColor('from-purple-50 to-pink-50');
        break;
      case 'pink':
        setBgColor('from-pink-50 to-rose-50');
        break;
      default:
        setBgColor('from-purple-50 to-pink-50');
    }
  };

  const handleFontChange = (font: string) => {
    switch(font) {
      case 'serif':
        setFontClass('font-lora');
        break;
      case 'sans':
        setFontClass('font-sans');
        break;
      case 'mono':
        setFontClass('font-mono');
        break;
      default:
        setFontClass('font-sans');
    }
  };

  return (
    <div 
      className={`min-h-screen p-8 bg-gradient-to-br ${bgColor} transition-all duration-500 relative overflow-hidden cursor-pointer ${fontClass}`}
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: ripple.color,
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleEffect 0.8s ease-out forwards',
          }}
        />
      ))}

      <Card className="max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="text-center relative overflow-hidden">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            Hướng Dẫn Sử Dụng Trợ Lý Ảo
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="flex items-center space-x-4 p-4 bg-purple-100 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <MessageCircle className="w-12 h-12 text-purple-600 animate-bounce" />
            <div>
              <h2 className="text-xl font-semibold text-purple-800">Chào mừng bạn đến với Chatbot!</h2>
              <p className="text-gray-600">Hãy cùng khám phá những tính năng thú vị của ứng dụng nhé!</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="relative p-6 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -top-3 -left-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                  1
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Reset Cuộc Trò Chuyện
                </h3>
                <p className="mt-2 text-gray-600">
                  • Cuộc trò chuyện sẽ tự động reset khi bạn thoát khỏi chatbot<br/>
                  • Điều này đảm bảo tính riêng tư và bắt đầu mới mỗi lần sử dụng<br/>
                  • Bạn có thể chủ động reset bằng nút setting ở góc trái!
                </p>
              </div>
            </div>

            <div className="relative p-6 bg-white rounded-lg border-2 border-pink-200 hover:border-pink-400 transition-colors duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -top-3 -left-3">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                  2
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
                  <PaintBucket className="w-5 h-5" />
                  Tùy Chỉnh Giao Diện
                </h3>
                <p className="mt-2 text-gray-600">
                  • Chọn ảnh nền yêu thích của bạn ở phần setting của chatbot.<br/>
                  • Thay đổi phông chữ để tối ưu trải nghiệm<br/>
                  • Các thay đổi được áp dụng ngay lập tức
                </p>
                <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                    bg-purple-100 hover:bg-purple-200 ${selectedColor === 'purple' ? 'ring-2 ring-purple-400' : ''}`}
                  onClick={() => handleColorChange('purple')}
                >
                  Màu tím
                </Button>
                <Button 
                  variant="outline" 
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                    bg-pink-100 hover:bg-pink-200 ${selectedColor === 'pink' ? 'ring-2 ring-pink-400' : ''}`}
                  onClick={() => handleColorChange('pink')}
                >
                  Màu hồng
                </Button>
                <Button 
                  variant="outline" 
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                    bg-blue-100 hover:bg-cyan-200 ${selectedColor === 'blue' ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => handleColorChange('blue')}
                >
                  Màu xanh
                </Button>

                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                      ${fontClass === 'font-sans' ? 'ring-2 ring-purple-400' : ''}`}
                    onClick={() => handleFontChange('sans')}
                  >
                    Font Sans
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                      ${fontClass === 'font-lora' ? 'ring-2 ring-pink-400' : ''}`}
                    onClick={() => handleFontChange('serif')}
                  >
                    Font Lora
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                      ${fontClass === 'font-mono' ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => handleFontChange('mono')}
                  >
                    Font Mono
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative p-6 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute -top-3 -left-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                  3
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Mẹo Hữu Ích
                </h3>
                <p className="mt-2 text-gray-600">
                  • Sử dụng câu ngắn gọn đúng chủ đề muốn giải đáp, rõ ràng để chat hiệu quả.<br/>
                  • Chia nhỏ vấn đề để chatbot có thể đáp ứng tốt hơn.<br/>
                  • Nhấn nút &quot;Gợi ý&quot; để xem các câu hỏi mẫu.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-600 italic">
              Hãy trải nghiệm và tận hưởng cuộc trò chuyện thú vị với Chatbot nhé! 🎉
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ripple animation CSS */}
      <style jsx global>{`
        @keyframes rippleEffect {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InstructionContent;
