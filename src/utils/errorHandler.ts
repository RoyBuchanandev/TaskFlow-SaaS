type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorLog {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: string;
  userId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

const isProduction = process.env.NODE_ENV === 'production';
const API_URL = import.meta.env.VITE_API_URL;
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'error';

export const logError = async (
  error: Error | string,
  severity: ErrorSeverity = 'error',
  metadata?: Record<string, unknown>
) => {
  if (!isProduction) return;

  if (LOG_LEVEL === 'error' && severity !== 'error') return;

  const errorLog: ErrorLog = {
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    severity,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    metadata
  };

  try {
    await fetch(`${API_URL}/api/log-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog),
    });
  } catch {
    if (severity === 'error') {
      const fallbackLog = {
        ...errorLog,
        additionalInfo: 'Error logging failed, using fallback'
      };
      localStorage.setItem(`error_${Date.now()}`, JSON.stringify(fallbackLog));
    }
  }
};

export const handleApiError = async (error: unknown) => {
  if (error instanceof Error) {
    await logError(error);
    return {
      message: isProduction 
        ? 'Ha ocurrido un error. Por favor, intenta de nuevo más tarde.'
        : error.message
    };
  }
  return { message: 'Error desconocido' };
};

export const sanitizeErrorMessage = (message: string): string => {
  const sensitivePatterns = [
    /api[_-]?key/i,
    /auth[_-]?token/i,
    /password/i,
    /secret/i,
    /supabase/i,
    /connection[_-]?string/i
  ];

  let sanitizedMessage = message;
  sensitivePatterns.forEach(pattern => {
    sanitizedMessage = sanitizedMessage.replace(
      new RegExp(`(${pattern.source})[^\\s]*`, 'gi'),
      '$1:[REDACTED]'
    );
  });

  return sanitizedMessage;
};

export const createErrorBoundary = (component: string) => ({
  handleError: async (error: Error) => {
    await logError(error, 'error', { component });
  },
  fallback: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Lo sentimos, algo salió mal
        </h2>
        <p className="text-[#9b9ba4] mb-8">
          Estamos trabajando para solucionar el problema
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-[#0099ff] hover:text-[#0099ff]/90 underline"
        >
          Recargar página
        </button>
      </div>
    </div>
  )
}); 