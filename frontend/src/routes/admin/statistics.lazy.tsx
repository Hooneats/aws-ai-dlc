import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, TextField, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getTodayDashboard, getDailySummary, getDailyByTable, getDailyByMenu, getPeriodSummary } from '@/api/statistics';
import { AdminLayout } from '@/components/layout/AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export const Route = createLazyFileRoute('/admin/statistics')({ component: StatisticsPage });

function StatisticsPage() {
  const [tab, setTab] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  const [dailyDate, setDailyDate] = useState(today);
  const [periodStart, setPeriodStart] = useState(today);
  const [periodEnd, setPeriodEnd] = useState(today);

  return (
    <AdminLayout>
      <Typography variant="h6" gutterBottom>매출 통계</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="실시간 대시보드" /><Tab label="일별 통계" /><Tab label="기간별 통계" />
      </Tabs>
      {tab === 0 && <TodayTab />}
      {tab === 1 && <DailyTab date={dailyDate} onDateChange={setDailyDate} />}
      {tab === 2 && <PeriodTab start={periodStart} end={periodEnd} onStartChange={setPeriodStart} onEndChange={setPeriodEnd} />}
    </AdminLayout>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card><CardContent>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </CardContent></Card>
  );
}

function TodayTab() {
  const { data } = useQuery({ queryKey: ['statistics', 'today'], queryFn: getTodayDashboard, refetchInterval: 60000 });
  if (!data) return null;

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="오늘 매출" value={`${data.sales.toLocaleString()}원`} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="주문 건수" value={`${data.orders}건`} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="영업 테이블" value={`${data.activeTables}/${data.totalTables}`} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="객단가" value={`${data.avgPerTable.toLocaleString()}원`} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>인기 메뉴 TOP 5</Typography>
            <Bar data={{ labels: data.topMenus.map((m) => m.menuName), datasets: [{ label: '판매량', data: data.topMenus.map((m) => m.quantity), backgroundColor: '#1976d2' }] }} options={{ indexAxis: 'y' as const }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>시간대별 추이</Typography>
            <Line data={{ labels: data.hourlyStats.map((h) => `${h.hour}시`), datasets: [{ label: '매출', data: data.hourlyStats.map((h) => h.sales), borderColor: '#1976d2' }, { label: '주문', data: data.hourlyStats.map((h) => h.orders), borderColor: '#ff9800', yAxisID: 'y1' }] }} options={{ scales: { y1: { position: 'right' as const } } }} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

function DailyTab({ date, onDateChange }: { date: string; onDateChange: (d: string) => void }) {
  const { data: summary } = useQuery({ queryKey: ['statistics', 'daily', date], queryFn: () => getDailySummary(date), enabled: !!date });
  const { data: byTable = [] } = useQuery({ queryKey: ['statistics', 'daily', 'tables', date], queryFn: () => getDailyByTable(date), enabled: !!date });
  const { data: byMenu = [] } = useQuery({ queryKey: ['statistics', 'daily', 'menus', date], queryFn: () => getDailyByMenu(date), enabled: !!date });

  return (
    <>
      <TextField type="date" value={date} onChange={(e) => onDateChange(e.target.value)} size="small" sx={{ mb: 2 }} />
      {summary && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}><KpiCard label="총 매출" value={`${summary.totalSales.toLocaleString()}원`} /></Grid>
          <Grid size={{ xs: 6 }}><KpiCard label="총 주문" value={`${summary.totalOrders}건`} /></Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>테이블별 매출</Typography>
            <Bar data={{ labels: byTable.map((t) => `T${t.tableNo}`), datasets: [{ label: '매출', data: byTable.map((t) => t.sales), backgroundColor: '#1976d2' }] }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>메뉴별 판매</Typography>
            <Bar data={{ labels: byMenu.map((m) => m.menuName), datasets: [{ label: '수량', data: byMenu.map((m) => m.quantity), backgroundColor: '#ff9800' }] }} options={{ indexAxis: 'y' as const }} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

function PeriodTab({ start, end, onStartChange, onEndChange }: { start: string; end: string; onStartChange: (d: string) => void; onEndChange: (d: string) => void }) {
  const { data } = useQuery({ queryKey: ['statistics', 'period', start, end], queryFn: () => getPeriodSummary(start, end), enabled: !!start && !!end });

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField type="date" label="시작일" value={start} onChange={(e) => onStartChange(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField type="date" label="종료일" value={end} onChange={(e) => onEndChange(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
      </Box>
      {data && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 4 }}><KpiCard label="총 매출" value={`${data.totalSales.toLocaleString()}원`} /></Grid>
            <Grid size={{ xs: 4 }}><KpiCard label="총 주문" value={`${data.totalOrders}건`} /></Grid>
            <Grid size={{ xs: 4 }}><KpiCard label="일 평균" value={`${data.avgDailySales.toLocaleString()}원`} /></Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>일별 매출 추이</Typography>
                <Line data={{ labels: data.dailyTrend.map((d) => d.date), datasets: [{ label: '매출', data: data.dailyTrend.map((d) => d.sales), borderColor: '#1976d2', fill: false }] }} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>메뉴 순위</Typography>
                <Bar data={{ labels: data.menuRanking.map((m) => m.menuName), datasets: [{ label: '매출', data: data.menuRanking.map((m) => m.sales), backgroundColor: '#1976d2' }] }} options={{ indexAxis: 'y' as const }} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>요일별 패턴</Typography>
                <Bar data={{ labels: data.dayOfWeekPattern.map((d) => d.day), datasets: [{ label: '평균 매출', data: data.dayOfWeekPattern.map((d) => d.avgSales), backgroundColor: '#ff9800' }] }} />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
