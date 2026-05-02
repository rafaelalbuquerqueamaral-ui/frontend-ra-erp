import React, {
  useState,
} from "react";

export default function Login({
  onLogin,
}) {
  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  async function entrar() {
    try {
      const res = await fetch(
        "http://localhost:3001/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      const data =
        await res.json();

      if (data.erro) {
        alert(data.erro);
        return;
      }

      localStorage.setItem(
        "usuario",
        JSON.stringify(data)
      );

      onLogin(data);
    } catch (error) {
      console.log(error);

      alert("Erro login");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        background:
          "#0f172a",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 20,
          width: 350,
        }}
      >
        <h1>
          R&A VIDROS ERP
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            marginTop: 20,
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            marginTop: 10,
          }}
        />

        <button
          onClick={entrar}
          style={{
            width: "100%",
            padding: 16,
            marginTop: 20,
            background:
              "#111827",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}