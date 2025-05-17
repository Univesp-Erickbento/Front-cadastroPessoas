export const environment = {
  production: false,

  // API local (Spring Boot rodando em máquina de desenvolvimento)
  apiUrl: 'http://192.168.1.200:9090/api',

  // Autenticação local
  AUTH_API: 'http://192.168.1.200:9090/auth',

  // Endpoint principal caso tenha múltiplos módulos
  MAIN_API: 'http://192.168.1.200:9090'
};
