// export const environment = {
//   production: false,

//   // Módulo de Autenticação (supondo que seja o mesmo do cadastro de pessoas)
//   AUTH_API: 'http://192.168.1.200:9090/auth',

//   // Módulo Cadastro de Pessoas
//   cadastroPessoasApi: 'http://192.168.1.200:9090/api',

//   // Módulo Consulta de Pessoas (inclui clientes e funcionários)
//   consultaPessoasApi: 'http://192.168.1.200:9091/api',
//   cadastroClienteApi: 'http://192.168.1.200:9091/api',
//   cadastroFuncionarioApi: 'http://192.168.1.200:9091/api',

//   // Módulo Cadastro de Endereço
//   cadastroEnderecoApi: 'http://192.168.1.200:9092/api',

//   // Módulo Consulta de Endereços
//   consultaEnderecoApi: 'http://192.168.1.200:9093/api',
// };

// environment.production.ts

export const environment = {
  production: false,

  // Módulo de Autenticação
  AUTH_API: 'http://localhost:9090/auth',

  // Módulo Cadastro de Pessoas
  cadastroPessoasApi: 'http://localhost:9090/api',

  // Módulo Consulta de Pessoas (clientes, funcionários)
  consultaPessoasApi: 'http://localhost:9091/api',
  cadastroClienteApi: 'http://localhost:9091/api',
  cadastroFuncionarioApi: 'http://localhost:9091/api',

  // Módulo Cadastro de Endereço
  cadastroEnderecoApi: 'http://localhost:9092/api',

  // Módulo Consulta de Endereços
  consultaEnderecoApi: 'http://localhost:9093/api',
  salvarEnderecoApi: 'http://localhost:9093/api/enderecos',

};
