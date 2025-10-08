import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Pause, Play, X, Download } from "lucide-react";

interface Download {
  id: string;
  name: string;
  version: string;
  progress: number;
  status: "downloading" | "paused" | "completed" | "failed";
  size: string;
  downloadedSize: string;
  speed: string;
}

interface DownloadsPanelProps {
  downloads: Download[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export function DownloadsPanel({ downloads, onPause, onResume, onCancel }: DownloadsPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "downloading": return "default";
      case "paused": return "secondary";
      case "completed": return "default";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "downloading": return Download;
      case "paused": return Pause;
      case "completed": return Download;
      case "failed": return X;
      default: return Download;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Downloads</h2>
        <p className="text-muted-foreground">
          Manage your database server downloads
        </p>
      </div>

      <div className="space-y-4">
        {downloads.map((download) => {
          const StatusIcon = getStatusIcon(download.status);
          
          return (
            <Card key={download.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    {download.name} v{download.version}
                  </CardTitle>
                  <Badge variant={getStatusColor(download.status)}>
                    {download.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{download.downloadedSize} of {download.size}</span>
                    <span>{download.progress}%</span>
                  </div>
                  <Progress value={download.progress} className="h-2" />
                  {download.status === "downloading" && (
                    <div className="text-xs text-muted-foreground">
                      Speed: {download.speed}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {download.status === "downloading" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPause(download.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  
                  {download.status === "paused" && (
                    <Button
                      size="sm"
                      onClick={() => onResume(download.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  
                  {download.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCancel(download.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {downloads.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No active downloads</h3>
              <p className="text-muted-foreground">
                Download new database servers from the servers tab
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}