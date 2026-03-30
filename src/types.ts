import React from 'react';
import { 
  Smartphone, 
  Settings, 
  ShoppingBag, 
  Camera, 
  Cloud, 
  Music, 
  MessageSquare, 
  Calendar, 
  Search,
  Battery,
  Wifi,
  Signal,
  Clock,
  Home,
  ChevronLeft,
  X,
  Palette,
  Bell,
  Lock,
  User,
  Info,
  Globe,
  Mic,
  Volume2,
  Sun,
  Moon,
  Play,
  SkipBack,
  SkipForward
} from 'lucide-react';

export type AppId = 'home' | 'settings' | 'appstore' | 'camera' | 'weather' | 'music' | 'messages' | 'calendar' | 'browser' | 'profile' | 'paint' | 'snake' | 'minesweeper' | 'emails' | 'calculator' | 'notes' | 'nebula-ai' | 'computer-hub';

export interface WidgetConfig {
  id: string;
  type: 'weather' | 'clock' | 'music' | 'calendar';
  size: 'small' | 'medium' | 'large';
}

export interface FolderConfig {
  id: string;
  name: string;
  appIds: AppId[];
}

export type HomeItem = 
  | { type: 'app'; id: AppId }
  | { type: 'folder'; id: string }
  | { type: 'widget'; id: string };

export interface UserProfile {
  username: string;
  bio: string;
  avatar: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  username: 'Nebula Explorer',
  bio: 'Navigating the digital cosmos one app at a time.',
  avatar: 'https://picsum.photos/seed/nebula-user/200/200'
};

export interface AppConfig {
  id: AppId;
  name: string;
  icon: any;
  color: string;
  component: React.ComponentType<any>;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  accent: string;
  glass: string;
}

export const THEMES: Theme[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    bg: 'bg-black',
    accent: 'text-purple-500',
    glass: 'rgba(255, 255, 255, 0.05)'
  },
  {
    id: 'nebula-pink',
    name: 'Nebula Pink',
    bg: 'bg-slate-900',
    accent: 'text-pink-500',
    glass: 'rgba(255, 100, 200, 0.05)'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    bg: 'bg-zinc-950',
    accent: 'text-cyan-400',
    glass: 'rgba(0, 255, 255, 0.05)'
  }
];
