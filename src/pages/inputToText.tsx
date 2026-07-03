// Non entrerà in conflitto con toFixed(2) o con i tuoi calcoli, perché il Context continuerà a
// contenere sempre e solo number. L'unica stringa esiste temporaneamente dentro
//  NumericInput mentre l'utente sta digitando.
import { useEffect, useState } from "react";

type NumericInputProps = {
  value: number;
  placeholder?: string;
  onChange: (value: number) => void;
};

export default function NumericInput({
  value,
  placeholder = "0",
  onChange,
}: NumericInputProps) {
  const [text, setText] = useState("");

  const sanitize = (value: string) => {
    // Permette solo numeri, virgola e punto
    // Se l'utente scrive 12abc€ diventa immediatamente 12
    value = value.replace(/[^0-9.,]/g, "");

    const firstSeparator = value.search(/[.,]/);

    if (firstSeparator !== -1) {
      const before = value.slice(0, firstSeparator + 1);

      const after = value.slice(firstSeparator + 1).replace(/[.,]/g, "");

      value = before + after;
    }

    return value;
  };

  useEffect(() => {
    setText(value === 0 ? "" : value.toString());
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(sanitize(e.target.value));
      }}
      onBlur={() => {
        if (text.trim() === "") {
          onChange(0);

          return;
        }

        const normalized = text.replace(",", ".");

        const parsed = parseFloat(normalized);

        onChange(isNaN(parsed) ? 0 : parsed);
      }}
      style={{
        width: "90px",
        padding: "6px",
        textAlign: "center",
      }}
    />
  );
}
