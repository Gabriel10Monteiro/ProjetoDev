import { Router } from 'express';
import {
  getProdutos,
  getProdutoPorIdOuNome,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from './productMiddleware';

const router = Router();

// Listar todos os produtos
router.get('/produtos', getProdutos);

// Buscar produto por ID ou nome (apenas uma rota)
router.get('/produtos/:id', getProdutoPorIdOuNome);

// Criar novo produto
router.post('/produtos', criarProduto);

// Atualizar produto existente
router.put('/produtos/:id', atualizarProduto);

// Deletar produto
router.delete('/produtos/:id', deletarProduto);

export default router;
