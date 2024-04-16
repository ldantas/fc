Repositório do Desafio: Implementar domain events do Customer


Lendo sobre algumas estratégias para implementação da notificação dos eventos
há diversos caminhos a serem seguidos.

Em aplicações reais devemos considerar em que momento a notificação pode ser enviada:
se a notificação deve acontecer antes ou depois de efetivar eventuais transações,
se os alvos dos handlers e o próprio negócio suporta consistencia eventual e ações
de mitigação de inconsistencias. (por exemplo: persistir os eventos para replay manual, caso necessário)

Levando em consideração o contexto do curso, optei pelo caminho:
 - Criar uma classe AgreggateRoot que conterá a lista de eventos;
 - Alterar a entity Customer para adicionar os eventos na AgreggateRoot
    - uma nova funcao estática para criar o objeto Customer, que gera o evento de criação
    - adicionar o evento ao metodo changeAddress
 - Criar uma func notifyAll no Dispatcher, para ser invocado no momento adequado.
    
Na customer.spec.ts, foram adicionado testes para verificar a geração dos eventos na Entity.
Na customer-event.spec.ts, foram adicionado testes para verificar a chamada aos handles, de acordo com a proposta do desafio.
Na event-dispatcher.spec.ts, foram adicionados testes para validar o novo metodo notifyAll.



