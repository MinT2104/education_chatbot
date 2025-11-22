import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Activity, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  RefreshCw,
  Calendar,
  FileText
} from "lucide-react";
import { adminService, type CronStatus } from "../../services/adminService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminCronJobs = () => {
  const [status, setStatus] = useState<CronStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [runningManual, setRunningManual] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [logsLoading, setLogsLoading] = useState(false);
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCronStatus();
      setStatus(data);
    } catch (error: any) {
      console.error("Error fetching cron status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch cron status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const data = await adminService.getCronLogDates();
      setAvailableDates(data.dates || []);
      if (data.dates && data.dates.length > 0 && !selectedDate) {
        setSelectedDate(data.dates[0]); // Select today by default
      }
    } catch (error: any) {
      console.error("Error fetching log dates:", error);
    }
  };

  const fetchLogs = async (date?: string) => {
    try {
      setLogsLoading(true);
      const targetDate = date || selectedDate;
      const data = await adminService.getCronLogs(targetDate);
      setLogs(data.logs || []);
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch logs",
        variant: "destructive",
      });
    } finally {
      setLogsLoading(false);
    }
  };

  const handleManualTrigger = async () => {
    try {
      setRunningManual(true);
      toast({
        title: "🚀 Triggering cron job...",
        description: "Please wait while checking documents",
      });

      const result = await adminService.triggerCronJob();

      toast({
        title: "✅ Cron job completed",
        description: result.message || "Document indexing check completed successfully",
      });

      // Refresh status and logs after completion
      await fetchStatus();
      await fetchLogs();
    } catch (error: any) {
      console.error("Error triggering cron job:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to trigger cron job",
        variant: "destructive",
      });
    } finally {
      setRunningManual(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchLogs(date);
  };

  const parseCronLog = (logLine: string) => {
    // Parse log line: timestamp [LEVEL] message [STATUS] key=value key=value...
    const timestampMatch = logLine.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    const levelMatch = logLine.match(/\[(\w+)\]/);
    
    return {
      raw: logLine,
      timestamp: timestampMatch ? timestampMatch[1] : "",
      level: levelMatch ? levelMatch[1] : "INFO",
    };
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-600 dark:text-red-400";
      case "WARN":
        return "text-yellow-600 dark:text-yellow-400";
      case "CRON_JOB":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchAvailableDates();
    fetchLogs();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cron Jobs Management</h2>
        <p className="text-muted-foreground mt-1">
          Monitor and manage scheduled background tasks
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Document Indexing Cron Job
              </CardTitle>
              <CardDescription className="mt-1">
                Automatically checks and updates document indexing status every 5 minutes
              </CardDescription>
            </div>
            <Button
              onClick={fetchStatus}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status && (
            <>
              {/* Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.running ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Running
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Stopped
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Currently Checking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.isCurrentlyChecking ? (
                      <Badge variant="default" className="bg-blue-600">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Idle</Badge>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Interval</span>
                  </div>
                  <p className="text-lg font-semibold">{status.checkInterval}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Python Server</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {status.pythonServerUrl}
                  </p>
                </div>
              </div>

              {/* Manual Trigger */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Manual Trigger</p>
                  <p className="text-sm text-muted-foreground">
                    Run the cron job immediately to check pending documents
                  </p>
                </div>
                <Button
                  onClick={handleManualTrigger}
                  disabled={runningManual || status.isCurrentlyChecking}
                  className="gap-2"
                >
                  {runningManual ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Now
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Logs Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cron Job Logs
              </CardTitle>
              <CardDescription className="mt-1">
                View execution logs and debug information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Date Selector */}
              <Select value={selectedDate} onValueChange={handleDateChange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => fetchLogs()}
                variant="outline"
                size="sm"
                disabled={logsLoading}
              >
                {logsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs found for {selectedDate || "today"}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="mb-2 text-sm text-muted-foreground">
                Showing {logs.length} log entries for {selectedDate}
              </div>
              <div className="max-h-[500px] overflow-y-auto border rounded-lg p-4 bg-muted/30 font-mono text-xs">
                {logs.map((log, index) => {
                  const parsed = parseCronLog(log);
                  return (
                    <div
                      key={index}
                      className={`py-1 ${getLogLevelColor(parsed.level)} hover:bg-muted/50 px-2 rounded`}
                    >
                      {parsed.raw}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
