# Configuração do Armazenamento Centralizado

Para que o sistema de gerenciamento de livros funcione entre diferentes máquinas hospedadas no GitHub Pages, você precisa configurar o JSONBin.io.

## ⚠️ Problema Atual
O `localStorage` funciona apenas localmente em cada navegador. Quando outra pessoa acessa o site, ela não vê os livros que você adicionou.

## ✅ Solução: JSONBin.io (Gratuito)

### Passo a Passo:

#### 1. Criar conta no JSONBin.io
1. Acesse: https://jsonbin.io/
2. Clique em **"Sign Up"** e crie uma conta gratuita
3. Confirme seu email e faça login

#### 2. Obter API Key
1. No dashboard do JSONBin, vá em **"API Keys"** (menu lateral)
2. Copie sua **"Master Key"** (começa com `$2a$10$...`)
   - ⚠️ **IMPORTANTE**: Mantenha esta chave segura!

#### 3. Criar um Bin
1. No dashboard, clique em **"Create Bin"**
2. Cole este JSON inicial:
```json
{
  "recommended": [],
  "library": [],
  "topRated": [],
  "newReleases": [],
  "popularNow": []
}
```
3. Clique em **"Save"**
4. Copie o **ID do bin** da URL:
   - A URL será algo como: `https://jsonbin.io/app/bins/65a1b2c3d4e5f6g7h8i9j0k`
   - O ID é: `65a1b2c3d4e5f6g7h8i9j0k`

#### 4. Configurar no código
1. Abra o arquivo `js/storage.js`
2. Encontre estas linhas (por volta da linha 8-9):
```javascript
let JSONBIN_BIN_ID = null; // Coloque o ID do seu bin aqui
let JSONBIN_API_KEY = null; // Coloque sua Master Key aqui
```
3. Substitua pelos seus valores:
```javascript
let JSONBIN_BIN_ID = '65a1b2c3d4e5f6g7h8i9j0k'; // Seu ID aqui
let JSONBIN_API_KEY = '$2a$10$sua_chave_completa_aqui'; // Sua Master Key aqui
```

#### 5. Testar
1. Faça commit e push das alterações no GitHub
2. Aguarde alguns minutos para o GitHub Pages atualizar
3. Abra `admin.html` no navegador
4. Adicione um livro
5. Abra o site em outra máquina/navegador
6. O livro deve aparecer! 🎉

## 📋 Checklist de Configuração

- [ ] Conta criada no JSONBin.io
- [ ] Master Key copiada
- [ ] Bin criado com JSON inicial
- [ ] ID do bin copiado
- [ ] `js/storage.js` atualizado com ID e Key
- [ ] Alterações commitadas e enviadas ao GitHub
- [ ] Testado em duas máquinas diferentes

## ⚙️ Como Funciona

1. **Sem configuração**: O sistema usa apenas `localStorage` (funciona só localmente)
2. **Com configuração**: O sistema sincroniza automaticamente com JSONBin.io
   - Dados são salvos na nuvem
   - Todas as máquinas veem os mesmos dados
   - Sincronização automática a cada 5-10 segundos

## 📊 Limites do Plano Gratuito

- ✅ 1.000 requisições por mês (suficiente para uso pessoal)
- ✅ Dados públicos (qualquer um com o ID pode ler)
- ⚠️ Para produção, considere usar autenticação

## 🔒 Segurança

- Os dados são **públicos** por padrão (qualquer um com o ID pode ler)
- Para projetos pessoais, isso geralmente é aceitável
- Para produção, considere:
  - Usar autenticação no JSONBin
  - Ou migrar para Firebase/Supabase com autenticação

## 🆘 Problemas Comuns

**"Dados não aparecem em outra máquina"**
- Verifique se configurou o ID e Key corretamente
- Verifique se fez commit e push das alterações
- Aguarde alguns minutos para o GitHub Pages atualizar

**"Erro ao salvar"**
- Verifique se a Master Key está correta
- Verifique se o ID do bin está correto
- Verifique se não excedeu o limite de requisições

## 💡 Alternativa (sem configuração)

Se preferir não usar JSONBin, o sistema continuará funcionando com `localStorage` localmente, mas os dados **não serão compartilhados** entre máquinas.

