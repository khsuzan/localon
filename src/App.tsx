import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DatabaseCard } from "./components/DatabaseCard";
import { AddServerDialog } from "./components/AddServerDialog";
import { DatabaseAuthDialog } from "./components/DatabaseAuthDialog";
import { DatabaseViewer } from "./components/DatabaseViewer";
import { Dashboard } from "./components/Dashboard";
import { DownloadsPanel } from "./components/DownloadsPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { Button } from "./components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "./components/ui/input";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"main" | "database-viewer">("main");
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [servers, setServers] = useState([
    {
      id: "mysql-1",
      name: "MySQL",
      type: "mysql",
      version: "8.0.34",
      status: "running" as const,
      port: 3306,
      availableVersions: ["8.0.34", "8.0.33", "5.7.42", "5.7.41"]
    },
    {
      id: "postgresql-1",
      name: "PostgreSQL",
      type: "postgresql",
      version: "15.3",
      status: "stopped" as const,
      port: 5432,
      availableVersions: ["15.3", "15.2", "14.8", "13.11"]
    },
    {
      id: "mongodb-1",
      name: "MongoDB",
      type: "mongodb",
      version: "7.0.0",
      status: "downloading" as const,
      port: 27017,
      downloadProgress: 65,
      availableVersions: ["7.0.0", "6.0.6", "5.0.18", "4.4.22"]
    }
  ]);

  const [downloads, setDownloads] = useState([
    {
      id: "download-1",
      name: "MongoDB",
      version: "7.0.0",
      progress: 65,
      status: "downloading" as const,
      size: "450 MB",
      downloadedSize: "292 MB",
      speed: "2.4 MB/s"
    },
    {
      id: "download-2",
      name: "Redis",
      version: "7.0.11",
      progress: 100,
      status: "completed" as const,
      size: "15 MB",
      downloadedSize: "15 MB",
      speed: "0 MB/s"
    }
  ]);

  const handleTabChange = (tab: string) => {
    if (tab === "add-server") {
      setShowAddDialog(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleStartServer = (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: "running" as const } : server
    ));
  };

  const handleStopServer = (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: "stopped" as const } : server
    ));
  };

  const handleDeleteServer = (id: string) => {
    setServers(prev => prev.filter(server => server.id !== id));
  };

  const handleVersionChange = (id: string, version: string) => {
    setServers(prev => prev.map(server => 
      server.id === id 
        ? { ...server, version, status: "installing" as const, downloadProgress: 0 } 
        : server
    ));
    
    // Simulate version change process
    setTimeout(() => {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: "stopped" as const, downloadProgress: undefined } : server
      ));
    }, 3000);
  };

  const handleDownload = (id: string, version: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    const newDownload = {
      id: `download-${Date.now()}`,
      name: server.name,
      version,
      progress: 0,
      status: "downloading" as const,
      size: "250 MB",
      downloadedSize: "0 MB",
      speed: "1.8 MB/s"
    };

    setDownloads(prev => [...prev, newDownload]);
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, status: "downloading" as const, downloadProgress: 0 } : s
    ));
  };

  const handleAddServer = (newServer: any) => {
    setServers(prev => [...prev, newServer]);
  };

  const handleOpenViewer = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      setSelectedServer(server);
      setShowAuthDialog(true);
    }
  };

  const handleDatabaseConnect = (connectionInfo: any) => {
    setConnectionInfo(connectionInfo);
    setViewMode("database-viewer");
  };

  const handleCloseDatabaseViewer = () => {
    setViewMode("main");
    setConnectionInfo(null);
  };

  const handlePauseDownload = (id: string) => {
    setDownloads(prev => prev.map(download => 
      download.id === id ? { ...download, status: "paused" as const } : download
    ));
  };

  const handleResumeDownload = (id: string) => {
    setDownloads(prev => prev.map(download => 
      download.id === id ? { ...download, status: "downloading" as const } : download
    ));
  };

  const handleCancelDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard servers={servers} downloads={downloads} />;
      
      case "servers":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Database Servers</h2>
                <p className="text-muted-foreground">
                  Manage your database server instances
                </p>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Server
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServers.map((server) => (
                <DatabaseCard
                  key={server.id}
                  server={server}
                  onStart={handleStartServer}
                  onStop={handleStopServer}
                  onDelete={handleDeleteServer}
                  onVersionChange={handleVersionChange}
                  onDownload={handleDownload}
                  onOpenViewer={handleOpenViewer}
                />
              ))}
            </div>

            {filteredServers.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No servers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first database server"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Server
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      
      case "downloads":
        return (
          <DownloadsPanel
            downloads={downloads}
            onPause={handlePauseDownload}
            onResume={handleResumeDownload}
            onCancel={handleCancelDownload}
          />
        );
      
      case "settings":
        return <SettingsPanel />;
      
      default:
        return <Dashboard servers={servers} downloads={downloads} />;
    }
  };

  // Show Database Viewer as full page
  if (viewMode === "database-viewer") {
    return (
      <>
        <DatabaseViewer
          connectionInfo={connectionInfo}
          onClose={handleCloseDatabaseViewer}
        />
        
        <DatabaseAuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          server={selectedServer}
          onConnect={handleDatabaseConnect}
        />
      </>
    );
  }

  // Show Main Application
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on tablet and up */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">DevStack</h1>
            <Button 
              size="sm" 
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </div>
      </div>

      <AddServerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddServer={handleAddServer}
      />
      
      <DatabaseAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        server={selectedServer}
        onConnect={handleDatabaseConnect}
      />
    </div>
  );
}