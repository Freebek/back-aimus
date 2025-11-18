export interface DbCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const DB_HOSTS: Record<string, DbCredentials> = {
  'MIX 5x5 (1)': {
    host: process.env.DB_S5_HOST || 'localhost',
    port: parseInt(process.env.DB_S5_PORT || '3306'),
    username: process.env.DB_S5_USER || 'root',
    password: process.env.DB_S5_PASSWORD || '',
    database: 's5_dust2srv',
  },
  'MIX 5x5 (2)': {
    host: process.env.DB_S7_HOST || 'localhost',
    port: parseInt(process.env.DB_S7_PORT || '3306'),
    username: process.env.DB_S7_USER || 'root',
    password: process.env.DB_S7_PASSWORD || '',
    database: 's7_mix2',
  },
  'MIX 5x5 (3)': {
    host: process.env.DB_S8_HOST || 'localhost',
    port: parseInt(process.env.DB_S8_PORT || '3306'),
    username: process.env.DB_S8_USER || 'root',
    password: process.env.DB_S8_PASSWORD || '',
    database: 's8_mix3',
  },
  'RETAKE (1)': {
    host: process.env.DB_S10_HOST || 'localhost',
    port: parseInt(process.env.DB_S10_PORT || '3306'),
    username: process.env.DB_S10_USER || 'root',
    password: process.env.DB_S10_PASSWORD || '',
    database: 's10_retake1',
  },
  'RETAKE (2)': {
    host: process.env.DB_S11_HOST || 'localhost',
    port: parseInt(process.env.DB_S11_PORT || '3306'),
    username: process.env.DB_S11_USER || 'root',
    password: process.env.DB_S11_PASSWORD || '',
    database: 's11_retake2',
  },
  'RETAKE (3)': {
    host: process.env.DB_S12_HOST || 'localhost',
    port: parseInt(process.env.DB_S12_PORT || '3306'),
    username: process.env.DB_S12_USER || 'root',
    password: process.env.DB_S12_PASSWORD || '',
    database: 's12_retake3',
  },
  'Arena USP': {
    host: process.env.DB_S14_HOST || 'localhost',
    port: parseInt(process.env.DB_S14_PORT || '3306'),
    username: process.env.DB_S14_USER || 'root',
    password: process.env.DB_S14_PASSWORD || '',
    database: 's14_dmatch',
  },
  '5x5 MIX Surprise Round': {
    host: process.env.DB_S19_HOST || 'localhost',
    port: parseInt(process.env.DB_S19_PORT || '3306'),
    username: process.env.DB_S19_USER || 'root',
    password: process.env.DB_S19_PASSWORD || '',
    database: 's19_surprise_server',
  },
  'AWP LEGO': {
    host: process.env.DB_S20_HOST || 'localhost',
    port: parseInt(process.env.DB_S20_PORT || '3306'),
    username: process.env.DB_S20_USER || 'root',
    password: process.env.DB_S20_PASSWORD || '',
    database: 's20_awp_lego',
  },
};

// reverse mapping by db name so API can accept either friendly name or db key
export const DB_NAME_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(DB_HOSTS).map(([label, config]) => [config.database, label]),
);

export const DEFAULT_HOST = 'MIX 5x5 (1)';
