export const environment = {
  production: true,

  // APIs segmentadas por serviço
  AUTH_API: 'http://45.93.100.30:9090/auth',

  // Pessoas - Cadastro (Spring Boot rodando na porta 9090)
  cadastroPessoasApi: 'http://45.93.100.30:9090/api',

  // Pessoas - Consulta + Cadastro Cliente e Funcionário (porta 9091)
  consultaPessoasApi: 'http://45.93.100.30:9091/api',
  cadastroClienteApi: 'http://45.93.100.30:9091/api',
  cadastroFuncionarioApi: 'http://45.93.100.30:9091/api',

  // Endereço
  cadastroEnderecoApi: 'http://45.93.100.30:9092/api',
  consultaEnderecoApi: 'http://45.93.100.30:9093/api',
};
