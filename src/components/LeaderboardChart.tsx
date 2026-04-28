import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const LeaderboardChart = ({ data, theme }: any) => {
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <div
      className="p-8 rounded-3xl mb-16"
      style={{
        border: `1px solid ${theme.border}`,
        background: `linear-gradient(to bottom, ${theme.soft}, transparent)`,
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: `${theme.accent}22`,
            color: theme.accent,
          }}
        >
          Leaderboard
        </span>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData}>
            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="name"
              stroke="#888"
              tick={{ fill: "#aaa", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y AXIS */}
            <YAxis
              stroke="#555"
              tick={{ fill: "#666", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            {/* TOOLTIP */}
            <Tooltip
              cursor={{
                fill: `${theme.accent}22`, // subtle gold highlight
              }}
              contentStyle={{
                background: "gray",
                border: `1px solid ${theme.accent}55`,
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
                boxShadow: `0 10px 30px ${theme.accent}22`,
              }}
              labelStyle={{ color: theme.accent }}
            />

            {/* GRADIENT */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.accent} />
                <stop offset="100%" stopColor="#ffffff22" />
              </linearGradient>
            </defs>

            {/* BARS */}
            <Bar
              dataKey="score"
              radius={[10, 10, 0, 0]}
              animationDuration={900}
            >
              {sortedData.map((entry: any, index: number) => {
                const isTop3 = index < 3;

                return (
                  <Cell
                    key={index}
                    fill={isTop3 ? "url(#barGradient)" : "#1f1f22"}
                    style={{
                      filter: isTop3
                        ? `drop-shadow(0 0 10px ${theme.accent}55)`
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeaderboardChart;
