import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { 
  Database, 
  Table as TableIcon, 
  Columns, 
  Play, 
  Save, 
  Plus, 
  X,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Key,
  FileText,
  ArrowLeft
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface ConnectionInfo {
  serverId: string;
  serverName: string;
  serverType: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface DatabaseViewerProps {
  connectionInfo: ConnectionInfo | null;
  onClose: () => void;
}

interface QueryTab {
  id: string;
  title: string;
  query: string;
  results?: any[];
  isExecuting?: boolean;
  error?: string;
}

export function DatabaseViewer({ connectionInfo, onClose }: DatabaseViewerProps) {
  const [activeQueryTab, setActiveQueryTab] = useState("query-1");
  const [queryTabs, setQueryTabs] = useState<QueryTab[]>([
    { id: "query-1", title: "Query 1", query: "SELECT * FROM users LIMIT 10;" }
  ]);
  const [expandedDatabases, setExpandedDatabases] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  // Mock database structure
  const databaseStructure = {
    databases: [
      {
        name: "myapp_db",
        tables: [
          {
            name: "users",
            type: "table",
            columns: [
              { name: "id", type: "INT", isPrimary: true },
              { name: "username", type: "VARCHAR(255)", isPrimary: false },
              { name: "email", type: "VARCHAR(255)", isPrimary: false },
              { name: "created_at", type: "TIMESTAMP", isPrimary: false }
            ]
          },
          {
            name: "posts",
            type: "table",
            columns: [
              { name: "id", type: "INT", isPrimary: true },
              { name: "user_id", type: "INT", isPrimary: false },
              { name: "title", type: "VARCHAR(255)", isPrimary: false },
              { name: "content", type: "TEXT", isPrimary: false },
              { name: "created_at", type: "TIMESTAMP", isPrimary: false }
            ]
          },
          {
            name: "categories",
            type: "table",
            columns: [
              { name: "id", type: "INT", isPrimary: true },
              { name: "name", type: "VARCHAR(100)", isPrimary: false },
              { name: "description", type: "TEXT", isPrimary: false }
            ]
          }
        ]
      }
    ]
  };

  // Mock query results
  const mockResults = [
    { id: 1, username: "john_doe", email: "john@example.com", created_at: "2024-01-15 10:30:00" },
    { id: 2, username: "jane_smith", email: "jane@example.com", created_at: "2024-01-16 09:15:00" },
    { id: 3, username: "bob_wilson", email: "bob@example.com", created_at: "2024-01-17 14:20:00" },
    { id: 4, username: "alice_brown", email: "alice@example.com", created_at: "2024-01-18 11:45:00" },
    { id: 5, username: "charlie_davis", email: "charlie@example.com", created_at: "2024-01-19 16:10:00" },
  ];

  const addNewQueryTab = () => {
    const newTabId = `query-${queryTabs.length + 1}`;
    const newTab: QueryTab = {
      id: newTabId,
      title: `Query ${queryTabs.length + 1}`,
      query: ""
    };
    setQueryTabs([...queryTabs, newTab]);
    setActiveQueryTab(newTabId);
  };

  const closeQueryTab = (tabId: string) => {
    if (queryTabs.length === 1) return; // Don't close last tab
    
    const newTabs = queryTabs.filter(tab => tab.id !== tabId);
    setQueryTabs(newTabs);
    
    if (activeQueryTab === tabId) {
      setActiveQueryTab(newTabs[0].id);
    }
  };

  const executeQuery = (tabId: string) => {
    setQueryTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, isExecuting: true, error: undefined }
        : tab
    ));

    // Simulate query execution
    setTimeout(() => {
      setQueryTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              isExecuting: false, 
              results: mockResults,
              error: undefined
            }
          : tab
      ));
    }, 1500);
  };

  const updateQuery = (tabId: string, query: string) => {
    setQueryTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, query } : tab
    ));
  };

  const toggleDatabaseExpansion = (dbName: string) => {
    setExpandedDatabases(prev => 
      prev.includes(dbName) 
        ? prev.filter(name => name !== dbName)
        : [...prev, dbName]
    );
  };

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(name => name !== tableName)
        : [...prev, tableName]
    );
  };

  const activeTab = queryTabs.find(tab => tab.id === activeQueryTab);

  if (!connectionInfo) return null;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to DevStack
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <h1 className="text-lg font-semibold">
                  {connectionInfo.serverName} - {connectionInfo.database}
                </h1>
                <Badge variant="outline" className="ml-2">
                  {connectionInfo.serverType.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Connected to {connectionInfo.host}:{connectionInfo.port}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 min-h-0 p-4">
        {/* Database Schema Sidebar */}
        <div className="w-80 border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Schema Browser</h3>
              <Button size="sm" variant="ghost">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {databaseStructure.databases.map((database) => (
                <div key={database.name} className="mb-2">
                  <Collapsible
                    open={expandedDatabases.includes(database.name)}
                    onOpenChange={() => toggleDatabaseExpansion(database.name)}
                  >
                    <CollapsibleTrigger className="flex items-center gap-1 p-2 hover:bg-accent rounded w-full text-left">
                      {expandedDatabases.includes(database.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">{database.name}</span>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="ml-4 mt-1">
                        {database.tables.map((table) => (
                          <div key={table.name} className="mb-1">
                            <Collapsible
                              open={expandedTables.includes(table.name)}
                              onOpenChange={() => toggleTableExpansion(table.name)}
                            >
                              <CollapsibleTrigger className="flex items-center gap-1 p-1 hover:bg-accent rounded w-full text-left">
                                {expandedTables.includes(table.name) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                                <TableIcon className="h-3 w-3" />
                                <span className="text-xs">{table.name}</span>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <div className="ml-4 mt-1">
                                  {table.columns.map((column) => (
                                    <div key={column.name} className="flex items-center gap-1 p-1 text-xs text-muted-foreground">
                                      {column.isPrimary ? (
                                        <Key className="h-3 w-3 text-yellow-500" />
                                      ) : (
                                        <Columns className="h-3 w-3" />
                                      )}
                                      <span>{column.name}</span>
                                      <span className="text-xs opacity-60">({column.type})</span>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Query Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Query Tabs */}
          <div className="flex items-center gap-2 border-b border-border p-2">
            <div className="flex items-center gap-1 flex-1">
              {queryTabs.map((tab) => (
                <div key={tab.id} className="flex items-center">
                  <Button
                    variant={activeQueryTab === tab.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveQueryTab(tab.id)}
                    className="rounded-r-none border-r-0"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {tab.title}
                  </Button>
                  {queryTabs.length > 1 && (
                    <Button
                      variant={activeQueryTab === tab.id ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => closeQueryTab(tab.id)}
                      className="rounded-l-none px-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={addNewQueryTab}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {activeTab && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Query Editor */}
              <div className="border-b border-border">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Query Editor</h4>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={activeTab.isExecuting}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => executeQuery(activeTab.id)}
                        disabled={activeTab.isExecuting || !activeTab.query.trim()}
                      >
                        {activeTab.isExecuting ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        {activeTab.isExecuting ? "Executing..." : "Execute"}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={activeTab.query}
                    onChange={(e) => updateQuery(activeTab.id, e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Results Area */}
              <div className="flex-1 min-h-0">
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">Results</h4>
                  {activeTab.results ? (
                    <ScrollArea className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(activeTab.results[0] || {}).map((column) => (
                              <TableHead key={column} className="font-medium">
                                {column}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeTab.results.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell key={cellIndex} className="font-mono text-sm">
                                  {String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : activeTab.error ? (
                    <Card className="border-destructive">
                      <CardContent className="p-4">
                        <p className="text-destructive text-sm">{activeTab.error}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Execute a query to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}