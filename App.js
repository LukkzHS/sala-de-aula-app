import React, { useState } from "react";
import { StyleSheet, Text, View, Button, ActivityIndicator, Image } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StatusBar } from "expo-status-bar";

// Configure o GoogleSignin com o Web Client ID
GoogleSignin.configure({
  webClientId: "SEU_WEB_CLIENT_ID_AQUI", // Substitua pelo ID correto do google-services.json
});

// Funções de autenticação
const onLogin = async () => {
  try {
    const user = await GoogleSignin.signIn();
    return user;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

const onLogout = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    throw error;
  }
};

// Tela de Login
const LoginScreen = ({ login }) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  return (
    <View style={styles.layout}>
      {isSigninInProgress && <ActivityIndicator size="large" />}
      <Text style={styles.title}>Login</Text>
      <Button
        title="Entrar com Google"
        onPress={() => {
          setIsSigninInProgress(true);
          onLogin()
            .then((user) => {
              console.log("Usuário logado:", user);
              login(user); // Atualiza o estado no componente App
            })
            .catch((error) => {
              console.error("Erro durante o login:", error);
              setIsSigninInProgress(false); // Retorna ao estado inicial em caso de erro
            });
        }}
      />
    </View>
  );
};

// Tela Home
const HomeScreen = ({ user, login }) => (
  <View style={styles.layout}>
    <Text style={styles.title}>Bem-vindo(a), {user.user.name}!</Text>
    <Image
      source={{ uri: user.user.photo }}
      style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
    />
    <Button
      title="Sair"
      onPress={() =>
        onLogout().then(() => {
          login(null);
        })
      }
    />
  </View>
);

// Componente principal
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {user ? (
        <HomeScreen user={user} login={setUser} />
      ) : (
        <LoginScreen login={setUser} />
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
