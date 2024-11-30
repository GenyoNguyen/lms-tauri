'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, PaintBucket, RefreshCw, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { ThemeContext } from "../../ThemeContext";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const InstructionContent = () => {
  const { isDark } = useContext(ThemeContext);
  const [bgColor, setBgColor] = useState('from-purple-50 to-pink-50');
  const [fontClass, setFontClass] = useState('font-sans');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number; color: string }>>([]);

  // State để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : totalPages));
  };

  const getRandomColor = () => {
    const colors = isDark ? [
      'rgba(255, 0, 255, 0.15)',  // Darker Magenta
      'rgba(0, 255, 255, 0.15)',  // Darker Cyan
      'rgba(255, 192, 203, 0.2)', // Darker Pink
      'rgba(147, 112, 219, 0.2)', // Darker Purple
      'rgba(135, 206, 250, 0.2)'  // Darker Light Blue
    ] : [
      'rgba(255, 0, 255, 0.25)',  // Light Magenta
      'rgba(0, 255, 255, 0.25)',  // Light Cyan
      'rgba(255, 192, 203, 0.3)', // Light Pink
      'rgba(147, 112, 219, 0.3)', // Light Purple
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
      }, 600);
    });

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [ripples]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    switch (color) {
      case 'blue':
        setBgColor(isDark ? 'from-blue-600 to-cyan-950' : 'from-blue-50 to-cyan-50');
        break;
      case 'purple':
        setBgColor(isDark ? 'from-indigo-800 to-indigo-950' : 'from-purple-50 to-pink-50');
        break;
      case 'pink':
        setBgColor(isDark ? 'from-indigo-600 to-rose-950' : 'from-pink-50 to-rose-50');
        break;
      default:
        setBgColor(isDark ? 'from-purple-950 to-pink-950' : 'from-purple-50 to-pink-50');
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

  // Cập nhật màu nền khi chế độ tối thay đổi
  useEffect(() => {
    handleColorChange(selectedColor);
  }, [isDark]);

  return (
    <div 
      className={`min-h-screen p-8 bg-gradient-to-br ${bgColor} transition-all duration-500 relative overflow-hidden cursor-pointer ${fontClass}`}
      onClick={handleClick}
    >
      {/* Background chuyển động */}
      <MovingBackground isDark={isDark} />

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

      <TransitionGroup component={null}>
        <CSSTransition
          key={currentPage}
          timeout={500}
          classNames="page-transition"
        >
          {currentPage === 1 ? (
            <div className="page">
              {/* Trang 1 */}
              <Card className={`max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
                <CardHeader className="text-center relative overflow-auto">
                  <CardTitle className={`text-4xl font-bold bg-gradient-to-r ${isDark ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent animate-pulse`}>
                    Hướng Dẫn Sử Dụng Trợ Lý Ảo
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <div className={`flex items-center space-x-4 p-4 ${isDark ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
                    <MessageCircle className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'} animate-bounce`} />
                    <div>
                      <h2 className={`text-xl font-semibold ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>Chào mừng bạn đến với Chatbot!</h2>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Hãy cùng khám phá những tính năng thú vị của ứng dụng nhé!</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className={`relative p-6 ${isDark ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'} rounded-lg border-2 hover:border-purple-400 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                      <div className="absolute -top-3 -left-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                          1
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-purple-300' : 'text-purple-800'} flex items-center gap-2`}>
                          <RefreshCw className="w-5 h-5" />
                          Reset Cuộc Trò Chuyện
                        </h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          • Cuộc trò chuyện sẽ tự động reset khi bạn thoát khỏi chatbot<br/>
                          • Điều này đảm bảo tính riêng tư và bắt đầu mới mỗi lần sử dụng<br/>
                          • Bạn có thể chủ động reset bằng nút setting ở góc trái!
                        </p>
                      </div>
                    </div>

                    <div className={`relative p-6 ${isDark ? 'bg-gray-800 border-pink-700' : 'bg-white border-pink-200'} rounded-lg border-2 hover:border-pink-400 transition-colors duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                      <div className="absolute -top-3 -left-3">
                        <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                          2
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-pink-300' : 'text-pink-800'} flex items-center gap-2`}>
                          <PaintBucket className="w-5 h-5" />
                          Tùy Chỉnh Giao Diện
                        </h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          • Chọn ảnh nền yêu thích của bạn ở phần setting của chatbot.<br/>
                          • Thay đổi phông chữ để tối ưu trải nghiệm<br/>
                          • Các thay đổi được áp dụng ngay lập tức
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-purple-500 hover:bg-purple-800' : 'bg-purple-100 hover:bg-purple-200'}
                              ${selectedColor === 'purple' ? 'ring-2 ring-purple-400' : ''}`}
                            onClick={() => handleColorChange('purple')}
                          >
                            Màu tím
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-indigo-600 hover:bg-pink-800' : 'bg-pink-100 hover:bg-pink-200'}
                              ${selectedColor === 'pink' ? 'ring-2 ring-pink-400' : ''}`}
                            onClick={() => handleColorChange('pink')}
                          >
                            Màu hồng
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-blue-800 hover:bg-blue-800' : 'bg-blue-100 hover:bg-cyan-200'}
                              ${selectedColor === 'blue' ? 'ring-2 ring-blue-400' : ''}`}
                            onClick={() => handleColorChange('blue')}
                          >
                            Màu xanh
                          </Button>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-black hover:bg-slate-500' : 'bg-blue-20 hover:bg-amber-200'}
                              ${fontClass === 'font-sans' ? 'ring-2 ring-purple-400' : ''}`}
                            onClick={() => handleFontChange('sans')}
                          >
                            Font Sans
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-black hover:bg-slate-500' : 'bg-blue-20 hover:bg-amber-200'}
                              ${fontClass === 'font-lora' ? 'ring-2 ring-pink-400' : ''}`}
                            onClick={() => handleFontChange('serif')}
                          >
                            Font Lora
                          </Button>
                          <Button 
                            variant="outline" 
                            className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300
                              ${isDark ? 'bg-black hover:bg-slate-500' : 'bg-blue-20 hover:bg-amber-200'}
                              ${fontClass === 'font-mono' ? 'ring-2 ring-blue-400' : ''}`}
                            onClick={() => handleFontChange('mono')}
                          >
                            Font Mono
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className={`relative p-6 ${isDark ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-200'} rounded-lg border-2 hover:border-blue-400 transition-colors duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                      <div className="absolute -top-3 -left-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                          3
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'} flex items-center gap-2`}>
                          <Sparkles className="w-5 h-5" />
                          Mẹo Hữu Ích
                        </h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          • Sử dụng câu ngắn gọn đúng chủ đề muốn giải đáp, rõ ràng để chat hiệu quả.<br/>
                          • Chia nhỏ vấn đề để chatbot có thể đáp ứng tốt hơn.<br/>
                          • Nhấn nút &quot;Gợi ý&quot; để xem các câu hỏi mẫu.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`text-center mt-8 p-4 ${isDark ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-lg transform hover:scale-105 transition-all duration-300`}>
                    <p className={isDark ? 'text-gray-300 italic' : 'text-gray-600 italic'}>
                      Hãy trải nghiệm và tận hưởng cuộc trò chuyện thú vị với Chatbot nhé! 🎉
                    </p>
                  </div>
                </CardContent>
                <div className="text-center mt-4">
                  <Button onClick={handleNextPage} className="mt-4 mb-10 flex items-center justify-center mx-auto text-lg font-semibold px-6 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Tiếp Theo
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="page">
              {/* Trang 2 */}
              <Card className={`max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
                <CardHeader className="text-center relative overflow-hidden">
                  <CardTitle className={`text-4xl font-bold bg-gradient-to-r ${isDark ? 'from-green-400 to-blue-400' : 'from-green-600 to-blue-600'} bg-clip-text text-transparent animate-pulse`}>
                    Hướng Dẫn Tiếp Theo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className={`flex items-center space-x-4 p-4 ${isDark ? 'bg-green-900' : 'bg-green-100'} rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
                    <MessageCircle className={`w-12 h-12 ${isDark ? 'text-green-400' : 'text-green-600'} animate-bounce`} />
                    <div>
                      <h2 className={`text-xl font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>Khám phá thêm!</h2>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Tiếp tục tìm hiểu các tính năng mới của chatbot.</p>
                    </div>
                  </div>

                  {/* Thêm nội dung mới cho trang 2 */}
                  <div className="grid gap-6">
                    <div className={`relative p-6 ${isDark ? 'bg-gray-800 border-yellow-700' : 'bg-white border-yellow-200'} rounded-lg border-2 hover:border-yellow-400 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                      <div className="absolute -top-3 -left-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                          4
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'} flex items-center gap-2`}>
                          <Sparkles className="w-5 h-5" />
                          Tính Năng Mới
                        </h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          • Thử các lệnh mới để khám phá khả năng của chatbot.<br/>
                          • Sử dụng chatbot để học tập, giải trí và làm việc hiệu quả hơn.<br/>
                          • Luôn cập nhật để trải nghiệm những tính năng mới nhất.
                        </p>
                      </div>
                    </div>

                    <div className={`relative p-6 ${isDark ? 'bg-gray-800 border-red-700' : 'bg-white border-red-200'} rounded-lg border-2 hover:border-red-400 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                      <div className="absolute -top-3 -left-3">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                          5
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-red-300' : 'text-red-800'} flex items-center gap-2`}>
                          <RefreshCw className="w-5 h-5" />
                          Cập Nhật Thường Xuyên
                        </h3>
                        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          • Chúng tôi luôn cải tiến để mang đến trải nghiệm tốt nhất.<br/>
                          • Đừng quên kiểm tra các cập nhật mới và chia sẻ phản hồi của bạn.<br/>
                          • Cùng nhau xây dựng một cộng đồng chatbot mạnh mẽ.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`text-center mt-8 p-4 ${isDark ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-100 to-blue-100'} rounded-lg transform hover:scale-105 transition-all duration-300`}>
                    <p className={isDark ? 'text-gray-300 italic' : 'text-gray-600 italic'}>
                      Cảm ơn bạn đã sử dụng chatbot của chúng tôi! 🌟
                    </p>
                  </div>
                </CardContent>
                <div className="text-center mt-4">
                  <Button onClick={handlePreviousPage} className="mt-4 mb-10 flex items-center justify-center mx-auto text-lg font-semibold px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <ArrowLeft className="w-6 h-6 mr-2" />
                    Quay Lại
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>

      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translateX(100%);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateX(0%);
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
        }
        .page-transition-exit {
          opacity: 1;
          transform: translateX(0%);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform: translateX(-100%);
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
        }
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

// Thành phần MovingBackground
const MovingBackground = ({ isDark } : {isDark : boolean}) => {
  const backgroundGradient = isDark
    ? 'bg-gradient-to-left from-gray-800 via-gray-900 to-black'
    : 'bg-gradient-to-left from-purple-300 via-pink-300 to-blue-300';

  const circleColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'; 

  return (
    <div className={`absolute top-0 left-0 w-full h-full ${backgroundGradient} overflow-hidden`}>
      <ul className="circles">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} style={{ background: circleColor }}></li>
        ))}
      </ul>

      <style jsx>{`
        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .circles li {
          position: absolute;
          display: block;
          list-style: none;
          width: 20px;
          height: 20px;
          background: ${circleColor};
          animation: animate 25s linear infinite;
          bottom: -150px;
        }

        .circles li:nth-child(1) {
          left: 25%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }

        .circles li:nth-child(2) {
          left: 10%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        .circles li:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }

        .circles li:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        .circles li:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }

        .circles li:nth-child(6) {
          left: 75%;
          width: 110px;
          height: 110px;
          animation-delay: 3s;
        }

        .circles li:nth-child(7) {
          left: 35%;
          width: 150px;
          height: 150px;
          animation-delay: 7s;
        }

        .circles li:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        .circles li:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        .circles li:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }

        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default InstructionContent;
