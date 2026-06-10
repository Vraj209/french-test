export const dynamic = "force-dynamic";

function metricLine(name: string, value: number) {
  return `${name} ${Number.isFinite(value) ? value.toFixed(3) : "0"}`;
}

export function GET() {
  const generatedAtSeconds = Date.now() / 1000;
  const uptimeSeconds =
    typeof process.uptime === "function" ? process.uptime() : 0;

  const body = [
    "# HELP francivo_up Whether the Francivo app is serving requests.",
    "# TYPE francivo_up gauge",
    "francivo_up 1",
    "# HELP francivo_process_uptime_seconds Process uptime in seconds.",
    "# TYPE francivo_process_uptime_seconds gauge",
    metricLine("francivo_process_uptime_seconds", uptimeSeconds),
    "# HELP francivo_metrics_generated_timestamp_seconds Unix timestamp when metrics were generated.",
    "# TYPE francivo_metrics_generated_timestamp_seconds gauge",
    metricLine("francivo_metrics_generated_timestamp_seconds", generatedAtSeconds),
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8"
    }
  });
}
