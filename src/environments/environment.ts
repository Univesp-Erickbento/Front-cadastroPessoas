export const environment = {
  production: false,

  // IP da sua API principal (onde está o Spring Boot)
  apiUrl: 'http://192.168.1.200:9090/api/pessoas',

  // Caso use autenticação separada
  AUTH_API: 'http://192.168.1.200:9090/auth',

  // API principal, se quiser dividir entre módulos
  MAIN_API: 'http://192.168.1.200:9090'
};
