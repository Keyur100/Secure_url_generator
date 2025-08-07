import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Lazy loaded pages
const CreateSecret = lazy(() => import('./pages/CreateSecret'));
const ViewSecret = lazy(() => import('./pages/ViewSecret'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<CreateSecret />} />
          <Route path="/secret/:id" element={<ViewSecret />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
