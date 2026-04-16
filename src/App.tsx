/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate
} from 'react-router-dom';
import { 
  LayoutDashboard, Bell, BarChart3, Users, 
  FileText, Ticket, Settings, RefreshCw, 
  Search, Send, Star, ChevronDown, Plus, Minus, Loader2,
  ChevronRight, Tag, BookOpen, LayoutGrid, Lock, User, Eye, EyeOff, Mail, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface NavNode {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavNode[];
}

const NavItem: React.FC<{ 
  node: NavNode, 
  depth?: number, 
}> = ({ 
  node, 
  depth = 0, 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(depth === 0 && (node.label === 'Báo biểu' || node.label === 'Xổ số truyền thống' || location.pathname.startsWith(node.path || '___')));
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.path ? location.pathname === node.path : false;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (node.path) {
      navigate(node.path);
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        onClick={handleClick}
        className={`flex items-center px-5 py-3 cursor-pointer transition-all duration-200 group 
          ${isActive ? 'bg-[#039BE5] text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
        style={{ paddingLeft: `${20 + depth * 16}px` }}
      >
        {node.icon && <div className={`mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{node.icon}</div>}
        <span className={`flex-1 text-[11px] font-bold tracking-wider uppercase ${depth > 0 ? 'normal-case font-medium' : ''}`}>
          {node.label}
        </span>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/10"
          >
            {node.children?.map((child, i) => (
              <NavItem 
                key={i} 
                node={child} 
                depth={depth + 1} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const navigationData: NavNode[] = [
  { label: 'Tổng quan', icon: <LayoutDashboard size={18}/>, path: '/dashboard' },
  { 
    label: 'Thông báo', 
    icon: <Bell size={18}/>,
    children: [
      { label: 'Thông thường', path: '/announcements/normal' },
      { label: 'Quan trọng', path: '/announcements/special' },
      { label: 'Hệ thống', path: '/announcements/system' },
      { label: 'Thông báo cá nhân', path: '/announcements/personal' },
    ]
  },
  { 
    label: 'Thống kê', 
    icon: <BarChart3 size={18}/>,
    children: [
      { label: 'Sản phẩm', path: '/statistical/agent_production' },
      { label: 'Tiền cược/Thắng thua XSTT', path: '/statistical/agent_lottery' },
    ]
  },
  { 
    label: 'Tài khoản', 
    icon: <Users size={18}/>,
    children: [
      { label: 'Danh sách tài khoản', path: '/account/agency' },
      { label: 'Tài khoản phụ', path: '/account/sub-account' },
      { label: 'Thông tin tài khoản', path: '/account/parameter' },
    ]
  },
  { 
    label: 'Báo biểu', 
    icon: <BookOpen size={18}/>,
    children: [
      { label: 'Thắng thua tổng hợp', path: '/accounting/combination/win-lose' },
      { 
        label: 'Xổ số truyền thống',
        children: [
          { label: 'Tiền chưa xử lý', path: '/traditional/statement/outstanding' },
          { label: 'Hội viên thắng thua', path: '/traditional/statement/member' },
          { label: 'Đơn hàng đã huỷ', path: '/traditional/statement/canceled' },
        ]
      },
      { 
        label: '789 Casino',
        children: [
          { label: 'Hội viên thắng thua', path: '/casino789/statement/member' },
        ]
      },
      { 
        label: 'Bong88',
        children: [
          { label: 'Hội viên thắng thua', path: '/saba/statement/member' },
          { label: 'Tiền chưa xử lý', path: '/saba/statement/outstanding' },
          { 
            label: 'Thống kê trận đấu',
            children: [
              { label: 'Cược chấp / Tài Xỉu', path: '/saba/statement/risk-control/handicap-over-under' },
              { label: '1X2', path: '/saba/statement/risk-control/1x2' },
            ]
          },
        ]
      },
    ]
  },
  { 
    label: 'Xổ số truyền thống', 
    icon: <Ticket size={18}/>,
    children: [
      { label: 'Bảng thao tác giá', icon: <Tag size={16}/>, path: '/traditional/price_table' },
    ]
  },
  { label: 'Cài đặt', icon: <Settings size={18}/> },
];

interface DashboardData {
  numbers: { id: string; price: number; val1: number; val2: number }[];
  status: {
    risk: number;
    totalAmount: number;
    totalPoints: number;
    avgPrice: number;
  };
  dashboard: {
    todayWinLose: number;
    yesterdayWinLose: number;
    outstanding: number;
    onlineUsers: number;
    topWinners: { id: number; name: string; amount: number; agency: string }[];
    topLosers: { id: number; name: string; amount: number; agency: string }[];
    accountStatus: {
      stopped: number;
      closed: number;
      active: number;
      total: number;
    };
  };
}

const StatWidget = ({ title, value, color, subValue, subLabel }: { title: string, value: number, color: string, subValue?: number, subLabel?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex-1 min-w-[240px] rounded-sm shadow-sm overflow-hidden flex flex-col h-[210px] ${color}`}
  >
    <div className={`p-4 border-b border-black/5 flex items-center justify-between ${color.replace('100', '200').replace('200', '300').replace('300', '400')}`}>
      <span className="text-[20px] font-normal text-black/87">{title}</span>
      {subLabel === 'flip' && <RefreshCw size={18} className="text-black/54 cursor-pointer" />}
    </div>
    <div className="flex-1 flex items-center justify-center">
      <span className={`text-[48px] font-normal ${value < 0 ? 'text-red-600' : 'text-black/87'}`}>
        {value.toLocaleString()}
      </span>
    </div>
    {subLabel && subLabel !== 'flip' && (
      <div className="p-2 px-4 bg-black/5 border-t border-black/10 flex justify-end items-center gap-2">
        <span className="text-[14px] text-black/54">{subLabel}:</span>
        <span className="text-[14px] font-bold text-black/87">{subValue?.toLocaleString()}</span>
      </div>
    )}
  </motion.div>
);

const DataTable = ({ title, headers, data }: { title: string, headers: string[], data: any[] }) => (
  <div className="flex-1 min-w-[300px] bg-white rounded-sm shadow-sm overflow-hidden flex flex-col h-[186px]">
    <div className="p-4 bg-[#B0BEC5] border-b border-gray-200">
      <span className="text-[20px] font-normal text-black/87">{title}</span>
    </div>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#EEEEEE] sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3 text-[13px] font-medium text-black/54 border-r border-gray-200 last:border-0 ${i > 1 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-red-500 text-[13px]">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {headers.map((_, j) => {
                  const keys = Object.keys(row);
                  const val = row[keys[j]];
                  return (
                    <td key={j} className={`px-4 py-2 text-[13px] border-r border-gray-100 last:border-0 ${j > 1 ? 'text-right' : ''}`}>
                      {typeof val === 'number' ? val.toLocaleString() : val}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const NumberCard: React.FC<{ id: string, price: number, val1: number, val2: number }> = ({ id, price, val1, val2 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      id={`number-card-${id}`}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-row justify-center items-start p-[2px] w-[158.19px] h-[63px] bg-[#F2F8FF] border border-[#FFEBC3] cursor-pointer group box-border relative"
    >
      <div className="flex flex-col items-center w-[38.05px] h-[57px] max-w-[39.55px]">
         <div className="flex flex-col items-start w-[26px] h-[26.5px] max-w-[38.05px]">
             <div className="box-border flex flex-col items-center w-[26px] h-[26.5px] bg-[#FFFFFF] border border-[#DDDDDD] rounded-[13px]">
                <span className="w-[16px] h-[24px] font-bold text-[14px] leading-[24px] text-center tracking-[-0.1px] text-[#0E0E0E] font-sans">
                  {id}
                </span>
             </div>
         </div>
      </div>
      <div className="flex flex-col items-start w-[114.14px] h-[57px] max-w-[118.64px]">
         <div className="flex flex-row justify-between items-center px-[5px] pb-0 w-[114.14px] h-[20px]">
            <Plus size={20} className="text-black/54 max-w-[114.14px] opacity-0 group-hover:opacity-100 transition-opacity min-w-[20px]" />
            <motion.span 
              key={price}
              initial={{ opacity: 0.5, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute left-[50%] -translate-x-[50%] top-[-1px] font-bold text-[13px] leading-[18px] text-center tracking-[-0.1px] font-sans ${price > 750 ? 'text-[#0033FF]' : 'text-[#0033FF]'}`}
            >
              {price}
            </motion.span>
            <Minus size={20} className="text-black/54 max-w-[114.14px] opacity-0 group-hover:opacity-100 transition-opacity min-w-[20px]" />
         </div>
         <div className="flex flex-col items-start px-[54.0156px] pt-[5px] pb-0 w-[114.14px] h-[37px] relative">
            <span className="absolute left-[50%] -translate-x-[50%] top-[0px] w-[7px] h-[16px] font-normal text-[11px] leading-[15px] flex items-center tracking-[-0.1px] text-black/87 font-sans">
              {val1}
            </span>
            <span className="absolute left-[50%] -translate-x-[50%] top-[15.39px] w-[7px] h-[16px] font-normal text-[11px] leading-[15px] flex items-center tracking-[-0.1px] text-black/87 font-sans">
              {val2}
            </span>
         </div>
      </div>
    </motion.div>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode, onLogout: () => void, username: string }> = ({ children, onLogout, username }) => {
  return (
    <div id="app-container" className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden text-[12px]">
      {/* --- SIDEBAR --- */}
      <aside id="sidebar" className="w-[240px] bg-[#2D323E] text-white flex flex-col z-20 shadow-[0_5px_5px_-3px_rgba(0,0,0,0.2),0_8px_10px_1px_rgba(0,0,0,0.14),0_3px_14px_2px_rgba(0,0,0,0.12)]">
        <div className="flex items-center px-6 bg-white/5 h-16 min-h-[64px] shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_1px_rgba(0,0,0,0.14),0_2px_1px_-1px_rgba(0,0,0,0.12)]">
          <div className="w-9 h-9 bg-[#039BE5] rounded-sm flex items-center justify-center font-bold text-lg italic mr-4">789</div>
          <div className="flex flex-col">
            <h1 className="font-normal text-[15px] leading-[21px] tracking-[-0.1px]">ONE789</h1>
            <p className="text-[#039BE5] text-[11px] leading-[15px] uppercase tracking-[-0.1px] font-normal">ĐẠI LÝ</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {navigationData.map((node, i) => (
            <NavItem 
              key={i} 
              node={node} 
            />
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header id="top-header" className="h-16 min-h-[64px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_1px_rgba(0,0,0,0.14),0_2px_1px_-1px_rgba(0,0,0,0.12)] flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <Send size={24} className="text-[#039BE5]" />
            </div>
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <Star size={24} className="text-[#FFB300]" />
            </div>
          </div>
          <div className="flex items-center gap-0">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-4 h-16 transition-colors group relative">
              <span className="font-medium text-[14px] text-black uppercase tracking-[0.14px]">{username}</span>
              <ChevronDown size={16} className="text-black/54" />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 w-48 bg-white shadow-lg border border-gray-100 py-2 hidden group-hover:block z-50">
                <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center gap-2">
                  <User size={16} />
                  <span>Thông tin cá nhân</span>
                </div>
                <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center gap-2">
                  <Settings size={16} />
                  <span>Cài đặt</span>
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div 
                  onClick={onLogout}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2"
                >
                  <Send size={16} className="rotate-180" />
                  <span>Đăng xuất</span>
                </div>
              </div>
            </div>
            <div className="h-16 w-[1px] bg-black/12"></div>
            <div className="p-4 hover:bg-gray-100 cursor-pointer transition-colors">
              <Search size={24} className="text-black/54" />
            </div>
            <div className="h-16 w-[1px] bg-black/12"></div>
            <div className="relative p-4 hover:bg-gray-100 cursor-pointer transition-colors group">
              <Bell size={28} className="text-black/54" />
              <span className="absolute top-[20px] right-[20px] w-[9px] h-[9px] bg-[#F92233] rounded-full border border-white"></span>
            </div>
          </div>
        </header>

        <div id="content-scroller" className="p-5 overflow-y-auto overflow-x-hidden flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ data }: { data: DashboardData | null }) => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-4">
      <StatWidget title="Thắng thua hôm nay" value={data?.dashboard.todayWinLose || 0} color="bg-[#A5D6A7]" />
      <StatWidget title="Thắng thua hôm qua" value={data?.dashboard.yesterdayWinLose || 0} color="bg-[#81D4FA]" />
      <StatWidget title="Tổng tiền chưa xử lý" value={data?.dashboard.outstanding || 0} color="bg-[#FFF176]" subLabel="Hội viên" subValue={data?.dashboard.outstanding} />
      <StatWidget title="Khách hàng trực tuyến" value={data?.dashboard.onlineUsers || 0} color="bg-[#FFCDD2]" />
    </div>
    <div className="flex flex-wrap gap-4">
      <DataTable title="Hội viên thắng trong tuần" headers={['#', 'Hội viên', 'Số tiền', 'Đại lý']} data={data?.dashboard.topWinners || []} />
      <DataTable title="Hội viên thua trong tuần" headers={['#', 'Hội viên', 'Số tiền', 'Đại lý']} data={data?.dashboard.topLosers || []} />
      <DataTable title="Hội viên cược trong tuần" headers={['#', 'Hội viên', 'Tiền cược', 'Thắng thua']} data={[]} />
      <div className="flex-1 min-w-[300px] bg-white rounded-sm shadow-sm overflow-hidden flex flex-col h-[186px]">
        <div className="p-4 bg-[#B0BEC5] border-b border-gray-200">
          <span className="text-[20px] font-normal text-black/87">Tình trạng tài khoản</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EEEEEE]">
            <tr>
              <th className="px-4 py-3 text-[13px] font-medium text-black/54 border-r border-gray-200 last:border-0"></th>
              <th className="px-4 py-3 text-[13px] font-medium text-black/54 border-r border-gray-200 last:border-0 text-right">Ngừng cược</th>
              <th className="px-4 py-3 text-[13px] font-medium text-black/54 border-r border-gray-200 last:border-0 text-right">Đóng</th>
              <th className="px-4 py-3 text-[13px] font-medium text-black/54 border-r border-gray-200 last:border-0 text-right">Hoạt động</th>
              <th className="px-4 py-3 text-[13px] font-medium text-black/54 text-right">Tổng số</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2 text-[13px] border-r border-gray-100">Hội viên</td>
              <td className="px-4 py-2 text-[13px] border-r border-gray-100 text-right bg-red-100 font-bold">{data?.dashboard.accountStatus.stopped}</td>
              <td className="px-4 py-2 text-[13px] border-r border-gray-100 text-right bg-gray-400 font-bold">{data?.dashboard.accountStatus.closed}</td>
              <td className="px-4 py-2 text-[13px] border-r border-gray-100 text-right bg-green-400 font-bold">{data?.dashboard.accountStatus.active}</td>
              <td className="px-4 py-2 text-[13px] text-right font-bold">{data?.dashboard.accountStatus.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const QuickSelectDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleReset = () => {
    setSelections({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-auto py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col md-dialog md-default-theme w-[80%] max-w-[960px] max-h-[90vh]"
      >
        <div className="bg-[#039BE5] text-white px-6 py-4 flex items-center shadow-sm z-10 md-toolbar-tools relative h-[64px]">
          <h2 className="text-[20px] font-normal leading-[32px] tracking-[0.0125em] m-0 pr-8 overflow-hidden text-ellipsis whitespace-nowrap align-middle">Chọn Nhanh</h2>
          <button onClick={onClose} className="absolute right-4 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none w-[40px] h-[40px] flex items-center justify-center">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto md-dialog-content bg-[#FAFAFA] flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 flex-col md:flex-row gap-[16px] md:gap-[24px]">
            
            {/* Left Column */}
            <div className="flex flex-col gap-[24px] w-full">
              {/* Con giáp */}
              <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col">
                <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Con giáp</div>
                <div className="grid grid-cols-4 gap-2">
                  {['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'].map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['congiap'] === item ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['congiap'] === item && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                      </div>
                      <input 
                        type="radio" 
                        name="congiap" 
                        className="hidden" 
                        checked={selections['congiap'] === item} 
                        onChange={() => handleSelect('congiap', item)} 
                      />
                      <span className="text-[13px] text-black/87 leading-[18px]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Đầu Đuôi */}
              <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col">
                <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Đầu / Đuôi</div>
                <div className="flex flex-row gap-8">
                  <div className="flex flex-col flex-1">
                    <div className="text-[12px] text-black/54 mb-2 font-medium">ĐẦU</div>
                    <div className="grid grid-cols-2 gap-2">
                       {[0,1,2,3,4,5,6,7,8,9].map(num => (
                         <label key={`dau-${num}`} className="flex items-center gap-2 cursor-pointer group">
                           <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['dau'] === String(num) ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                              {selections['dau'] === String(num) && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                           </div>
                           <input type="radio" name="dau" className="hidden" checked={selections['dau'] === String(num)} onChange={() => handleSelect('dau', String(num))} />
                           <span className="text-[13px] text-black/87 leading-[18px]">{num}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="text-[12px] text-black/54 mb-2 font-medium">ĐUÔI</div>
                    <div className="grid grid-cols-2 gap-2">
                       {[0,1,2,3,4,5,6,7,8,9].map(num => (
                         <label key={`duoi-${num}`} className="flex items-center gap-2 cursor-pointer group">
                           <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['duoi'] === String(num) ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                              {selections['duoi'] === String(num) && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                           </div>
                           <input type="radio" name="duoi" className="hidden" checked={selections['duoi'] === String(num)} onChange={() => handleSelect('duoi', String(num))} />
                           <span className="text-[13px] text-black/87 leading-[18px]">{num}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-[24px] w-full">
              <div className="flex flex-row gap-[24px]">
                 {/* Tổng 3 */}
                 <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col flex-1 min-w-0">
                   <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Tổng &gt;= 3</div>
                   <div className="grid grid-cols-2 gap-2">
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['tongba'] === 'Tai' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['tongba'] === 'Tai' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="tongba" className="hidden" checked={selections['tongba'] === 'Tai'} onChange={() => handleSelect('tongba', 'Tai')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Tài</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['tongba'] === 'Xiu' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['tongba'] === 'Xiu' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="tongba" className="hidden" checked={selections['tongba'] === 'Xiu'} onChange={() => handleSelect('tongba', 'Xiu')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Xỉu</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['tongba'] === 'Le' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['tongba'] === 'Le' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="tongba" className="hidden" checked={selections['tongba'] === 'Le'} onChange={() => handleSelect('tongba', 'Le')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Lẻ</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['tongba'] === 'Chan' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['tongba'] === 'Chan' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="tongba" className="hidden" checked={selections['tongba'] === 'Chan'} onChange={() => handleSelect('tongba', 'Chan')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Chẵn</span>
                     </label>
                   </div>
                 </div>

                 {/* Bỏ đầu */}
                 <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col flex-1 min-w-0">
                   <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Bỏ đầu</div>
                   <div className="grid grid-cols-2 gap-2">
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['bodau'] === 'Tai' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['bodau'] === 'Tai' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="bodau" className="hidden" checked={selections['bodau'] === 'Tai'} onChange={() => handleSelect('bodau', 'Tai')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Tài</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['bodau'] === 'Xiu' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['bodau'] === 'Xiu' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="bodau" className="hidden" checked={selections['bodau'] === 'Xiu'} onChange={() => handleSelect('bodau', 'Xiu')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Xỉu</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['bodau'] === 'Le' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['bodau'] === 'Le' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="bodau" className="hidden" checked={selections['bodau'] === 'Le'} onChange={() => handleSelect('bodau', 'Le')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Lẻ</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['bodau'] === 'Chan' ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                         {selections['bodau'] === 'Chan' && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="bodau" className="hidden" checked={selections['bodau'] === 'Chan'} onChange={() => handleSelect('bodau', 'Chan')} />
                       <span className="text-[13px] text-black/87 leading-[18px]">Chẵn</span>
                     </label>
                   </div>
                 </div>
              </div>

              {/* Tổng */}
              <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col w-full">
                <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Tổng</div>
                <div className="grid grid-cols-5 gap-[12px]">
                   {[0,1,2,3,4,5,6,7,8,9].map(num => (
                     <label key={`tong-${num}`} className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['tong'] === String(num) ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                          {selections['tong'] === String(num) && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="tong" className="hidden" checked={selections['tong'] === String(num)} onChange={() => handleSelect('tong', String(num))} />
                       <span className="text-[13px] text-black/87 leading-[18px]">{num}</span>
                     </label>
                   ))}
                </div>
              </div>

              {/* Lại Kép */}
              <div className="bg-white p-4 rounded-sm border border-[#E0E0E0] shadow-sm flex flex-col w-full">
                <div className="font-bold text-[14px] text-black/87 mb-3 pb-2 border-b border-[#EEEEEE] uppercase flex items-center border-[2px] border-l-[#039BE5] pl-2 border-y-0 border-r-0">Lại kép</div>
                <div className="flex flex-row gap-8">
                   {['KÉP', 'SÁT KÉP'].map(item => (
                     <label key={item} className="flex items-center gap-2 cursor-pointer group">
                       <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${selections['kep'] === item ? 'border-[#039BE5]' : 'border-black/54 group-hover:border-black/87'}`}>
                          {selections['kep'] === item && <div className="w-2 h-2 rounded-full bg-[#039BE5]" />}
                       </div>
                       <input type="radio" name="kep" className="hidden" checked={selections['kep'] === item} onChange={() => handleSelect('kep', item)} />
                       <span className="text-[13px] text-black/87 leading-[18px]">{item}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-[12px] bg-[#FFFFFF] flex justify-end gap-[12px] md-dialog-actions h-[60px] border-t border-[#E0E0E0]">
          <button onClick={handleReset} className="h-[36px] min-w-[88px] px-2 flex items-center justify-center rounded-[2px] transition-colors focus:outline-none hover:bg-gray-100 uppercase text-[14px] font-medium tracking-[0.14px] text-black/54 hover:text-black/87">KHÔI PHỤC</button>
          <button onClick={() => { console.log(selections); onClose(); }} className="h-[36px] min-w-[88px] px-2 flex items-center justify-center rounded-[2px] transition-colors focus:outline-none bg-[#039BE5] hover:bg-[#0288D1] uppercase text-[14px] font-medium tracking-[0.14px] text-white shadow-[0px_2px_5px_rgba(0,0,0,0.26)]">XONG</button>
        </div>
      </motion.div>
    </div>
  );
};

const PriceTableView = ({ data, activeTab, setActiveTab, fetchData, loading, error, lastUpdated }: any) => {
  const [isQuickSelectOpen, setIsQuickSelectOpen] = useState(false);
  const tabs = ['ĐỀ', 'LÔ', 'LÔ ĐẦU', 'XIÊN 2', 'XIÊN 3', 'XIÊN 4', 'ĐỀ TRƯỢT', 'LÔ TRƯỢT', 'ĐỀ ĐẦU'];
  
  return (
    <div className="space-y-3">
      <QuickSelectDialog isOpen={isQuickSelectOpen} onClose={() => setIsQuickSelectOpen(false)} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]"><option>2026-04-16</option></select>
          <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]"><option>Miền Bắc 1</option></select>
          <div className="flex flex-wrap gap-1 ml-2">
            {tabs.map((bet) => (
              <button 
                key={bet} 
                onClick={() => setActiveTab(bet)} 
                className={`px-[12px] h-[26px] min-h-[26px] rounded-[2px] text-[12px] font-medium uppercase tracking-[0.12px] transition-all duration-200 flex items-center justify-center ${
                  activeTab === bet 
                    ? 'bg-[#039BE5] text-white shadow-[0px_2px_5px_rgba(0,0,0,0.26)]' 
                    : 'bg-transparent text-black/87 hover:bg-gray-100'
                }`}
              >
                {bet}
              </button>
            ))}
          </div>
          {error && <span className="text-red-500 text-[10px] font-bold ml-auto animate-pulse">ERROR: {error}</span>}
          {!error && <span className="text-gray-400 text-[10px] ml-auto">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[#666] text-[11px]">
          <div className="flex items-center gap-1">
            <span className="font-normal">Nguy cơ:</span>
            <select className="font-bold text-[#333] bg-transparent focus:outline-none"><option>{data?.status.risk || 1}</option></select>
            <RefreshCw size={12} className={`text-[#039BE5] ml-1 cursor-pointer ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
          </div>
          <div className="flex items-center gap-1 text-[#039BE5] font-bold uppercase cursor-pointer"><span>Kỳ</span> <ChevronDown size={12} /></div>
          <p>Đóng lô: <span className="font-bold text-[#333]">18:15:00</span></p>
          <p>Đóng đề: <span className="font-bold text-[#333]">18:33:00</span></p>
          <p>Tổng tiền: <span className="font-bold text-[#333]">{data?.status.totalAmount.toLocaleString() || 0}</span></p>
          <p>Tổng điểm: <span className="font-bold text-[#333]">{data?.status.totalPoints.toLocaleString() || 0}</span></p>
          <p className="ml-auto">Giá bán TB hiện tại: <span className="font-bold text-[#D32F2F]">{data?.status.avgPrice || 709}</span></p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between py-2 mt-1">
        <div className="flex items-center gap-2">
          <select className="border border-[#ddd] rounded px-1 py-[7px] w-[68px] h-[32px] focus:outline-none text-[13px] bg-white text-black/87 shadow-sm">
            <option>5</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="Giá" className="border border-[#ddd] rounded px-2 py-[7px] w-[80px] h-[32px] focus:outline-none text-[13px] text-[#757575] bg-white placeholder:text-[#757575] shadow-sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-0 ml-1">
          <button className="h-[32px] min-w-[104px] px-[12px] flex items-center justify-center rounded-[2px] transition-colors focus:outline-none bg-transparent hover:bg-gray-100 uppercase text-[14px] font-medium leading-[36px] tracking-[0.14px] text-black/[0.38] cursor-not-allowed">Cài đặt giá</button>
          <button onClick={() => setIsQuickSelectOpen(true)} className="h-[32px] min-w-[116px] px-[12px] flex items-center justify-center rounded-[2px] transition-colors focus:outline-none bg-transparent hover:bg-gray-100 uppercase text-[14px] font-medium leading-[36px] tracking-[0.14px] text-black/87">Chọn nhanh</button>
          <button className="h-[32px] min-w-[52px] px-[12px] flex items-center justify-center rounded-[2px] transition-colors focus:outline-none bg-transparent hover:bg-red-50 uppercase text-[14px] font-medium leading-[36px] tracking-[0.14px] text-[#F44336]">Hủy</button>
          <div className="px-3 flex items-center h-[32px]">
             <button className="h-[32px] min-w-[85px] px-[12px] flex items-center justify-center rounded-[2px] transition-colors focus:outline-none bg-transparent hover:bg-gray-100 uppercase text-[14px] font-medium leading-[36px] tracking-[0.14px] text-black/87">Nhập số</button>
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FFFFFF] shadow-[0px_1px_3px_rgba(0,0,0,0.2),0px_1px_1px_rgba(0,0,0,0.14),0px_2px_1px_-1px_rgba(0,0,0,0.12)]">
        <div className="overflow-x-auto min-h-[500px] p-1">
          <table className="w-full text-left border-collapse min-w-[1632px] block">
            <tbody className="flex flex-col gap-[2px] w-[1628px]">
              <tr className="flex flex-row justify-center items-start pl-[24px] gap-[2px] w-[1628px] h-[22px]">
                 {Array.from({length: 10}).map((_, idx) => (
                    <td key={idx} className="flex flex-col items-start p-[1px] w-[158.59px] h-[22px]">
                       <div className="flex flex-row items-center w-[20px] min-w-[20px] h-[20px] min-h-[20px]">
                           <div className="flex flex-col items-start w-[20px] h-[20px]">
                               <div className="box-border w-[20px] h-[20px] border-[2px] border-[#DDDDDD] rounded-[2px]"></div>
                           </div>
                       </div>
                    </td>
                 ))}
              </tr>
              {Array.from({ length: Math.ceil(data?.numbers.length / 10) || 0 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="flex flex-row justify-center items-start gap-[2px] w-[1628px] h-[63.39px]">
                  <td className="flex flex-col items-start p-[1px] pb-[42.39px] w-[22px] h-[63.39px] box-border">
                    <div className="flex flex-row items-center w-[20px] min-w-[20px] h-[20px] min-h-[20px]">
                      <div className="flex flex-col items-start w-[20px] h-[20px]">
                        <div className="box-border w-[20px] h-[20px] border-[2px] border-[#DDDDDD] rounded-[2px]"></div>
                      </div>
                    </div>
                  </td>
                  <td className="w-[1604px] h-[65px] relative">
                     {data?.numbers.slice(rowIndex * 10, (rowIndex + 1) * 10).map((item: any, idx: number) => {
                       const relativeLeftIndex = idx;
                       const leftPercent = relativeLeftIndex === 9 ? '89.94%' : `${(relativeLeftIndex * 10) + 0.05}%`;
                       const rightPercent = relativeLeftIndex === 9 ? '0.07%' : `${(9 - relativeLeftIndex) * 10 + 0.06}%`;
                       return (
                         <div key={item.id} className="flex flex-col justify-center items-start p-[1px] absolute min-w-[70px] h-[65px] top-[1px]" style={{ left: leftPercent, right: rightPercent }}>
                           <NumberCard id={item.id} price={item.price} val1={item.val1} val2={item.val2} />
                         </div>
                       );
                     })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
      <LayoutGrid size={48} />
    </div>
    <h2 className="text-xl font-medium">{title}</h2>
    <p>Chức năng này đang được phát triển.</p>
  </div>
);

const AnnouncementsView = ({ title, type }: { title: string, type: string }) => {
  return (
    <div id="announcements" className="page-layout carded left-sidenav layout-row flex h-full">
      <div className="center layout-column flex h-full w-full">
        <div className="content-card layout-column flex outlook bg-white shadow-md rounded-sm h-full w-full overflow-hidden">
          <div className="toolbar layout-align-space-between-center layout-row flex items-center justify-between p-4 px-6 border-b border-gray-200">
            <div className="filter-label layout-align-start-center layout-row flex items-center gap-6">
              <div className="label text-[20px] font-normal text-black/87">{title}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-gray-500 font-medium">Từ ngày</label>
                  <div className="relative border-b border-black/12 hover:border-black/54 focus-within:border-[#039BE5] transition-colors py-1">
                    <input 
                      type="date" 
                      className="focus:outline-none text-[14px] text-black/87 w-[140px] bg-transparent" 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-gray-500 font-medium">Đến ngày</label>
                  <div className="relative border-b border-black/12 hover:border-black/54 focus-within:border-[#039BE5] transition-colors py-1">
                    <input 
                      type="date" 
                      className="focus:outline-none text-[14px] text-black/87 w-[140px] bg-transparent" 
                    />
                  </div>
                </div>
                <button className="bg-[#039BE5] hover:bg-[#0288D1] text-white px-4 py-1.5 rounded-sm text-[13px] font-medium uppercase tracking-wider transition-colors shadow-sm ml-2 md-button md-raised md-primary">
                  Submit
                </button>
              </div>
            </div>
            <div>
              <button className="p-2 hover:bg-gray-100 rounded-full text-black/54 transition-colors md-icon-button md-button">
                <Settings size={24} />
              </button>
            </div>
          </div>

          {/* Content Split Pane */}
          <div className="flex flex-1 overflow-hidden min-h-0 bg-white">
            {/* Left Panel: Thread List */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col items-center justify-center p-4">
              <div className="text-[16px] text-black/54 mb-4">
                There are no messages in '{type}'!
              </div>
            </div>
            
            {/* Right Panel: Thread Detail */}
            <div className="w-1/2 flex flex-col items-center justify-center p-4">
              <Mail size={120} className="text-gray-300 mb-4" strokeWidth={1} />
              <span className="text-[16px] text-black/54 font-normal tracking-wide">
                Select a message to read
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for statistical charts
const mockChartData = [
  { name: '01/04', value1: 0.1, value2: 0.2 },
  { name: '02/04', value1: 0.3, value2: 0.1 },
  { name: '03/04', value1: 0.5, value2: 0.4 },
  { name: '04/04', value1: 0.2, value2: 0.6 },
  { name: '05/04', value1: 0.7, value2: 0.5 },
  { name: '06/04', value1: 0.4, value2: 0.8 },
  { name: '07/04', value1: 0.6, value2: 0.7 },
  { name: '08/04', value1: 0.8, value2: 0.9 },
  { name: '09/04', value1: 0.5, value2: 0.3 },
  { name: '10/04', value1: 0.9, value2: 0.6 },
  { name: '11/04', value1: 0.6, value2: 0.4 },
  { name: '12/04', value1: 0.4, value2: 0.5 },
  { name: '13/04', value1: 0.7, value2: 0.8 },
  { name: '14/04', value1: 0.3, value2: 0.2 },
];

const StatisticalProductView = () => {
  return (
    <div id="statistical-product" className="page-layout carded left-sidenav layout-row flex h-full">
      <div className="center layout-column flex h-full w-full">
        <div className="content-card layout-column flex outlook bg-white shadow-md rounded-sm h-full w-full overflow-hidden">
          {/* Toolbar */}
          <div className="toolbar layout-align-space-between-center layout-row flex items-center justify-between p-4 px-6 border-b border-gray-200 flex-wrap gap-4">
            <div className="filter-label layout-align-start-center layout-row flex items-center gap-6 flex-wrap">
              <div className="label text-[20px] font-normal text-black/87">Sản phẩm</div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-gray-500 font-medium">Từ ngày</label>
                  <div className="relative border-b border-black/12 hover:border-black/54 focus-within:border-[#039BE5] transition-colors py-1">
                    <input 
                      type="date" 
                      className="focus:outline-none text-[14px] text-black/87 w-[140px] bg-transparent" 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[12px] text-gray-500 font-medium">Đến ngày</label>
                  <div className="relative border-b border-black/12 hover:border-black/54 focus-within:border-[#039BE5] transition-colors py-1">
                    <input 
                      type="date" 
                      className="focus:outline-none text-[14px] text-black/87 w-[140px] bg-transparent" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              <button className="flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 border border-black/12 rounded-sm text-[13px] font-medium transition-colors shadow-sm focus:outline-none">
                2 Tuần gần nhất <ChevronDown size={16} className="text-gray-500 ml-1" />
              </button>
              <button className="bg-[#039BE5] hover:bg-[#0288D1] text-white px-4 py-1.5 rounded-sm text-[13px] font-medium uppercase tracking-wider transition-colors shadow-sm md-button md-raised md-primary">
                Xem thống kê
              </button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pt-6 px-4 bg-white overflow-y-auto">
            {/* Chart 1: Tiền cược */}
            <div className="flex-1 flex flex-col min-w-0 min-h-[400px]">
              <div className="text-center mb-6">
                <h2 className="text-[18px] font-bold text-[#5d62b5] leading-tight">Tiền cược</h2>
                <p className="text-[13px] font-normal text-gray-500 mt-1">Tổng tiền cược các sản phẩm</p>
              </div>
              <div className="flex-1 min-h-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="name" axisLine={{ stroke: '#BDBDBD' }} tickLine={false} tick={{ fontSize: 11, fill: '#9e9e9e' }}>
                        <label value="Ngày" offset={0} position="insideBottom" className="text-[12px] fill-gray-500 font-medium" />
                      </XAxis>
                      <YAxis axisLine={{ stroke: '#BDBDBD' }} tickLine={false} tick={{ fontSize: 11, fill: '#9e9e9e' }}>
                        <label value="Giá trị" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} className="text-[12px] fill-gray-500 font-medium" />
                      </YAxis>
                      <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="value1" stroke="#5d62b5" strokeWidth={2} dot={{ r: 4, fill: '#5d62b5', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Tiền cược" />
                    </LineChart>
                  </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Thắng thua */}
            <div className="flex-1 flex flex-col min-w-0 min-h-[400px]">
              <div className="text-center mb-6">
                <h2 className="text-[18px] font-bold text-[#5d62b5] leading-tight">Thắng thua</h2>
                <p className="text-[13px] font-normal text-gray-500 mt-1">Tổng thắng thua các sản phẩm</p>
              </div>
              <div className="flex-1 min-h-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                      <XAxis dataKey="name" axisLine={{ stroke: '#BDBDBD' }} tickLine={false} tick={{ fontSize: 11, fill: '#9e9e9e' }}>
                         <label value="Ngày" offset={0} position="insideBottom" className="text-[12px] fill-gray-500 font-medium" />
                      </XAxis>
                      <YAxis axisLine={{ stroke: '#BDBDBD' }} tickLine={false} tick={{ fontSize: 11, fill: '#9e9e9e' }}>
                         <label value="Giá trị" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} className="text-[12px] fill-gray-500 font-medium" />
                      </YAxis>
                      <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="value2" stroke="#4caf50" strokeWidth={2} dot={{ r: 4, fill: '#4caf50', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Thắng thua" />
                    </LineChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication using provided credentials
    setTimeout(() => {
      if (username === 'bomayratgiau' && password === 'Qaz6789@') {
        onLogin(username);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D323E] p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-white rounded-sm shadow-2xl overflow-hidden"
      >
        <div className="bg-[#039BE5] p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-sm flex items-center justify-center font-bold text-3xl italic mx-auto mb-4">789</div>
          <h1 className="text-2xl font-bold tracking-tight">ONE789 AGENT</h1>
          <p className="text-white/80 text-sm mt-1 uppercase tracking-wider">Hệ thống quản lý đại lý</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#039BE5]/20 focus:border-[#039BE5] transition-all text-sm"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#039BE5]/20 focus:border-[#039BE5] transition-all text-sm"
                placeholder="Nhập mật khẩu"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#039BE5] focus:ring-[#039BE5]" />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-xs text-[#039BE5] hover:underline">Quên mật khẩu?</a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#039BE5] hover:bg-[#0288D1] text-white font-bold py-3 px-4 rounded-sm shadow-lg shadow-[#039BE5]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>ĐĂNG NHẬP</span>
            )}
          </button>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">© 2026 ONE789 AGENT PORTAL. ALL RIGHTS RESERVED.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ĐỀ');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const response = await window.fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem('auth', 'true');
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('auth') === 'true';
    const savedUser = localStorage.getItem('user');
    if (isAuth && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (loading && !data && isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="animate-spin text-[#039BE5]" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={handleLogout} username={user || 'ADMIN'}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardView data={data} />} />
                  <Route path="/traditional/price_table" element={
                    <PriceTableView 
                      data={data} 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab} 
                      fetchData={fetchData} 
                      loading={loading} 
                      error={error} 
                      lastUpdated={lastUpdated} 
                    />
                  } />
                  {/* Announcements */}
                  <Route path="/announcements/normal" element={<AnnouncementsView title="Thông thường" type="normal" />} />
                  <Route path="/announcements/special" element={<AnnouncementsView title="Quan Trọng" type="special" />} />
                  <Route path="/announcements/system" element={<AnnouncementsView title="Hệ thống" type="system" />} />
                  <Route path="/announcements/personal" element={<AnnouncementsView title="Thông báo cá nhân" type="personal" />} />
                  {/* Statistics */}
                  <Route path="/statistical/agent_production" element={<StatisticalProductView />} />
                  <Route path="/statistical/agent_lottery" element={<PlaceholderView title="Tiền cược/Thắng thua XSTT" />} />
                  {/* Account */}
                  <Route path="/account/agency" element={<PlaceholderView title="Danh sách tài khoản" />} />
                  <Route path="/account/sub-account" element={<PlaceholderView title="Tài khoản phụ" />} />
                  <Route path="/account/parameter" element={<PlaceholderView title="Thông tin tài khoản" />} />
                  {/* Reports */}
                  <Route path="/accounting/combination/win-lose" element={<PlaceholderView title="Thắng thua tổng hợp" />} />
                  <Route path="/traditional/statement/outstanding" element={<PlaceholderView title="Tiền chưa xử lý (XSTT)" />} />
                  <Route path="/traditional/statement/member" element={<PlaceholderView title="Hội viên thắng thua (XSTT)" />} />
                  <Route path="/traditional/statement/canceled" element={<PlaceholderView title="Đơn hàng đã huỷ (XSTT)" />} />
                  <Route path="/casino789/statement/member" element={<PlaceholderView title="Hội viên thắng thua (789 Casino)" />} />
                  <Route path="/saba/statement/member" element={<PlaceholderView title="Hội viên thắng thua (Bong88)" />} />
                  <Route path="/saba/statement/outstanding" element={<PlaceholderView title="Tiền chưa xử lý (Bong88)" />} />
                  <Route path="/saba/statement/risk-control/handicap-over-under" element={<PlaceholderView title="Cược chấp / Tài Xỉu" />} />
                  <Route path="/saba/statement/risk-control/1x2" element={<PlaceholderView title="1X2" />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}



