import type { Request, Response } from 'express';
import { ObjectId, ReturnDocument } from 'mongodb';
import { getDb } from './mongo';

export interface ProductDTO {
  _id?: string;
  nome: string;
  descricao: string;
  cor: string;
  peso: number;
  tipo: string;
  preco: number;
  dataCadastro: string;
}

// Listar todos os produtos
export async function getProdutos(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const produtos = await db.collection('produtos').find().toArray();
  res.json(produtos);
}

// Buscar produto por ID ou Nome
export async function getProdutoPorIdOuNome(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const { id } = req.params;
  try {
    // Se for um ObjectId válido, tenta buscar por ID
    if (ObjectId.isValid(id)) {
      const produtoPorId = await db.collection('produtos').findOne({ _id: new ObjectId(id) });
      if (produtoPorId) {
        res.json(produtoPorId);
        return;
      }
    }
    // Se não achou por ID, tenta buscar por nome
    const produtoPorNome = await db.collection('produtos').findOne({ nome: id });
    if (produtoPorNome) {
      res.json(produtoPorNome);
      return;
    }

    res.status(404).json({ mensagem: 'Produto não encontrado' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
}

// Criar novo produto
export async function criarProduto(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const { nome, descricao, cor, peso, tipo, preco } = req.body;
  const novoProduto: Omit<ProductDTO, '_id'> = {
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
    dataCadastro: new Date().toISOString(),
  };
  const result = await db.collection('produtos').insertOne(novoProduto);
  res.status(201).json({ ...novoProduto, _id: result.insertedId.toString() });
}

// Atualizar produto existente
export async function atualizarProduto(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const { id } = req.params;
  const { nome, descricao, cor, peso, tipo, preco } = req.body;
  try {
    const result = await db.collection('produtos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { nome, descricao, cor, peso, tipo, preco } },
      { returnDocument: ReturnDocument.AFTER }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
  } catch {
    res.status(400).json({ mensagem: 'ID inválido' });
  }
}

// Deletar produto
export async function deletarProduto(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const { id } = req.params;
  try {
    const result = await db.collection('produtos').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
  } catch {
    res.status(400).json({ mensagem: 'ID inválido' });
  }
}
