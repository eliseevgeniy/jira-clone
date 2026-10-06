import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './BurndownChart.module.scss';

export const BurndownChart = ({ data }) => {
  if (!data.length) {
    return <p className={styles.empty}>Нет данных для графика.</p>;
  }

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Burndown активного спринта</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            label={{ value: 'Задачи', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="ideal"
            name="Идеальная линия"
            stroke="#95a5a6"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            name="Осталось задач"
            stroke="#e74c3c"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};