import { useState } from "react";
import { Play, Square, Download, Trash2, Settings, ChevronDown, Database } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

interface DatabaseServer {
  id: string;
  name: string;
  type: string;
  version: string;
  status: "running" | "stopped" | "downloading" | "installing";
  port: number;
  availableVersions: string[];
  downloadProgress?: number;
}

interface DatabaseCardProps {
  server: DatabaseServer;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onVersionChange: (id: string, version: string) => void;
  onDownload: (id: string, version: string) => void;
  onOpenViewer: (id: string) => void;
}

export function DatabaseCard({ 
  server, 
  onStart, 
  onStop, 
  onDelete, 
  onVersionChange, 
  onDownload,
  onOpenViewer
}: DatabaseCardProps) {
  const [selectedVersion, setSelectedVersion] = useState(server.version);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-gray-500";
      case "downloading": return "bg-blue-500";
      case "installing": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running": return "Running";
      case "stopped": return "Stopped";
      case "downloading": return "Downloading";
      case "installing": return "Installing";
      default: return "Unknown";
    }
  };

  const isProcessing = server.status === "downloading" || server.status === "installing";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{server.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
            <Badge variant="outline" className="text-xs">
              {getStatusText(server.status)}
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Port: {server.port} • v{server.version}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isProcessing && server.downloadProgress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{server.downloadProgress}%</span>
            </div>
            <Progress value={server.downloadProgress} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Version</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                disabled={isProcessing}
              >
                v{selectedVersion}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {server.availableVersions.map((version) => (
                <DropdownMenuItem
                  key={version}
                  onClick={() => {
                    setSelectedVersion(version);
                    if (version !== server.version) {
                      onVersionChange(server.id, version);
                    }
                  }}
                >
                  v{version}
                  {version === server.version && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Current
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="flex gap-2 w-full">
          {server.status === "running" ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStop(server.id)}
              className="flex-1"
              disabled={isProcessing}
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => onStart(server.id)}
              className="flex-1"
              disabled={isProcessing || server.status === "stopped"}
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" disabled={isProcessing}>
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => onDownload(server.id, selectedVersion)}
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-2" />
                Download v{selectedVersion}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(server.id)}
                className="text-destructive"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {(server.type === "mysql" || server.type === "postgresql" || server.type === "mariadb") && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onOpenViewer(server.id)}
            className="w-full gap-2"
            disabled={server.status !== "running"}
          >
            <Database className="h-4 w-4" />
            Open Viewer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}