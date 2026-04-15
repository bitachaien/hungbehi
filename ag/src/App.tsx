/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, Bell, BarChart3, Users, 
  FileText, Ticket, Settings, RefreshCw, 
  Search, Send, Star, ChevronDown, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NavItem = ({ icon, label, hasChevron = false, isOpen = false, active = false }: { icon: React.ReactNode, label: string, hasChevron?: boolean, isOpen?: boolean, active?: boolean }) => (
  <div 
    id={`nav-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
    className={`flex items-center px-5 py-3 cursor-pointer transition-all duration-200 group ${active ? 'bg-[#039BE5] text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
  >
    <div className={`mr-3 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className="flex-1 text-[11px] font-bold tracking-wider uppercase">{label}</span>
    {hasChevron && (
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={14} />
      </motion.div>
    )}
  </div>
);

interface NumberCardProps {
  id: string;
  price: number;
  val1: number;
  val2: number;
  key?: string | number;
}

const NumberCard = ({ id, price, val1, val2 }: NumberCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      id={`number-card-${id}`}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border-r border-b border-[#FFEBC3] p-[2px] bg-[#F2F8FF] hover:bg-white transition-colors cursor-pointer group"
    >
      <div className="flex h-16 bg-[#F2F8FF] rounded-sm group-hover:shadow-inner relative overflow-hidden">
        {/* Left side: Number */}
        <div className="flex flex-col items-center justify-center border-r border-[#FFEBC3] bg-white/50 px-1">
            <input type="checkbox" className="mb-1 cursor-pointer" id={`check-${id}`} />
            <span className="font-bold text-[12px] bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] shadow-sm font-sans">
              {id}
            </span>
        </div>
        
        {/* Right side: Price and Values */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
           <span className={`font-bold text-[13px] leading-none mb-1 font-sans ${price > 750 ? 'text-[#D32F2F]' : 'text-[#0033FF]'}`}>
             {price}
           </span>
           <div className="text-[9px] text-[#999] text-center leading-tight font-sans">
             <div>{val1}</div>
             <div>{val2}</div>
           </div>
           
           {/* Hover Overlay Controls */}
           <AnimatePresence>
             {isHovered && (
               <motion.div 
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 5 }}
                 className="absolute inset-0 flex items-center justify-between px-2 bg-white/80 backdrop-blur-[1px]"
               >
                  <button className="p-1 rounded-full hover:bg-blue-100 text-[#039BE5] transition-colors">
                    <Plus size={14} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors">
                    <Minus size={14} />
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('ĐỀ');
  
  // Mock data cho 100 số từ 00-99
  const numbers = Array.from({ length: 100 }, (_, i) => {
    const num = i.toString().padStart(2, '0');
    let price = 704;
    if (i === 41) price = 744;
    if (i >= 70 && i <= 79) {
      const prices = [724, 764, 769, 724, 724, 744, 764, 764, 744, 789];
      price = prices[i - 70];
    }
    
    return {
      id: num,
      price: price,
      val1: 0,
      val2: 0,
    };
  });

  const tabs = ['ĐỀ', 'LÔ', 'LÔ ĐẦU', 'XIÊN 2', 'XIÊN 3', 'XIÊN 4', 'ĐỀ TRƯỢT', 'LÔ TRƯỢT', 'ĐỀ ĐẦU'];

  return (
    <div id="app-container" className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden text-[12px]">
      {/* --- SIDEBAR --- */}
      <aside id="sidebar" className="w-[220px] bg-[#2D323E] text-white flex flex-col z-20">
        <div className="p-4 flex items-center gap-3 bg-black/10 h-16">
          <div className="w-9 h-9 bg-[#039BE5] rounded-sm flex items-center justify-center font-bold text-lg italic">789</div>
          <div>
            <h1 className="font-medium text-[14px]">ONE789</h1>
            <p className="text-[#039BE5] text-[10px] uppercase tracking-widest font-bold">ĐẠI LÝ</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <NavItem icon={<LayoutDashboard size={18}/>} label="TỔNG QUAN" />
          <NavItem icon={<Bell size={18}/>} label="THÔNG BÁO" />
          <NavItem icon={<BarChart3 size={18}/>} label="THỐNG KÊ" />
          <NavItem icon={<Users size={18}/>} label="TÀI KHOẢN" />
          <NavItem icon={<FileText size={18}/>} label="BÁO BIỂU" />
          <div className="bg-black/10">
             <NavItem icon={<Ticket size={18}/>} label="XỔ SỐ TRUYỀN THỐNG" />
             <div className="bg-[#039BE5] text-white py-2.5 pl-12 font-bold text-[11px] tracking-wider cursor-pointer border-l-4 border-[#039BE5] bg-opacity-20">
               BẢNG THAO TÁC GIÁ
             </div>
          </div>
          <NavItem icon={<Settings size={18}/>} label="CÀI ĐẶT" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header id="top-header" className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Send size={20} className="text-[#039BE5] cursor-pointer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Star size={20} className="text-gray-400 cursor-pointer" />
            </motion.div>
            <div className="flex items-center text-[#039BE5] font-bold text-[11px] border-2 border-[#039BE5] rounded-md px-3 py-1.5 gap-2 cursor-pointer hover:bg-[#039BE5]/5 transition-colors uppercase tracking-wider">
              <span className="text-lg">☁</span>
              <span>Kéo thả để tải lên</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <span className="font-bold text-gray-700">BOMAYRATGIUAU</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            <Search size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
            <div className="relative cursor-pointer group">
              <Bell size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        {/* Filters & Status Bar */}
        <div id="content-scroller" className="p-5 space-y-3 overflow-y-auto overflow-x-hidden flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Row 1: Game Selection */}
            <div className="flex flex-wrap items-center gap-2">
              <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]">
                <option>2026-04-16</option>
              </select>
              
              <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]">
                <option>Miền Bắc 1</option>
              </select>
              
              <div className="flex flex-wrap gap-1 ml-2">
                {tabs.map((bet) => (
                  <button 
                    key={bet} 
                    onClick={() => setActiveTab(bet)}
                    className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase transition-all duration-200 ${activeTab === bet ? 'bg-[#039BE5] text-white' : 'bg-white text-[#555] hover:bg-gray-100'}`}
                  >
                    {bet}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Status & Time */}
            <div className="flex flex-wrap items-center gap-4 text-[#666] text-[11px]">
              <div className="flex items-center gap-1">
                <span className="font-normal">Nguy cơ:</span>
                <select className="font-bold text-[#333] bg-transparent focus:outline-none"><option>1</option></select>
                <RefreshCw size={12} className="text-[#039BE5] ml-1 cursor-pointer" />
              </div>
              <div className="flex items-center gap-1 text-[#039BE5] font-bold uppercase cursor-pointer">
                <span>Kỳ</span> <ChevronDown size={12} />
              </div>
              <p>Đóng lô: <span className="font-bold text-[#333]">18:15:00</span></p>
              <p>Đóng đề: <span className="font-bold text-[#333]">18:33:00</span></p>
              <p>Tổng tiền: <span className="font-bold text-[#333]">0</span></p>
              <p>Tổng điểm: <span className="font-bold text-[#333]">0</span></p>
              <p className="ml-auto">Giá bán TB hiện tại: <span className="font-bold text-[#D32F2F]">709</span></p>
            </div>
          </motion.div>

          {/* Table Header Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 py-2 border-t border-[#eee] mt-1"
          >
            <select className="border border-[#ddd] rounded px-1 py-1 w-14 focus:outline-none text-[11px]">
              <option>5</option>
            </select>
            <input 
              type="text" 
              placeholder="Giá" 
              className="border border-[#ddd] rounded px-2 py-1 w-20 focus:outline-none text-[11px]" 
            />
            <div className="flex items-center gap-3 ml-1">
              <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Cài đặt giá</button>
              <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Chọn nhanh</button>
              <button className="text-[#D32F2F] hover:text-red-700 font-bold text-[10px] uppercase transition-colors">Hủy</button>
              <div className="h-4 w-[1px] bg-[#ccc]"></div>
              <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Nhập số</button>
            </div>
          </motion.div>

          {/* --- NUMBER GRID --- */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#ddd] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <div className="grid grid-cols-10 border-l border-t border-[#FFEBC3] min-w-[1000px]">
                {numbers.map((item) => (
                  <NumberCard 
                    key={item.id} 
                    id={item.id}
                    price={item.price}
                    val1={item.val1}
                    val2={item.val2}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

