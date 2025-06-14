"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Upload, Users, FileText, TrendingUp, Settings, Home, Mail } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "input", label: "Data Input", icon: Upload },
    { id: "deals", label: "Deal Management", icon: Users },
    { id: "analysis", label: "Analysis", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "template", label: "Interview Template", icon: Mail },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">CLARA</span>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
