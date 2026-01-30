import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Submission } from '@shared/schema';
import { subDays, format, isSameDay } from 'date-fns';

interface ThreatChartProps {
  submissions?: Submission[];
}

export function ThreatChart({ submissions = [] }: ThreatChartProps) {
  // Generate last 7 days of data
  const chartData = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayName = format(date, 'EEE');

    // Calculate submissions for this day
    const daySubmissions = submissions.filter(s =>
      isSameDay(new Date(s.submittedAt), date)
    ).length;

    // Base mock data for threats (simulating generic system threats)
    const baseThreats = [12, 19, 8, 24, 15, 32, 28][i];

    return {
      name: dayName,
      threats: baseThreats,
      activity: daySubmissions * 10 + 20, // Scale submissions for visibility
      verified: submissions.filter(s => isSameDay(new Date(s.submittedAt), date) && s.status === 'verified').length
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Area
            type="monotone"
            dataKey="threats"
            stroke="hsl(var(--destructive))"
            fillOpacity={1}
            fill="url(#colorThreats)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="activity"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorActivity)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}