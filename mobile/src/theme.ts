export interface ThemeColors {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    success: string;
    error: string;
    inputBackground: string;
}

export const lightTheme: ThemeColors = {
    background: '#f0f9ff',
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    primary: '#0284c7',
    border: '#e2e8f0',
    success: '#10b981',
    error: '#ef4444',
    inputBackground: '#ffffff',
};

export const darkTheme: ThemeColors = {
    background: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    primary: '#38bdf8',
    border: '#334155',
    success: '#34d399',
    error: '#f87171',
    inputBackground: '#334155',
};
