export type Fornecedor = {
  id: number;
  nome: string;
  cnpj: string;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MsgType = "success" | "error" | "info";
