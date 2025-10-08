import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your application preferences and server settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic application configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start servers on boot</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start running servers when the application launches
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Check for updates automatically</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically check for application and server updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Minimize to system tray</Label>
                <p className="text-sm text-muted-foreground">
                  Keep the application running in the background
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Settings</CardTitle>
            <CardDescription>Configure download behavior and locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="download-path">Download Location</Label>
              <div className="flex gap-2">
                <Input 
                  id="download-path"
                  value="C:\DevStack\Downloads"
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline">Browse</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="concurrent-downloads">Concurrent Downloads</Label>
              <Select defaultValue="3">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="download-speed">Download Speed Limit</Label>
              <Select defaultValue="unlimited">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                  <SelectItem value="1mb">1 MB/s</SelectItem>
                  <SelectItem value="5mb">5 MB/s</SelectItem>
                  <SelectItem value="10mb">10 MB/s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server Settings</CardTitle>
            <CardDescription>Default configurations for new servers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-path">Server Installation Path</Label>
              <div className="flex gap-2">
                <Input 
                  id="server-path"
                  value="C:\DevStack\Servers"
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline">Browse</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-path">Data Directory</Label>
              <div className="flex gap-2">
                <Input 
                  id="data-path"
                  value="C:\DevStack\Data"
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline">Browse</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-assign ports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign available ports to new servers
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Application information and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Version</span>
              <Badge variant="outline">v2.1.0</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Last Updated</span>
              <span className="text-sm text-muted-foreground">2 weeks ago</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>License</span>
              <span className="text-sm text-muted-foreground">MIT License</span>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button className="w-full">Check for Updates</Button>
              <Button variant="outline" className="w-full">View Release Notes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}