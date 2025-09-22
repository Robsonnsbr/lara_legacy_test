import { useState } from "react";
import Spinner from "./Spinner";
import Alert from "./Alert";
import { z } from "zod";
import {
  fornecedorSchema,
  FornecedorForm,
  FornecedorPayload,
} from "./zod/schema";

type Props = {
  onCreated: (okMessage: string) => void;
  onError?: (errMessage: string) => void;
};

type FormErrors = Partial<Record<keyof FornecedorForm, string>>;

export default function SupplierForm({ onCreated, onError }: Props) {
  const [form, setForm] = useState<FornecedorForm>({
    nome: "",
    cnpj: "",
    email: "",
  });
  const [touched, setTouched] = useState<{
    nome: boolean;
    cnpj: boolean;
    email: boolean;
  }>({
    nome: false,
    cnpj: false,
    email: false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [errors, setErrors] = useState<FormErrors>({});

  function setField<K extends keyof FornecedorForm>(
    key: K,
    value: FornecedorForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onBlur<K extends keyof FornecedorForm>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }));
    const fieldSchema = fornecedorSchema.shape[key] as z.ZodTypeAny;
    const result = fieldSchema.safeParse(form[key]);
    setErrors((prev) => {
      const next = { ...prev };
      if (result.success) delete next[key];
      else next[key] = result.error.issues[0]?.message ?? "Campo inválido.";
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setTouched({ nome: true, cnpj: true, email: true });

    const parsed = fornecedorSchema.safeParse(form);
    if (!parsed.success) {
      const next: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FornecedorForm;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      setMsgType("error");
      const m = "Verifique os campos destacados.";
      setMsg(m);
      onError?.(m);
      return;
    }

    const payload: FornecedorPayload = parsed.data;
    setSaving(true);
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
      const r = await fetch(`${API_BASE}/api/v1/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setForm({ nome: "", cnpj: "", email: "" });
        setTouched({ nome: false, cnpj: false, email: false });
        setErrors({});
        setMsgType("success");
        const m = "Fornecedor criado com sucesso.";
        setMsg(m);
        onCreated(m);
      } else if (r.status === 422) {
        const j = await r.json();
        const backendMsg =
          Object.values(j.errors || {})
            .flat()
            .join(" ") || "Falha de validação.";
        setMsgType("error");
        setMsg(backendMsg);
        onError?.(backendMsg);
      } else {
        const m = "Erro ao salvar.";
        setMsgType("error");
        setMsg(m);
        onError?.(m);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold sm:text-lg">
          Cadastrar fornecedor
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          CNPJ pode ser informado com ou sem máscara.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="px-4 py-4 sm:px-6 sm:py-6 space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nome */}
          <div className="sm:col-span-2">
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              className={`w-full rounded-xl border px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${
                touched.nome && errors.nome
                  ? "border-rose-300 ring-rose-200 focus:border-rose-400"
                  : ""
              }`}
              placeholder="Ex.: ACME Ltda"
              value={form.nome}
              onChange={(e) => setField("nome", e.target.value)}
              onBlur={() => onBlur("nome")}
              required
              aria-invalid={!!(touched.nome && errors.nome)}
              aria-describedby={
                touched.nome && errors.nome ? "err-nome" : undefined
              }
            />
            {touched.nome && errors.nome && (
              <p id="err-nome" className="mt-1 text-xs text-rose-600">
                {errors.nome}
              </p>
            )}
          </div>

          {/* CNPJ */}
          <div>
            <label htmlFor="cnpj" className="mb-1 block text-sm font-medium">
              CNPJ
            </label>
            <input
              id="cnpj"
              className={`w-full rounded-xl border px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${
                touched.cnpj && errors.cnpj
                  ? "border-rose-300 ring-rose-200 focus:border-rose-400"
                  : ""
              }`}
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(e) => setField("cnpj", e.target.value)}
              onBlur={() => onBlur("cnpj")}
              required
              inputMode="numeric"
              aria-invalid={!!(touched.cnpj && errors.cnpj)}
              aria-describedby={
                touched.cnpj && errors.cnpj ? "err-cnpj" : undefined
              }
            />
            {touched.cnpj && errors.cnpj && (
              <p id="err-cnpj" className="mt-1 text-xs text-rose-600">
                {errors.cnpj}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email (opcional)
            </label>
            <input
              id="email"
              className={`w-full rounded-xl border px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${
                touched.email && errors.email
                  ? "border-rose-300 ring-rose-200 focus:border-rose-400"
                  : ""
              }`}
              placeholder="contato@empresa.com"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => onBlur("email")}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={
                touched.email && errors.email ? "err-email" : undefined
              }
            />
            {touched.email && errors.email && (
              <p id="err-email" className="mt-1 text-xs text-rose-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            disabled={saving}
            aria-disabled={saving}
          >
            {saving && <Spinner size={16} />}
            Salvar
          </button>
          <Alert message={msg} type={msgType} />
        </div>
      </form>
    </section>
  );
}
