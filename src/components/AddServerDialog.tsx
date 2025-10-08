import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServer: (server: any) => void;
}

export function AddServerDialog({ open, onOpenChange, onAddServer }: AddServerDialogProps) {
  const [serverType, setServerType] = useState("");
  const [serverName, setServerName] = useState("");
  const [port, setPort] = useState("");
  const [version, setVersion] = useState("");

  const serverTypes = [
    {
      id: "mysql",
      name: "MySQL",
      description: "Popular open-source relational database",
      defaultPort: "3306",
      versions: ["8.0.34", "8.0.33", "5.7.42", "5.7.41"]
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Advanced open-source relational database",
      defaultPort: "5432",
      versions: ["15.3", "15.2", "14.8", "13.11"]
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "Popular NoSQL document database",
      defaultPort: "27017",
      versions: ["7.0.0", "6.0.6", "5.0.18", "4.4.22"]
    },
    {
      id: "redis",
      name: "Redis",
      description: "In-memory data structure store",
      defaultPort: "6379",
      versions: ["7.0.11", "6.2.12", "6.0.19", "5.0.14"]
    },
    {
      id: "mariadb",
      name: "MariaDB",
      description: "Open-source relational database",
      defaultPort: "3306",
      versions: ["10.11.3", "10.6.13", "10.5.20", "10.4.29"]
    }
  ];

  const selectedServerType = serverTypes.find(type => type.id === serverType);

  const handleSubmit = () => {
    if (!serverType || !serverName || !port || !version) return;

    const newServer = {
      id: `${serverType}-${Date.now()}`,
      name: serverName,
      type: serverType,
      version,
      status: "stopped" as const,
      port: parseInt(port),
      availableVersions: selectedServerType?.versions || []
    };

    onAddServer(newServer);
    onOpenChange(false);
    
    // Reset form
    setServerType("");
    setServerName("");
    setPort("");
    setVersion("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Database Server</DialogTitle>
          <DialogDescription>
            Choose a database server type and configure its settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Database Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serverTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    serverType === type.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setServerType(type.id);
                    setServerName(type.name);
                    setPort(type.defaultPort);
                    setVersion(type.versions[0]);
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{type.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {serverType && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input
                    id="name"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="Enter server name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="Enter port number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Version</Label>
                <Select value={version} onValueChange={setVersion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedServerType?.versions.map((ver) => (
                      <SelectItem key={ver} value={ver}>
                        v{ver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!serverType || !serverName || !port || !version}
          >
            Add Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}