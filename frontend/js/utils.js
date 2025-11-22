// Pequenas utilidades usadas pelo frontend
export function formatDateISO(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  } catch (e) {
    return dateStr;
  }
}

export function isValidEmail(email) {
  return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
}
