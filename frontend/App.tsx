import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

type CheckResult = { estado: string; base: string; hora: string };

export default function App() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function comprobarApi() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/salud`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setResult((await response.json()) as CheckResult);
    } catch {
      setResult(null);
      setError("No se pudo conectar. Comprueba NestJS, PostgreSQL y la URL de la API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void comprobarApi();
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FRONTEND · EXPO + REACT NATIVE</Text>
        <Text style={styles.title}>¡Hola, mundo!</Text>
        <Text style={styles.copy}>La pantalla está funcionando y consulta el backend.</Text>
        <Text style={styles.url}>API: {API_URL}</Text>
        {loading ? <Text style={styles.status}>Comprobando…</Text> : null}
        {result ? (
          <Text style={styles.ok}>✓ Backend conectado · PostgreSQL · {result.base}</Text>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable accessibilityRole="button" onPress={() => void comprobarApi()} style={styles.button}>
          <Text style={styles.buttonText}>Volver a comprobar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f3f5ed" },
  card: { width: "100%", maxWidth: 620, alignSelf: "center", padding: 28, borderRadius: 16, backgroundColor: "#ffffff", gap: 12 },
  eyebrow: { color: "#47705f", fontSize: 12, fontWeight: "700", letterSpacing: 1.2 },
  title: { color: "#183a32", fontSize: 30, fontWeight: "800" },
  copy: { color: "#52675d", fontSize: 16 },
  url: { color: "#334d43", fontFamily: "monospace", fontSize: 13 },
  status: { color: "#52675d" },
  ok: { color: "#17633e", fontWeight: "700" },
  error: { color: "#a13030" },
  button: { alignSelf: "flex-start", marginTop: 4, paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#204e43" },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});
