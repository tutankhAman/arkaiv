import { LayoutDashboard, Compass, BookOpen, Info } from 'lucide-react'
import { NavBar } from "./tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Dashboard', url: '/', icon: LayoutDashboard },
    { name: 'Discover', url: '/discover', icon: Compass },
    { name: 'Digest', url: '/digest', icon: BookOpen },
    { name: 'About', url: '/about', icon: Info }
  ]

  return <NavBar items={navItems} />
} 