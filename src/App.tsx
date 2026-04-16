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
  ChevronRight, Tag, BookOpen, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      className="border-r border-b border-[#FFEBC3] p-[2px] bg-[#F2F8FF] hover:bg-white transition-colors cursor-pointer group"
    >
      <div className="flex h-16 bg-[#F2F8FF] rounded-sm group-hover:shadow-inner relative overflow-hidden">
        <div className="flex flex-col items-center justify-center border-r border-[#FFEBC3] bg-white/50 px-1">
            <input type="checkbox" className="mb-1 cursor-pointer" id={`check-${id}`} />
            <span className="font-bold text-[12px] bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center border border-[#ddd] shadow-sm font-sans">
              {id}
            </span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center relative">
           <motion.span 
             key={price}
             initial={{ opacity: 0.5, scale: 1.1 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`font-bold text-[13px] leading-none mb-1 font-sans ${price > 750 ? 'text-[#D32F2F]' : 'text-[#0033FF]'}`}
           >
             {price}
           </motion.span>
           <div className="text-[9px] text-[#999] text-center leading-tight font-sans">
             <div>{val1}</div>
             <div>{val2}</div>
           </div>
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

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-4 h-16 transition-colors">
              <span className="font-medium text-[14px] text-black uppercase tracking-[0.14px]">BOMAYRATGIUAU</span>
              <ChevronDown size={16} className="text-black/54" />
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

const PriceTableView = ({ data, activeTab, setActiveTab, fetchData, loading, error, lastUpdated }: any) => {
  const tabs = ['ĐỀ', 'LÔ', 'LÔ ĐẦU', 'XIÊN 2', 'XIÊN 3', 'XIÊN 4', 'ĐỀ TRƯỢT', 'LÔ TRƯỢT', 'ĐỀ ĐẦU'];
  return (
    <div className="space-y-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]"><option>2026-04-16</option></select>
          <select className="appearance-none bg-transparent border-b border-[#ccc] py-1 px-2 focus:outline-none font-bold text-[#333]"><option>Miền Bắc 1</option></select>
          <div className="flex flex-wrap gap-1 ml-2">
            {tabs.map((bet) => (
              <button key={bet} onClick={() => setActiveTab(bet)} className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase transition-all duration-200 ${activeTab === bet ? 'bg-[#039BE5] text-white' : 'bg-white text-[#555] hover:bg-gray-100'}`}>{bet}</button>
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
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5 py-2 border-t border-[#eee] mt-1">
        <select className="border border-[#ddd] rounded px-1 py-1 w-14 focus:outline-none text-[11px]"><option>5</option></select>
        <input type="text" placeholder="Giá" className="border border-[#ddd] rounded px-2 py-1 w-20 focus:outline-none text-[11px]" />
        <div className="flex items-center gap-3 ml-1">
          <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Cài đặt giá</button>
          <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Chọn nhanh</button>
          <button className="text-[#D32F2F] hover:text-red-700 font-bold text-[10px] uppercase transition-colors">Hủy</button>
          <div className="h-4 w-[1px] bg-[#ccc]"></div>
          <button className="text-[#555] hover:text-[#039BE5] font-bold text-[10px] uppercase transition-colors">Nhập số</button>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white border border-[#ddd] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-10 border-l border-t border-[#FFEBC3] min-w-[1000px]">
            {data?.numbers.map((item: any) => (<NumberCard key={item.id} id={item.id} price={item.price} val1={item.val1} val2={item.val2} />))}
          </div>
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

export default function App() {
  const [activeTab, setActiveTab] = useState('ĐỀ');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="animate-spin text-[#039BE5]" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <MainLayout>
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
          <Route path="/announcements/normal" element={<PlaceholderView title="Thông báo thông thường" />} />
          <Route path="/announcements/special" element={<PlaceholderView title="Thông báo quan trọng" />} />
          <Route path="/announcements/system" element={<PlaceholderView title="Thông báo hệ thống" />} />
          <Route path="/announcements/personal" element={<PlaceholderView title="Thông báo cá nhân" />} />
          {/* Statistics */}
          <Route path="/statistical/agent_production" element={<PlaceholderView title="Thống kê sản phẩm" />} />
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
    </BrowserRouter>
  );
}



