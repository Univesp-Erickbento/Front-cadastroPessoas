// environment.prod.ts
export const environment = {
  production: true,

  // Módulo de Autenticação
  AUTH_API: 'http://45.93.100.30:9090/auth',

  // Módulo Cadastro de Pessoas
  cadastroPessoasApi: 'http://45.93.100.30:9090/api',

  // Módulo Consulta de Pessoas (clientes, funcionários)
  consultaPessoasApi: 'http://45.93.100.30:9091/api',
  cadastroClienteApi: 'http://45.93.100.30:9091/api',
  cadastroFuncionarioApi: 'http://45.93.100.30:9091/api',

  // Módulo Cadastro de Endereço
  cadastroEnderecoApi: 'http://45.93.100.30:9092/api',

  // Módulo Consulta de Endereços
  consultaEnderecoApi: 'http://45.93.100.30:9093/api',

  // Endpoint completo de salvar endereço (separado como no dev)
  salvarEnderecoApi: 'http://45.93.100.30:9093/api/enderecos',
};
