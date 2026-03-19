"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type UserStat = {
  date: string;
  count: number;
};

type CategoryStat = {
  name: string;
  count: number;
  color: string;
};

export function AnalyticsDashboard({
  userStats,
  categoryStats,
}: {
  userStats: UserStat[];
  categoryStats: CategoryStat[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
      {/* Registration Trends Line Chart */}
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-site-border)",
        padding: "1.5rem",
        borderRadius: "4px"
      }}>
        <h3 style={{ 
          margin: "0 0 1.5rem 0", 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          textTransform: "uppercase", 
          fontSize: "1rem",
          color: "var(--color-site-white)"
        }}>
          Heti Regisztrációk
        </h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer>
            <LineChart data={userStats} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-site-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-site-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--color-site-card)", 
                  border: "1px solid var(--color-esport-teal)",
                  borderRadius: "4px",
                  color: "white"
                }}
                itemStyle={{ color: "var(--color-esport-teal)" }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="var(--color-esport-teal)" 
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-site-bg)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "var(--color-esport-teal)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-site-border)",
        padding: "1.5rem",
        borderRadius: "4px"
      }}>
        <h3 style={{ 
          margin: "0 0 1.5rem 0", 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          textTransform: "uppercase", 
          fontSize: "1rem",
          color: "var(--color-site-white)"
        }}>
          Cikkek Kategóriánként
        </h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer>
            <BarChart data={categoryStats} margin={{ top: 5, right: 0, bottom: 5, left: -30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-site-muted)" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="var(--color-site-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                contentStyle={{ 
                  backgroundColor: "var(--color-site-card)", 
                  border: "1px solid var(--color-val-red)",
                  borderRadius: "4px"
                }}
              />
              <Bar dataKey="count" fill="var(--color-val-red)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
