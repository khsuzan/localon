import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Database, Eye, EyeOff } from "lucide-react";

interface DatabaseServer {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
  port: number;
}

interface DatabaseAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: DatabaseServer | null;
  onConnect: (connectionInfo: any) => void;
}

export function DatabaseAuthDialog({ open, onOpenChange, server, onConnect }: DatabaseAuthDialogProps) {
  const [databaseName, setDatabaseName] = useState("");
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [host, setHost] = useState("localhost");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!server || !databaseName || !username) return;

    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      const connectionInfo = {
        serverId: server.id,
        serverName: server.name,
        serverType: server.type,
        host,
        port: server.port,
        database: databaseName,
        username,
        password
      };

      onConnect(connectionInfo);
      setIsConnecting(false);
      onOpenChange(false);
      
      // Reset form
      setDatabaseName("");
      setUsername("root");
      setPassword("");
      setHost("localhost");
    }, 2000);
  };

  const getDefaultDatabases = (type: string) => {
    switch (type) {
      case "mysql":
      case "mariadb":
        return ["information_schema", "mysql", "performance_schema", "sys"];
      case "postgresql":
        return ["postgres", "template0", "template1"];
      default:
        return [];
    }
  };

  if (!server) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect to {server.name}
          </DialogTitle>
          <DialogDescription>
            Enter your database credentials to connect to the server
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Connection Details</CardTitle>
            <CardDescription className="text-sm">
              {server.type.toUpperCase()} v{server.version} • Port {server.port}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={server.port}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Select value={databaseName} onValueChange={setDatabaseName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or enter database name" />
                </SelectTrigger>
                <SelectContent>
                  {getDefaultDatabases(server.type).map((db) => (
                    <SelectItem key={db} value={db}>
                      {db}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or enter custom database name"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={!databaseName || !username || isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}