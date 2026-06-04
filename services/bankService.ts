
export const generateCardNumber = (): string => {
  const parts = [];
  for (let i = 0; i < 4; i++) {
    parts.push(Math.floor(1000 + Math.random() * 9000).toString());
  }
  return parts.join(' ');
};

export const generateExpiry = (): string => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = (now.getFullYear() + 5).toString().slice(-2);
  return `${month}/${year}`;
};

export const generateCVC = (): string => {
  return Math.floor(100 + Math.random() * 899).toString();
};

export const generateSecurityCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SEC-${result}`;
};
