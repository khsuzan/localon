import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Database, Download, Server } from "lucide-react";

interface DashboardProps {
  servers: any[];
  downloads: any[];
}

export function Dashboard({ servers, downloads }: DashboardProps) {
  const runningServers = servers.filter(s => s.status === "running").length;
  const stoppedServers = servers.filter(s => s.status === "stopped").length;
  const activeDownloads = downloads.filter(d => d.status === "downloading").length;

  const stats = [
    {
      title: "Total Servers",
      value: servers.length,
      description: "Database servers configured",
      icon: Database,
      color: "text-blue-600"
    },
    {
      title: "Running",
      value: runningServers,
      description: "Currently active servers",
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "Stopped",
      value: stoppedServers,
      description: "Inactive servers",
      icon: Server,
      color: "text-gray-600"
    },
    {
      title: "Downloads",
      value: activeDownloads,
      description: "Active downloads",
      icon: Download,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your database servers and system status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest server actions and events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {servers.slice(0, 5).map((server) => (
              <div key={server.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    server.status === "running" ? "bg-green-500" : "bg-gray-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{server.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Port {server.port} • v{server.version}
                    </p>
                  </div>
                </div>
                <Badge variant={server.status === "running" ? "default" : "secondary"}>
                  {server.status}
                </Badge>
              </div>
            ))}
            {servers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No servers configured yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system and application status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Application Version</span>
              <span className="text-sm font-mono">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Platform</span>
              <span className="text-sm">Windows 11</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Update Check</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm">245 MB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}