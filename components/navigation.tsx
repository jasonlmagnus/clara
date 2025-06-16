"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useClientStore } from "@/lib/client-store";
import {
  BarChart3,
  Upload,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Home,
  Mail,
  Briefcase,
  BarChart2,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
}: NavigationProps) {
  const clients = useClientStore((s) => s.clients)
  const selectedClient = useClientStore((s) => s.selectedClient)
  const setSelectedClient = useClientStore((s) => s.setSelectedClient)
  const fetchClients = useClientStore((s) => s.fetchClients)

  useEffect(() => {
    fetchClients()
  }, [fetchClients])
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "input", label: "Data Input", icon: Upload },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analysis", label: "Analysis", icon: BarChart2 },
    { id: "deals", label: "Deal Management", icon: Briefcase },
    { id: "template", label: "Templates", icon: Mail },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Image
                src="/magnus_horizontal_logo@.png.webp"
                alt="Magnus Logo"
                width={150}
                height={40}
                priority
              />
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 ${
                      activeTab !== item.id
                        ? "text-magnus-red hover:bg-magnus-red/10"
                        : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedClient ?? "all"}
              onValueChange={(v) =>
                setSelectedClient(v === "all" ? null : v)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">--View all--</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="text-magnus-red hover:bg-magnus-red/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
