
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { ProgressToast } from '@/components/ProgressToast';

export type ProgressStatus = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

export interface ProgressUpdate {
  progress: string;
  status: ProgressStatus;
  message: string;
}

// Replace with your actual WebSocket server URL
const SOCKET_URL = 'https://dev-api.ilmee.ai';

export function useSocketProgress() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressUpdate>({
    progress: '0% completed',
    status: 'idle',
    message: 'Ready to start processing',
  });
  const [isConnected, setIsConnected] = useState(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);
  const location = useLocation();

  // Check if we're on a course-related page or the course editor page
  const isCourseRelatedPage = location.pathname.includes('/course/') || 
                             location.pathname.includes('/upload-syllabus') ||
                             location.pathname === '/courses';
  const isCourseEditorPage = location.pathname.includes('/course/') && location.pathname.includes('/edit');

  // Use ref to track connection attempts
  const connectionAttemptsRef = useRef(0);
  const maxConnectionAttempts = 3;

  // Connect to the socket server when on relevant pages
  useEffect(() => {
    // Only connect if we're on a course-related page
    if (!isCourseRelatedPage) {
      console.log('Not on course page, skipping socket connection');
      return;
    }

    console.log('Attempting to connect socket on:', location.pathname);
    
    // Force reconnection if previously failed
    if (connectionAttemptsRef.current > 0 && connectionAttemptsRef.current < maxConnectionAttempts) {
      console.log(`Reconnection attempt ${connectionAttemptsRef.current} of ${maxConnectionAttempts}`);
    }

    const socketConnection = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      timeout: 20000, // Increase timeout for slow connections
      forceNew: connectionAttemptsRef.current > 0, // Force new connection on retry
    });

    socketConnection.on('connect', () => {
      setIsConnected(true);
      setSocketId(socketConnection.id);
      console.log('Socket connected with ID:', socketConnection.id);
      // Reset connection attempts on successful connection
      connectionAttemptsRef.current = 0;
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      connectionAttemptsRef.current += 1;
      
      if (connectionAttemptsRef.current >= maxConnectionAttempts) {
        console.error('Maximum connection attempts reached');
        toast.error('Unable to establish socket connection', {
          description: 'Please refresh the page and try again',
        });
      }
    });

    socketConnection.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketConnection.on('progress', (data: ProgressUpdate) => {
      console.log('Progress update:', data);
      setProgressData(data);
      
      // Re-enable toast notifications
      updateProgressToast(data);
    });

    setSocket(socketConnection);

    // Cleanup function is only called when component unmounts
    // or when isCourseRelatedPage changes to false
    return () => {
      // Only disconnect if we're navigating away from course pages
      // and not logging out or going to another course page
      if (!location.pathname.includes('/login') && !isCourseRelatedPage) {
        console.log('Disconnecting socket');
        socketConnection.disconnect();
      } else {
        console.log('Preserving socket connection');
      }
    };
  }, [isCourseRelatedPage, location.pathname]);

  // Get numeric progress for progress bar
  const getNumericProgress = useCallback((): number => {
    const progressString = progressData.progress;
    const match = progressString.match(/(\d+)%/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  }, [progressData.progress]);

  // Update or create progress toast
  const updateProgressToast = useCallback((data: ProgressUpdate) => {
    const numericProgress = parseFloat(data.progress.match(/(\d+)%/)?.[1] || '0');
    
    // Don't show toasts on the editor page as we have our own progress UI
    if (isCourseEditorPage) {
      return;
    }
    
    // Dismiss any existing toasts if we're idle
    if (data.status === 'idle') {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      return;
    }
    
    // For all other statuses, manage the toast
    if (toastIdRef.current) {
      // If process completed or errored, dismiss after delay
      if (data.status === 'completed' || data.status === 'error') {
        toast.custom(
          (id) => (
            <ProgressToast
              progress={numericProgress}
              status={data.status}
              message={data.message}
            />
          ),
          {
            id: toastIdRef.current,
            duration: 5000, // Auto-dismiss after 5 seconds
          }
        );
        
        // Reset the toast ID after dismissal
        setTimeout(() => {
          toastIdRef.current = undefined;
        }, 5000);
      } else {
        // Just update the existing toast
        toast.custom(
          (id) => (
            <ProgressToast
              progress={numericProgress}
              status={data.status}
              message={data.message}
            />
          ),
          {
            id: toastIdRef.current,
            duration: Infinity, // Keep showing while processing
          }
        );
      }
    } else {
      // Create a new toast if none exists and status is not idle
      if (data.status === 'starting' || data.status === 'processing' || 
          data.status === 'completed' || data.status === 'error') {
        toastIdRef.current = toast.custom(
          (id) => (
            <ProgressToast
              progress={numericProgress}
              status={data.status}
              message={data.message}
            />
          ),
          {
            id: undefined,
            duration: Infinity,
            position: 'top-right',
          }
        );
      }
    }
  }, [isCourseEditorPage]);

  return {
    socket,
    socketId,
    isConnected,
    progressData,
    progressPercent: getNumericProgress(),
    progressStatus: progressData.status,
    progressMessage: progressData.message,
  };
}
