import React, { useState, useEffect } from 'react';
// Custom routing system - no React Router needed
import styled, { createGlobalStyle } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { SaveStatusProvider } from './contexts/SaveStatusContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import Dashboard from './pages/Dashboard';
import ChartOfAccounts from './pages/ChartOfAccounts';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Expenses from './pages/Expenses';
// import Invoices from './pages/Invoices';
// import Reports from './pages/Reports';
import { authService } from './services/authService';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
  }

  #root {
    height: 100vh;
    overflow: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18px;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const initApp = async () => {
      try {
        // Database is now initialized automatically in the service
        // Check authentication
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Listen for navigation messages from Electron menu
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'NAVIGATE') {
        setCurrentPage(event.data.page);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle app cleanup on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clean up database connection
      if ((window as any).databaseService && (window as any).databaseService.close) {
        (window as any).databaseService.close();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <LoadingScreen>
          <LoadingSpinner />
          <div>Initializing My Family Finances...</div>
        </LoadingScreen>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyle />
        <LoginScreen onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'accounts': return <ChartOfAccounts onNavigate={setCurrentPage} />;
      case 'customers': return <Customers onNavigate={setCurrentPage} />;
      case 'vendors': return <Vendors onNavigate={setCurrentPage} />;
      case 'expenses': return <Expenses onNavigate={setCurrentPage} />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        <MainContent>
          <Header 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onLogout={handleLogout}
          />
          <ContentArea>
            {renderCurrentPage()}
          </ContentArea>
        </MainContent>
      </AppContainer>
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SaveStatusProvider>
        <AppContent />
      </SaveStatusProvider>
    </ThemeProvider>
  );
}

export default App;