# Recuperação de senha

**RF - Requisitos Funcionais**

 - O usuário deve poder recuperar sua senha informando seu email
 - O usuário deve receber um email com instruções de recuperação de senha
 - O usuário deve poder resetar sua senha

**RNF - Requisitos não Funcionais**

 - Utilizar mailtrap para testar envios em ambiente de dev
 - Utilizar Amazon SES para envios em produção
 - O envio de emails deve acontecer em segundo plano (background job)

**RN Regras de Negócios**
 - O Link enviado por email para resetar a senha, deve expirar em 2h
 - O usuario precisa confirmar a nova senha ao resetar sua senha

# Atalização do Perfil

**RF - Requisitos Funcionais**

 - O usuário deve poder atalizar seu perfil (nome, email , senha)

**RNF - Requisitos não Funcionais**


**RN Regras de Negócios**
 - O usuário não pode alterar seu email para um email já utilizado por outro usuário
 - Para atualizar a senha o usuário deve informar a senha antiga
 - Para atualizar a senha o usuário precisa confirmar a nova senha

# Painel do prestador

**RF - Requisitos Funcionais**

 - O usuário deve poder listar seus agendamentos de 1 dia específico
 - O prestador deve receber uma notificação sempre que houver um novo agendamento
 - O prestador deve poder visualizar as notificações não lidas

**RNF - Requisitos não Funcionais**

 - Os agendamentos do prestador no dia devem ser armazenados em cache
 - As notificações do prestador devem ser armazenadas em MongoDB
 - As notificações do prestador devem ser enviadas em tempo-real utilizando socket.io


**RN Regras de Negócios**

 - A notificação deve ter um status de lida ou não lida para que o prestador possa controlar

# Agendamento de serviços

**RF - Requisitos Funcionais**

 - O usuário deve poder  listar todos os prestadores de serviços cadastrados
 - O usuário deve poder visualizar os dias de um mês com pelo menos 1 horário disponível de um prestador
 - O usuário deve poder listar os horários disponíveis de  1 dia de um prestador
 - O usuário deve poder realizar um novo agendamento com um prestador

**RNF - Requisitos não Funcionais**

 - A listagem de prestadores deve ser armazenada em cache

**RN - Regras de Negócios**

 - Cada agendamento deve durar 1 hora exatamente
 - Os agendamentos devem estar disponíveis entre 8h e 18h (primeiro as 8:00 e último as 17:00)
 - O usuário não pode agendar em um horário já ocupado
 - O usuário não pode agendar um horário que já passou
 - O usuário não pode marcar um horário consigo mesmo
