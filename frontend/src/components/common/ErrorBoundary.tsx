import { Component, type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>문제가 발생했습니다</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>새로고침</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
