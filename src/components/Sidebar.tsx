import { Server, Database, Settings, Download, Plus, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "servers", label: "Database Servers", icon: Server },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold">DevStack</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
      
      <Separator />
      
      <div className="p-6 mt-auto">
        <Button className="w-full gap-2" onClick={() => onTabChange("add-server")}>
          <Plus className="h-4 w-4" />
          Add Server
        </Button>
      </div>
    </div>
  );
}